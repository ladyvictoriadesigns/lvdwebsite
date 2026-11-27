import { DRAFT_FORMS, isDraftForm, stepLabel, type PartialLead } from "@/lib/partial-leads";
import styles from "./partial-leads.module.css";

function when(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York" }).format(new Date(value));
}

function eventDate(lead: PartialLead) {
  if (lead.date_undecided) return "Date undecided";
  if (!lead.event_date) return null;
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${lead.event_date}T00:00:00Z`));
}

function progress(lead: PartialLead) {
  if (lead.step_total <= 1) return "Started the form but didn’t send it";
  return `Stopped at step ${lead.step_reached} of ${lead.step_total}: ${stepLabel(lead.form, lead.step_reached)}`;
}

const EXTRA_LABELS: Record<string, string> = {
  quizResultTier: "Quiz result", quizScore: "Quiz score", weddingYear: "Wedding year",
  multicultural: "Multicultural", package: "Package", bookedVendors: "Already booked",
};

/** Unfinished inquiries from every website lead form, for follow-up. */
export default function PartialLeadsPanel({ partials }: { partials: PartialLead[] }) {
  const contactable = partials.filter((lead) => lead.phone || lead.email);
  return (
    <details className={styles.panel}>
      <summary>
        <span className={styles.flag}>Partial</span>
        <b>Unfinished inquiries</b>
        <span className={styles.count}>{partials.length} started, {contactable.length} with a phone or email</span>
      </summary>
      <p className={styles.help}>People who started the inquiry form but did not submit. These are not in your inquiry count and were not sent to Meta. When someone finishes, they move to the main list.</p>
      {partials.length === 0 ? <p className={styles.empty}>No unfinished inquiries right now.</p> : (
        <ul className={styles.list}>
          {partials.map((lead) => {
            const details = [lead.celebration_type, eventDate(lead), lead.venue, lead.guest_count, lead.investment].filter(Boolean);
            return (
              <li key={lead.id} className={styles.row}>
                <div className={styles.who}>
                  <b>{lead.name || "No name yet"}</b>
                  <span className={styles.formName}>{isDraftForm(lead.form) ? DRAFT_FORMS[lead.form].label : lead.form}</span>
                  <span className={styles.stopped}>{progress(lead)}</span>
                </div>
                <div className={styles.contact}>
                  {lead.phone ? <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}>{lead.phone}</a> : <span className={styles.muted}>No phone</span>}
                  {lead.email ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : <span className={styles.muted}>No email</span>}
                </div>
                <div className={styles.details}>
                  {details.length ? details.join(" · ") : <span className={styles.muted}>No event details yet</span>}
                  {lead.services.length > 0 && <span className={styles.services}>{lead.services.join(", ")}</span>}
                  {Object.entries(lead.extra || {}).filter(([key, value]) => EXTRA_LABELS[key] && value !== "" && value !== null).map(([key, value]) =>
                    <span key={key} className={styles.services}>{EXTRA_LABELS[key]}: {String(value)}</span>)}
                  {lead.vision && <span className={styles.vision}>“{lead.vision.length > 180 ? `${lead.vision.slice(0, 180)}…` : lead.vision}”</span>}
                </div>
                <div className={styles.time}>Last active {when(lead.updated_at)}{lead.page ? ` on ${lead.page}` : ""}</div>
              </li>
            );
          })}
        </ul>
      )}
    </details>
  );
}
