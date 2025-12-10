import { DashboardLayout } from "@/components/DashboardLayout";
import TaxEducation from "@/components/TaxEducation";
import { InArticleAd } from "@/components/InArticleAd";

const TaxLawPage = () => {
  return (
    <DashboardLayout title="Understanding Tax Law" activeTab="tools">
      <TaxEducation />

      <div className="mt-8">
        <InArticleAd slot="IN_ARTICLE_SLOT_TAXLAW" />
      </div>
    </DashboardLayout>
  );
};

export default TaxLawPage;
