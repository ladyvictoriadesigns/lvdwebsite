import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { runChecklistSequence } from "@/lib/checklist-emails";
import { purgeStalePartials } from "@/lib/partial-leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Called every morning by the Vercel cron in vercel.json: sends venue checklist
// Email 2 (day 3) and Email 3 (day 7), and clears out stale partial inquiries. Vercel sends "Authorization: Bearer <CRON_SECRET>".
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization") || "";
  const expected = `Bearer ${secret}`;
  if (!secret || Buffer.byteLength(authorization) !== Buffer.byteLength(expected)
    || !timingSafeEqual(Buffer.from(authorization), Buffer.from(expected))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  // Daily housekeeping rides along: drop unfinished inquiries older than 30 days
  // that never got a phone or email. Contactable partials are kept.
  try {
    const purged = await purgeStalePartials();
    if (purged.deleted) console.log(`Removed ${purged.deleted} stale partial inquiries.`);
  } catch {
    console.error("Partial inquiry cleanup failed.");
  }
  try {
    return NextResponse.json(await runChecklistSequence());
  } catch (error) {
    console.error("Venue checklist emails failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Venue checklist emails failed." }, { status: 502 });
  }
}
