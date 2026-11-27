"use client";

import { useEffect, useRef } from "react";

// Partial inquiry autosave, shared by every website lead form.
// One draft id per page visit. A reload starts a new row rather than continuing the
// old one: the form's answers reset on reload, so reusing the row would overwrite
// what the visitor already gave us. Saves 1.5s after the visitor stops typing, right away when they move to
// the next step, and when they leave the page. The real submit passes draftId and
// draftForm to submitLead, and the server marks that row completed.

export type DraftFormName = "reserve" | "inquire" | "consultation" | "style_quiz" | "venue_checklist" | "planning_booking";

/** Form state in the same field names the forms already use (see cleanDraftFields). */
export type DraftFields = {
  celebrationType?: string; date?: string; dateUndecided?: boolean; venue?: string; guestCount?: string;
  services?: string[]; vision?: string; investment?: string; name?: string; email?: string; phone?: string;
  /** "How did you hear about us" */
  source?: string;
};

type Extra = Record<string, string | number | boolean | null | undefined>;

function hasAnswer(fields: DraftFields, extra: Extra) {
  return Object.values(fields).some((value) => Array.isArray(value) ? value.length > 0 : typeof value === "string" ? value.trim().length > 0 : value === true)
    || Object.values(extra).some((value) => value !== null && value !== undefined && value !== "");
}

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (Number(c) ^ (Math.random() * 16) >> (Number(c) / 4)).toString(16));
}

export function useLeadDraft({ form, step, fields, extra = {}, enabled = true }: {
  form: DraftFormName;
  /** 1-based step the visitor is on. */
  step: number;
  fields: DraftFields;
  extra?: Extra;
  /** false pauses saving (e.g. before the quiz contact form opens). */
  enabled?: boolean;
}) {
  const idRef = useRef<string | null>(null);
  const furthestRef = useRef(1);
  const doneRef = useRef(false);
  const latestRef = useRef<string | null>(null);

  const draftId = () => {
    if (!idRef.current) idRef.current = newId();
    return idRef.current;
  };

  const send = (body: string, beacon = false) => {
    if (beacon && navigator.sendBeacon?.("/api/leads/draft", body)) return;
    void fetch("/api/leads/draft", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true })
      .catch(() => { /* Autosave is best effort; the real submit is what counts. */ });
  };

  // What would be saved, as a plain string so the effect below runs only when it changes.
  const snapshot = enabled && hasAnswer(fields, extra) ? JSON.stringify({ fields, extra }) : null;
  const lastStepRef = useRef(step);

  // Debounced save while typing; immediate save when the step moves forward.
  useEffect(() => {
    furthestRef.current = Math.max(furthestRef.current, step);
    const stepped = step > lastStepRef.current;
    lastStepRef.current = step;
    if (!snapshot) { latestRef.current = null; return; }
    const body = JSON.stringify({
      draftId: draftId(), form, step: furthestRef.current, page: window.location.pathname, ...JSON.parse(snapshot),
    });
    latestRef.current = body;
    if (doneRef.current) return;
    if (stepped) { send(body); return; }
    const timer = window.setTimeout(() => { if (!doneRef.current) send(body); }, 1500);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot, step]);

  // Last save when they leave or switch away.
  useEffect(() => {
    const flush = () => { if (latestRef.current && !doneRef.current) send(latestRef.current, true); };
    const onVisibility = () => { if (document.visibilityState === "hidden") flush(); };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return {
    /** Spread into submitLead so the server can mark this draft completed. */
    submitFields: () => ({ draftId: draftId(), draftForm: form }),
    /** Call while the real submit is in flight: no more autosaves. */
    pause: () => { doneRef.current = true; },
    /** Call if the submit failed so autosave picks up again. */
    resume: () => { doneRef.current = false; },
    /** Call after a successful submit: stop saving. */
    finish: () => { doneRef.current = true; },
  };
}
