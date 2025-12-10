import { DashboardLayout } from "@/components/DashboardLayout";
import CryptoTaxCalculator from "@/components/CryptoTaxCalculator";
import { InArticleAd } from "@/components/InArticleAd";

const CryptoTaxPage = () => {
  return (
    <DashboardLayout title="Crypto Tax Estimator" activeTab="tools">
      <CryptoTaxCalculator />

      <div className="mt-8">
        <InArticleAd slot="IN_ARTICLE_SLOT_CRYPTO" />
      </div>
    </DashboardLayout>
  );
};

export default CryptoTaxPage;
