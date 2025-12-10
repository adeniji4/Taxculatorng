import { DashboardLayout } from "@/components/DashboardLayout";
import VATCalculator from "@/components/VATCalculator";
import { InArticleAd } from "@/components/InArticleAd";

const VATPage = () => {
  return (
    <DashboardLayout title="Value Added Tax Calculator" activeTab="tools">
      <VATCalculator />

      <div className="mt-8">
        <InArticleAd slot="IN_ARTICLE_SLOT_VAT" />
      </div>
    </DashboardLayout>
  );
};

export default VATPage;
