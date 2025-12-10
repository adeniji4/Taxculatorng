import { DashboardLayout } from "@/components/DashboardLayout";
import WithholdingTaxCalculator from "@/components/WithholdingTaxCalculator";
import { InArticleAd } from "@/components/InArticleAd";

const WHTPage = () => {
  return (
    <DashboardLayout title="Withholding Tax Calculator" activeTab="tools">
      <WithholdingTaxCalculator />

      <div className="mt-8">
        <InArticleAd slot="IN_ARTICLE_SLOT_WHT" />
      </div>
    </DashboardLayout>
  );
};

export default WHTPage;
