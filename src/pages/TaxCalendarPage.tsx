import { DashboardLayout } from "@/components/DashboardLayout";
import TaxCalendar from "@/components/TaxCalendar";
import { InArticleAd } from "@/components/InArticleAd";

const TaxCalendarPage = () => {
  return (
    <DashboardLayout title="Tax Calendar 2026" activeTab="tools">
      <TaxCalendar />

      <div className="mt-8">
        <InArticleAd slot="IN_ARTICLE_SLOT_CALENDAR" />
      </div>
    </DashboardLayout>
  );
};

export default TaxCalendarPage;
