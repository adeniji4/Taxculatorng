import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import IndividualCalculator from "@/components/IndividualCalculator";
import { InArticleAd } from "@/components/InArticleAd";

const PersonalTax = () => {
  const [calculationData, setCalculationData] = useState<any>(null);

  return (
    <DashboardLayout 
      title="Personal Tax (PAYE) Calculator" 
      calculationData={calculationData}
      activeTab="individual"
    >
      <IndividualCalculator onCalculate={setCalculationData} />

      {/* Explanatory / FAQ content below the calculator */}
      <div className="mt-8 space-y-6">
        <div className="prose max-w-none">
          <h3>How the calculator works</h3>
          <p>
            This calculator converts inputs to annual figures, applies pension, NHF, NHIS and rent reliefs, then calculates PAYE using the 2026 tax bands.
          </p>
        </div>

        {/* In-article ad placed between explanation sections */}
        <InArticleAd slot="IN_ARTICLE_SLOT_1" />

        <div className="prose max-w-none">
          <h4>Common examples</h4>
          <p>Example scenarios and walkthroughs can go here. Use this space for helpful notes and FAQs.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PersonalTax;
