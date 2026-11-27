const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(fetchImpl) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync('src/lib/partial-leads.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(code, {
    exports, console: { error() {} }, encodeURIComponent, Date, Object,
    process: { env: { NEXT_PUBLIC_SUPABASE_URL: 'https://db.example', SUPABASE_SERVICE_ROLE_KEY: 'k' } },
    fetch: fetchImpl,
  });
  return exports;
}

const draftId = '3f2c1d4e-5a6b-4c7d-8e9f-0a1b2c3d4e5f';

test('cleans form fields and ignores an empty form', () => {
  const lib = load(async () => { throw new Error('no fetch'); });
  const fields = lib.cleanDraftFields({ name: '  Valentina ', email: 'V@Example.COM', date: 'nope', services: ['Florals', 3, ''], source: 'Instagram' });
  assert.equal(fields.name, 'Valentina');
  assert.equal(fields.email, 'v@example.com');
  assert.equal(fields.event_date, null);
  assert.deepEqual([...fields.services], ['Florals']);
  assert.equal(fields.referral_source, 'Instagram');
  assert.equal(lib.hasAnyAnswer(fields), true);
  assert.equal(lib.hasAnyAnswer(lib.cleanDraftFields({ name: '   ', services: [] })), false);
  assert.equal(lib.isDraftId(draftId), true);
  assert.equal(lib.isDraftId('1; drop table'), false);
  assert.equal(lib.cleanStep('reserve', 9).step, 5);
  assert.equal(lib.cleanStep('style_quiz', 8).total, 8);
  assert.equal(lib.cleanStep('venue_checklist', 0).step, 1);
  assert.equal(lib.isDraftForm('inquire'), true);
  assert.equal(lib.isDraftForm('toString'), false);
  assert.equal(lib.stepLabel('consultation', 3), 'Services');
  const extra = lib.cleanExtra({ quizResultTier: 'Elegant', quizScore: 40, 'bad key': 'x', nested: { a: 1 }, empty: '' });
  assert.deepEqual({ ...extra }, { quizResultTier: 'Elegant', quizScore: 40 });
  assert.equal(lib.hasAnyAnswer(lib.cleanDraftFields({}), { weddingYear: '2027' }), true);
});

test('first save inserts one row; later saves update only a still-partial row', async () => {
  const calls = [];
  let rowExists = false;
  const lib = load(async (url, init) => {
    calls.push({ url, method: init.method, prefer: init.headers.Prefer, body: init.body && JSON.parse(init.body) });
    if (init.method === 'PATCH') return { ok: true, json: async () => rowExists ? [{ id: draftId }] : [] };
    rowExists = true;
    return { ok: true, json: async () => null };
  });
  const fields = lib.cleanDraftFields({ celebrationType: 'Wedding' });
  const draft = { form: 'inquire', total: 5, fields, extra: {}, page: '/inquire', userAgent: null };
  await lib.saveDraft(draftId, { ...draft, step: 1 });
  await lib.saveDraft(draftId, { ...draft, step: 2 });
  assert.equal(calls.length, 3);
  assert.match(calls[0].url, /status=eq\.partial/);
  assert.equal(calls[1].method, 'POST');
  assert.match(calls[1].prefer, /ignore-duplicates/);
  assert.equal(calls[1].body.status, 'partial');
  assert.equal(calls[1].body.form, 'inquire');
  assert.equal(calls[2].method, 'PATCH');
  assert.equal(calls[2].body.step_reached, 2);
});

test('submit marks the same row completed and links the lead', async () => {
  let call;
  const lib = load(async (url, init) => { call = { url, prefer: init.headers.Prefer, body: JSON.parse(init.body) }; return { ok: true }; });
  assert.equal(await lib.completeDraft(draftId, 'lead-1', 'style_quiz'), true);
  assert.match(call.prefer, /merge-duplicates/);
  assert.equal(call.body.id, draftId);
  assert.equal(call.body.status, 'completed');
  assert.equal(call.body.lead_id, 'lead-1');
  assert.equal(call.body.step_total, 8);
  assert.equal(call.body.name, undefined, 'completion never overwrites the saved answers');
});

test('cleanup only deletes old partials with no phone and no email', async () => {
  let call;
  const lib = load(async (url, init) => { call = { url, method: init.method }; return { ok: true, json: async () => [{}, {}] }; });
  const result = await lib.purgeStalePartials(new Date('2026-11-27T00:00:00Z'));
  assert.equal(call.method, 'DELETE');
  assert.match(call.url, /status=eq\.partial/);
  assert.match(call.url, /email=is\.null/);
  assert.match(call.url, /phone=is\.null/);
  assert.match(decodeURIComponent(call.url), /updated_at=lt\.2026-10-28T00:00:00\.000Z/);
  assert.equal(result.deleted, 2);
});

test('the inquiry route marks the draft completed only on a saved inquiry', () => {
  const route = fs.readFileSync('src/app/api/leads/route.ts', 'utf8');
  assert.match(route, /if \(leadId && isDraftId\(body\.draftId\) && isDraftForm\(body\.draftForm\)\)/);
  for (const file of ['src/app/reserve/page.tsx', 'src/app/inquire/page.tsx', 'src/app/consultation/ConsultationClient.tsx', 'src/app/quiz/QuizClient.tsx', 'src/app/venue-checklist/ChecklistForm.tsx', 'src/components/planning/BookButton.tsx']) {
    const source = fs.readFileSync(file, 'utf8');
    assert.match(source, /useLeadDraft\(/, file);
    assert.match(source, /\.\.\.leadDraft\.submitFields\(\)/, file);
  }
  const draft = fs.readFileSync('src/app/api/leads/draft/route.ts', 'utf8');
  const imports = draft.split('\n').filter((line) => line.startsWith('import'));
  assert.deepEqual(imports, ['import { cleanDraftFields, cleanExtra, cleanStep, hasAnyAnswer, isDraftForm, isDraftId, saveDraft } from "@/lib/partial-leads";']);
});
