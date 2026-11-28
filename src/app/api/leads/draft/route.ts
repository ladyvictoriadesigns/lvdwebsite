import { cleanDraftFields, cleanExtra, cleanStep, hasAnyAnswer, isDraftForm, isDraftId, saveDraft } from "@/lib/partial-leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Autosave for the website's lead forms. Called while a visitor types and on each
// step; also by navigator.sendBeacon when they leave (text/plain body).
// Never sends email and never tells Meta anything: only the real submit does that.
export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > 20_000) return Response.json({ ok: false }, { status: 413 });
    const body = JSON.parse(raw) as { draftId?: unknown; form?: unknown; step?: unknown; page?: unknown; fields?: unknown; extra?: unknown };
    if (!isDraftId(body.draftId) || !isDraftForm(body.form)) return Response.json({ ok: false }, { status: 400 });

    const fields = cleanDraftFields(body.fields);
    const extra = cleanExtra(body.extra);
    if (!hasAnyAnswer(fields, extra)) return Response.json({ ok: true, skipped: true });

    const { step, total } = cleanStep(body.form, body.step);
    const page = typeof body.page === "string" && /^\/[a-z0-9/_-]{0,80}$/i.test(body.page) ? body.page : null;
    const saved = await saveDraft(body.draftId, {
      form: body.form, step, total, fields, extra, page,
      userAgent: request.headers.get("user-agent")?.slice(0, 400) || null,
    });
    if (!saved.ok) {
      console.error("Partial inquiry save failed.", saved.reason, "detail" in saved ? saved.detail : "");
      return Response.json({ ok: false }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
}
