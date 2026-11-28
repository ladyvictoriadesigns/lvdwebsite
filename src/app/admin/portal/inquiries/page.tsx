import { redirect } from "next/navigation";
import InquiriesDashboard from "@/app/admin/inquiries/InquiriesDashboard";
import PartialLeadsPanel from "@/app/admin/inquiries/PartialLeadsPanel";
import { canSeeInquiries, getAdminUser } from "@/lib/admin-auth";
import { getAdminLeads } from "@/lib/admin-data";
import { canSeeMarketing } from "@/lib/marketing-access";
import { getPartialLeads } from "@/lib/partial-leads";

export const dynamic = "force-dynamic";

export default async function PortalInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string | string[] }>;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  if (!canSeeInquiries(user)) redirect("/admin/portal");

  const [leads, partialLeads] = await Promise.all([
    getAdminLeads({ includeMarketing: canSeeMarketing(user) }),
    getPartialLeads(),
  ]);
  const leadParam = (await searchParams).lead;
  const requestedLeadId = typeof leadParam === "string" ? leadParam : "";
  const initialSelectedId = leads.some((lead) => lead.id === requestedLeadId) ? requestedLeadId : undefined;

  return <InquiriesDashboard initialLeads={leads} user={user} initialSelectedId={initialSelectedId} showAdReport={canSeeMarketing(user)} portalMode partialsPanel={partialLeads.available ? <PartialLeadsPanel partials={partialLeads.partials} /> : null} />;
}
