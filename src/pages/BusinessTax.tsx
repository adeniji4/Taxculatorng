import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import CompanyCalculator from "@/components/CompanyCalculator";
import { InArticleAd } from "@/components/InArticleAd";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const BusinessTax = () => {
  const [calculationData, setCalculationData] = useState<any>(null);

  return (
    <DashboardLayout 
      title="Business Tax (CIT) Calculator" 
      calculationData={calculationData}
      activeTab="company"
    >
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-900" />
        <AlertDescription className="text-sm text-blue-900">
          The Nigeria Tax Act 2025 (effective Jan 2026) classifies companies as small or standard. Small companies meeting turnover and fixed-asset thresholds are exempt from CIT, CGT and the Development Levy. Use the inputs below to estimate CIT, Development Levy, ETR and any top-up tax for large/multinational groups.
        </AlertDescription>
      </Alert>
      {/* Tax Regime Distinction note */}
      <div className="mb-6 p-4 rounded border border-yellow-200 bg-yellow-50">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-yellow-700 mt-1" />
          <div className="text-sm text-yellow-900">
            <div className="font-semibold">Note</div>
            <div className="mt-2">
              <p className="mb-2"><strong>Business Name :</strong> If you are registered as a Business Name or Sole Proprietorship (e.g., "John Doe Ventures"), you do NOT pay Company Income Tax. Instead, you pay Personal Income Tax (PIT) to your State Government.</p>
              <p><strong>Limited Company:</strong> If you are a Limited Liability Company (LTD) (e.g., "John Doe Furniture Ltd"), you pay Company Income Tax (CIT) to the FIRS. This calculator is designed specifically for this group.</p>
            </div>
          </div>
        </div>
      </div>
      <CompanyCalculator onCalculate={setCalculationData} />

      {/* In-article / explanatory content */}
      <div className="mt-8">
        <InArticleAd slot="IN_ARTICLE_SLOT_COMPANY" />
      </div>
    </DashboardLayout>
  );
};

export default BusinessTax;
