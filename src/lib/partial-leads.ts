// Partial inquiries: every website lead form saves a draft row as soon as someone
// starts answering, updates it as they go, and flips it to "completed" when the real
// inquiry is saved. One row per form visit (draft id).
// Table: supabase/partial-leads-schema.sql. A partial never fires a Meta Lead or an email.

const FIVE_STEPS = ["Celebration", "Venue, date & guests", "Services", "Vision & investment", "Contact details"];

/** Each form that autosaves: its portal label and step names (step N = names[N - 1]). */
export const DRAFT_FORMS = {
  reserve: { label: "Welcome / Reserve page", steps: FIVE_STEPS },
  inquire: { label: "Inquire page", steps: FIVE_STEPS },
  consultation: { label: "Consultation page", steps: FIVE_STEPS },
  style_quiz: { label: "Style quiz", steps: ["Guests", "Venue", "Florals", "Ceremony", "Reception", "Styling", "Lighting", "Contact details (saw their result)"] },
  venue_checklist: { label: "Venue checklist signup", steps: ["Signup form"] },
  planning_booking: { label: "Planning package booking", steps: ["Booking form"] },
} as const;

export type DraftForm = keyof typeof DRAFT_FORMS;

export function isDraftForm(value: unknown): value is DraftForm {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(DRAFT_FORMS, value);
}

export function stepLabel(form: string, step: number) {
  const steps: readonly string[] = isDraftForm(form) ? DRAFT_FORMS[form].steps : FIVE_STEPS;
  return steps[step - 1] ?? `Step ${step}`;
}

export type PartialLeadFields = {
  celebration_type: string | null;
  event_date: string | null;
  date_undecided: boolean;
  venue: string | null;
  guest_count: string | null;
  services: string[];
  vision: string | null;
  investment: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  referral_source: string | null;
};

export type PartialLead = PartialLeadFields & {
  id: string;
  created_at: string;
  updated_at: string;
  status: "partial" | "completed";
  form: string;
  step_reached: number;
  step_total: number;
  page: string | null;
  lead_id: string | null;
  extra: Record<string, unknown>;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isDraftId(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}

function text(value: unknown, max = 200) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed || null;
}

/**
 * Clean what the browser sends. Field names match the forms' own state
 * (celebrationType, guestCount, ...; "source" is "how did you hear about us").
 */
export function cleanDraftFields(raw: unknown): PartialLeadFields {
  const form = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  const date = text(form.date, 10);
  const email = text(form.email, 254);
  return {
    celebration_type: text(form.celebrationType),
    event_date: date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null,
    date_undecided: form.dateUndecided === true,
    venue: text(form.venue),
    guest_count: text(form.guestCount),
    services: Array.isArray(form.services)
      ? form.services.filter((item): item is string => typeof item === "string").map((item) => item.trim().slice(0, 100)).filter(Boolean).slice(0, 20)
      : [],
    vision: text(form.vision, 5000),
    investment: text(form.investment),
    name: text(form.name),
    email: email ? email.toLowerCase() : null,
    phone: text(form.phone, 40),
    referral_source: text(form.source),
  };
}

/** Small flat object of extra answers (quiz result, checklist edition). Strings, numbers and booleans only. */
export function cleanExtra(raw: unknown): Record<string, string | number | boolean> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(raw).slice(0, 12)) {
    if (!/^[a-zA-Z][a-zA-Z0-9_]{0,40}$/.test(key)) continue;
    if (typeof value === "string" && value.trim()) out[key] = value.trim().slice(0, 300);
    else if (typeof value === "boolean" || (typeof value === "number" && Number.isFinite(value))) out[key] = value;
  }
  return out;
}

export function hasAnyAnswer(fields: PartialLeadFields, extra: Record<string, unknown> = {}) {
  return fields.date_undecided || fields.services.length > 0 || Object.keys(extra).length > 0
    || Object.entries(fields).some(([key, value]) => key !== "services" && typeof value === "string" && value.length > 0);
}

/** Step reached, clamped to the form's own number of steps. */
export function cleanStep(form: DraftForm, value: unknown) {
  const total = DRAFT_FORMS[form].steps.length;
  const step = typeof value === "number" && Number.isInteger(value) && value >= 1 ? Math.min(value, total) : 1;
  return { step, total };
}

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" } };
}

type DraftSave = { form: DraftForm; step: number; total: number; fields: PartialLeadFields; extra: Record<string, unknown>; page: string | null; userAgent: string | null };

/**
 * Save or update the draft. Only rows still marked "partial" are updated, so a
 * late autosave can never turn a completed inquiry back into a partial.
 */
export async function saveDraft(draftId: string, draft: DraftSave) {
  const db = config();
  if (!db) return { ok: false as const, reason: "not_configured" };
  const columns = { ...draft.fields, extra: draft.extra, step_reached: draft.step };
  const update = await fetch(`${db.url}/rest/v1/partial_leads?id=eq.${draftId}&status=eq.partial`, {
    method: "PATCH",
    headers: { ...db.headers, Prefer: "return=representation" },
    body: JSON.stringify(columns),
    cache: "no-store",
  });
  if (!update.ok) return { ok: false as const, reason: "update_failed", detail: await update.json().catch(() => null) };
  const updated = await update.json().catch(() => []);
  if (Array.isArray(updated) && updated.length > 0) return { ok: true as const };

  // First save for this draft (or it is already completed: the insert is then ignored).
  const insert = await fetch(`${db.url}/rest/v1/partial_leads?on_conflict=id`, {
    method: "POST",
    headers: { ...db.headers, Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify({
      id: draftId, status: "partial", form: draft.form, step_total: draft.total,
      page: draft.page, user_agent: draft.userAgent, ...columns,
    }),
    cache: "no-store",
  });
  if (!insert.ok) return { ok: false as const, reason: "insert_failed", detail: await insert.json().catch(() => null) };
  return { ok: true as const };
}

/**
 * Mark the draft completed and link it to the saved lead. An upsert, so it also
 * wins if the form's last autosave has not landed yet: that late save then finds a
 * completed row and changes nothing.
 */
export async function completeDraft(draftId: string, leadId: string, form: DraftForm) {
  const db = config();
  if (!db) return false;
  const total = DRAFT_FORMS[form].steps.length;
  const response = await fetch(`${db.url}/rest/v1/partial_leads?on_conflict=id`, {
    method: "POST",
    headers: { ...db.headers, Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ id: draftId, form, status: "completed", step_reached: total, step_total: total, lead_id: leadId, completed_at: new Date().toISOString() }),
    cache: "no-store",
  });
  if (!response.ok) console.error("Could not mark partial inquiry completed.", { draftId, leadId });
  return response.ok;
}

/** Unfinished inquiries for the portal, newest first. available=false if the table is not installed yet. */
export async function getPartialLeads(limit = 200): Promise<{ available: boolean; partials: PartialLead[] }> {
  const db = config();
  if (!db) return { available: false, partials: [] };
  const fields = ["id", "created_at", "updated_at", "status", "form", "step_reached", "step_total", "page", "lead_id", "extra",
    "celebration_type", "event_date", "date_undecided", "venue", "guest_count", "services",
    "vision", "investment", "name", "email", "phone", "referral_source"].join(",");
  const response = await fetch(`${db.url}/rest/v1/partial_leads?select=${fields}&status=eq.partial&order=updated_at.desc&limit=${limit}`, {
    headers: db.headers, cache: "no-store",
  });
  if (!response.ok) return { available: false, partials: [] };
  return { available: true, partials: await response.json() as PartialLead[] };
}

/** Remove partials older than 30 days that never got a phone or an email. Contactable partials stay. */
export async function purgeStalePartials(now = new Date()) {
  const db = config();
  if (!db) return { ok: false, deleted: 0 };
  const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const response = await fetch(`${db.url}/rest/v1/partial_leads?status=eq.partial&updated_at=lt.${encodeURIComponent(cutoff)}&email=is.null&phone=is.null`, {
    method: "DELETE",
    headers: { ...db.headers, Prefer: "return=representation" },
    cache: "no-store",
  });
  if (!response.ok) return { ok: false, deleted: 0 };
  const rows = await response.json().catch(() => []);
  return { ok: true, deleted: Array.isArray(rows) ? rows.length : 0 };
}
