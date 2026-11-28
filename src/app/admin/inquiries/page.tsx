import { redirect } from "next/navigation";
import { canSeeInquiries, getAdminUser, hasAdminRefreshToken } from "@/lib/admin-auth";
import { getAdminLeads } from "@/lib/admin-data";
import { canSeeMarketing } from "@/lib/marketing-access";
import { getPartialLeads } from "@/lib/partial-leads";
import InquiriesDashboard from "./InquiriesDashboard";
import PartialLeadsPanel from "./PartialLeadsPanel";

export const dynamic = "force-dynamic";

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string | string[] }>;
}) {
  const user = await getAdminUser();
  if (!user) {
    if (await hasAdminRefreshToken()) {
      redirect("/api/admin/auth/refresh?next=/admin/inquiries");
    }
    redirect("/admin/login");
  }

  if (!canSeeInquiries(user)) redirect("/admin/portal");

  const [leads, partialLeads] = await Promise.all([
    getAdminLeads({ includeMarketing: canSeeMarketing(user) }),
    getPartialLeads(),
  ]);
  const leadParam = (await searchParams).lead;
  const requestedLeadId = typeof leadParam === "string" ? leadParam : "";
  const initialSelectedId = leads.some((lead) => lead.id === requestedLeadId) ? requestedLeadId : undefined;

  return <InquiriesDashboard initialLeads={leads} user={user} initialSelectedId={initialSelectedId} showAdReport={canSeeMarketing(user)} partialsPanel={partialLeads.available ? <PartialLeadsPanel partials={partialLeads.partials} /> : null} />;
}
