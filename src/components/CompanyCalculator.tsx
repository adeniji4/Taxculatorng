import { useState, useEffect } from "react";
import { AdSenseAd } from "@/components/AdSenseAd";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface CompanyCalculatorProps {
  onCalculate: (data: any) => void;
}

const CompanyCalculator = ({ onCalculate }: CompanyCalculatorProps) => {
  const [turnover, setTurnover] = useState<string>("");
  const [assessableProfit, setAssessableProfit] = useState<string>("");
  const [fixedAssets, setFixedAssets] = useState<string>("");
  const [capitalGains, setCapitalGains] = useState<string>("");
  const [cfcUndistributed, setCfcUndistributed] = useState<string>("");
  const [foreignTaxPaid, setForeignTaxPaid] = useState<string>("");
  const [isProfessionalServices, setIsProfessionalServices] = useState(false);
  const [isMNE, setIsMNE] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<'general' | 'professional' | 'mne' | 'ftz'>('general');
  // NTA 2025 Small Company Thresholds (fixed)
  const turnoverThreshold = 50000000;
  const fixedAssetThreshold = 250000000;

  // Helpers to format numbers with commas while typing and parse them back
  const handleNumberInput = (value: string) => {
    const cleanValue = value.replace(/[^\d.]/g, '');
    const parts = cleanValue.split('.');
    if (parts.length > 2) return cleanValue.slice(0, -1);
    if (cleanValue === '' || cleanValue === '.') return cleanValue;
    const [integerPart, decimalPart] = parts;
    const formattedInteger = integerPart ? parseInt(integerPart).toLocaleString('en-NG') : '';
    return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  };

  const parseFormattedNumber = (value: string) => {
    return parseFloat(String(value).replace(/,/g, '')) || 0;
  };

  useEffect(() => {
    calculateTax();
  }, [turnover, assessableProfit, fixedAssets, capitalGains, cfcUndistributed, foreignTaxPaid, isProfessionalServices, isMNE, companyProfile]);

  const clearInputs = () => {
    setTurnover("");
    setAssessableProfit("");
    setFixedAssets("");
    setCapitalGains("");
    setCfcUndistributed("");
    setForeignTaxPaid("");
    setIsProfessionalServices(false);
    setIsMNE(false);
    setCompanyProfile('general');
    onCalculate?.(null);
  };

  const calculateTax = () => {
    const turnoverAmount = parseFormattedNumber(turnover);
    const profit = parseFormattedNumber(assessableProfit);
    const fixedAssetsAmount = parseFormattedNumber(fixedAssets);
    const capGains = parseFormattedNumber(capitalGains);
    const cfc = parseFormattedNumber(cfcUndistributed);
    const foreignTax = parseFormattedNumber(foreignTaxPaid);

    // NTA 2025: Small company only if turnover <= 50m AND fixed assets <= 250m AND NOT professional services
    const isSmall = !isProfessionalServices && turnoverAmount <= turnoverThreshold && fixedAssetsAmount <= fixedAssetThreshold;

    // Include capital gains and CFC in taxable profit
    let taxableProfit = profit + capGains + cfc;

    let cit = 0;
    let devLevy = 0;
    let totalTaxBeforeCredit = 0;
    let foreignTaxCredit = 0;
    let topUpTax = 0;
    let totalTax = 0;
    let message = "";

    // Free Trade Zone override: exempt but must file
    if (companyProfile === 'ftz') {
      message = "Exempt under Free Trade Zone rules (subject to annual filing).";
      taxableProfit = 0;
      cit = 0;
      devLevy = 0;
      totalTaxBeforeCredit = 0;
      foreignTaxCredit = 0;
      topUpTax = 0;
      totalTax = 0;
    } else if (isSmall) {
      message = "Exempt under NTA 2025: small companies are not subject to CIT, CGT or Development Levy.";
      taxableProfit = 0;
    } else {
      const CIT_RATE = 0.30; // 30% CIT for standard companies
      const DEV_LEVY_RATE = 0.04; // 4% development levy
      cit = taxableProfit * CIT_RATE;
      devLevy = taxableProfit * DEV_LEVY_RATE;
      totalTaxBeforeCredit = cit + devLevy;
      // Apply foreign tax credit
      foreignTaxCredit = Math.min(foreignTax, totalTaxBeforeCredit);
      totalTax = Math.max(0, totalTaxBeforeCredit - foreignTaxCredit);

      // If MNE, enforce 15% minimum ETR
      if (isMNE && taxableProfit > 0) {
        const minimumTaxRequired = taxableProfit * 0.15;
        topUpTax = Math.max(0, minimumTaxRequired - totalTax);
        totalTax = Math.max(totalTax, minimumTaxRequired);
      }
    }

    const etr = taxableProfit > 0 ? totalTax / taxableProfit : 0;

    onCalculate({
      turnover: turnoverAmount,
      assessableProfit: profit,
      fixedAssets: fixedAssetsAmount,
      capitalGains: capGains,
      cfcUndistributed: cfc,
      foreignTaxPaid: foreignTax,
      isProfessionalServices,
      isMNE,
      isSmall,
      companyProfile,
      cit,
      devLevy,
      totalTax,
      foreignTaxCredit,
      topUpTax,
      taxableProfit,
      etr,
      message,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const turnoverAmount = parseFormattedNumber(turnover);
  const profit = parseFormattedNumber(assessableProfit);
  const fixedAssetsAmount = parseFormattedNumber(fixedAssets);
  const capGains = parseFormattedNumber(capitalGains);
  const cfc = parseFormattedNumber(cfcUndistributed);
  const foreignTax = parseFormattedNumber(foreignTaxPaid);

  const isSmall = !isProfessionalServices && turnoverAmount <= turnoverThreshold && fixedAssetsAmount <= fixedAssetThreshold;
  let taxableProfit = profit + capGains + cfc;

  let cit = 0;
  let devLevy = 0;
  let totalTaxBeforeCredit = 0;
  let foreignTaxCredit = 0;
  let topUpTax = 0;
  let totalTax = 0;

  if (isSmall) {
    taxableProfit = 0;
  } else {
    const CIT_RATE = 0.30;
    const DEV_LEVY_RATE = 0.04;
    cit = taxableProfit * CIT_RATE;
    devLevy = taxableProfit * DEV_LEVY_RATE;
    totalTaxBeforeCredit = cit + devLevy;
    foreignTaxCredit = Math.min(foreignTax, totalTaxBeforeCredit);
    totalTax = Math.max(0, totalTaxBeforeCredit - foreignTaxCredit);

    if (isMNE && taxableProfit > 0) {
      const minimumTaxRequired = taxableProfit * 0.15;
      topUpTax = Math.max(0, minimumTaxRequired - totalTax);
      totalTax = Math.max(totalTax, minimumTaxRequired);
    }
  }

  const etr = taxableProfit > 0 ? totalTax / taxableProfit : 0;
  let message = "";
  if (companyProfile === 'ftz') {
    message = "Exempt under Free Trade Zone rules (subject to annual filing).";
  } else if (isSmall) {
    message = "Exempt under NTA 2025: small companies are not subject to CIT, CGT or Development Levy.";
  }

  const results = turnoverAmount > 0 ? { companyProfile, isSmall, cit, devLevy, totalTax, foreignTaxCredit, topUpTax, taxableProfit, etr, message } : null;

  return (
    <Card className="p-6 md:p-8 shadow-lg">
      <h3 className="text-2xl font-bold text-foreground mb-6">Company Tax Calculator (CIT)</h3>
      {/* Company Profile Selector - first interaction */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div
          role="button"
          onClick={() => { setCompanyProfile('general'); setIsProfessionalServices(false); setIsMNE(false); }}
          className={`p-3 rounded border ${companyProfile === 'general' ? 'border-primary bg-primary/5' : 'border-border'}`}
        >
          <div className="font-semibold">General Business, Trade, or Vocation</div>
          <div className="text-xs text-muted-foreground mt-1">For traders, manufacturers, and skilled artisans (e.g., Tailors, Carpenters, Mechanics, Plumbers, Fashion Designers). Eligible for 0% Tax if Turnover is ≤ ₦50m.</div>
        </div>

        <div
          role="button"
          onClick={() => { setCompanyProfile('professional'); setIsProfessionalServices(true); setIsMNE(false); }}
          className={`p-3 rounded border ${companyProfile === 'professional' ? 'border-primary bg-primary/5' : 'border-border'}`}
        >
          <div className="font-semibold">Accredited Professional Services</div>
          <div className="text-xs text-muted-foreground mt-1">For expert services requiring professional certification. Strictly for Lawyers, Accountants, Doctors, Engineers, Architects, and Management Consultants. NOT eligible for Small Company Exemption (Standard Tax applies).</div>
        </div>

        <div
          role="button"
          onClick={() => { setCompanyProfile('mne'); setIsProfessionalServices(false); setIsMNE(true); }}
          className={`p-3 rounded border ${companyProfile === 'mne' ? 'border-primary bg-primary/5' : 'border-border'}`}
        >
          <div className="font-semibold">Multinational / Large Corporation</div>
          <div className="text-xs text-muted-foreground mt-1">Companies with &gt;₦20bn turnover or part of a global group. Subject to 15% Minimum Tax.</div>
        </div>

        <div
          role="button"
          onClick={() => { setCompanyProfile('ftz'); setIsProfessionalServices(false); setIsMNE(false); }}
          className={`p-3 rounded border ${companyProfile === 'ftz' ? 'border-primary bg-primary/5' : 'border-border'}`}
        >
          <div className="font-semibold">Free Trade Zone (NEPZA)</div>
          <div className="text-xs text-muted-foreground mt-1">Operating within a registered Free Trade Zone. Generally exempt from CIT and Levies (subject to filing).</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <Label htmlFor="turnover">Annual Turnover (₦) *</Label>
          <Input
            id="turnover"
            type="text"
            placeholder="0"
            value={turnover}
            onChange={(e) => setTurnover(handleNumberInput(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profit">Assessable Profit (₦) *</Label>
          <Input
            id="profit"
            type="text"
            placeholder="0"
            value={assessableProfit}
            onChange={(e) => setAssessableProfit(handleNumberInput(e.target.value))}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <Label htmlFor="fixed-assets">Total Fixed Assets (₦)</Label>
          <Input id="fixed-assets" type="text" placeholder="0" value={fixedAssets} onChange={e => setFixedAssets(handleNumberInput(e.target.value))} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capital-gains">Capital Gains / Asset Disposal (₦)</Label>
          <Input id="capital-gains" type="text" placeholder="0" value={capitalGains} onChange={e => setCapitalGains(handleNumberInput(e.target.value))} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <Label htmlFor="cfc-undistributed">CFC Undistributed Income (₦)</Label>
          <Input id="cfc-undistributed" type="text" placeholder="0" value={cfcUndistributed} onChange={e => setCfcUndistributed(handleNumberInput(e.target.value))} />
          <p className="text-xs text-muted-foreground">Enter undistributed profits from controlled foreign subsidiaries (if applicable).</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="foreign-tax-paid">Foreign Tax Paid (₦)</Label>
          <Input id="foreign-tax-paid" type="text" placeholder="0" value={foreignTaxPaid} onChange={e => setForeignTaxPaid(handleNumberInput(e.target.value))} />
          <p className="text-xs text-muted-foreground">Optional: foreign tax paid on the CFC income (used as a simple credit).</p>
        </div>
      </div>

      <div className="mb-6 space-y-4 p-4 rounded-lg border border-border bg-muted/50">
        <h5 className="font-semibold mb-3">Company Classification</h5>
        <div className="flex items-start gap-3">
          <Checkbox id="professional-services" checked={isProfessionalServices} onCheckedChange={checked => setIsProfessionalServices(checked === true)} />
          <div className="flex-1">
            <Label htmlFor="professional-services" className="cursor-pointer font-medium">Professional Services Company</Label>
            <p className="text-xs text-muted-foreground mt-1">Professional services companies are subject to standard CIT regardless of size.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox id="mne" checked={isMNE} onCheckedChange={checked => setIsMNE(checked === true)} />
          <div className="flex-1">
            <Label htmlFor="mne" className="cursor-pointer font-medium">Multinational Enterprise (MNE)</Label>
            <p className="text-xs text-muted-foreground mt-1">MNEs must meet a minimum 15% Effective Tax Rate; any shortfall triggers a top-up tax.</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          <strong>NTA 2025 Small Company Thresholds:</strong> Turnover ≤ ₦50M AND Fixed Assets ≤ ₦250M (and not Professional Services)
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div />
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearInputs}>Clear</Button>
        </div>
      </div>

      {results && (
        <div className="space-y-6">
          {results.isSmall || results.companyProfile === 'ftz' ? (
            <Alert className="bg-accent border-accent">
              <CheckCircle2 className="h-5 w-5 text-accent-foreground" />
              <AlertDescription className="text-accent-foreground font-medium">
                {results.message}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="border-t border-border pt-6">
                <h4 className="text-lg font-semibold text-foreground mb-4">Tax Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                    <span className="text-secondary-foreground">CIT (30%)</span>
                    <span className="font-semibold text-secondary-foreground">
                      {formatCurrency(results.cit)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                    <span className="text-secondary-foreground">Development Levy (4%)</span>
                    <span className="font-semibold text-secondary-foreground">
                      {formatCurrency(results.devLevy)}
                    </span>
                  </div>
                  {results.topUpTax > 0 && (
                    <div className="flex justify-between items-center p-3 bg-amber-100 dark:bg-amber-900 rounded-lg">
                      <span className="text-amber-900 dark:text-amber-100 font-medium">Top-Up Tax (15% ETR enforcement)</span>
                      <span className="font-semibold text-amber-900 dark:text-amber-100">
                        {formatCurrency(results.topUpTax)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-primary p-6 rounded-lg">
                <p className="text-sm text-primary-foreground mb-2">Total Company Tax Payable</p>
                <p className="text-3xl font-bold text-primary-foreground">
                  {formatCurrency(results.totalTax)}
                </p>
                <div className="mt-3 text-sm text-primary-foreground">
                  <p>Effective Tax Rate (ETR): <strong>{(results.etr * 100).toFixed(2)}%</strong></p>
                  {isMNE && results.topUpTax > 0 && (
                    <p className="text-amber-200">MNE 15% ETR requirement enforced; Top-up applied.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* How was this calculated? */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              How was this calculated?
            </h5>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {results.isSmall ? (
                <>
                  Your Turnover is {formatCurrency(turnoverAmount)} and Fixed Assets are {formatCurrency(fixedAssetsAmount)}.
                  Both fall within the NTA 2025 Small Company thresholds (Turnover ≤ ₦50M, Fixed Assets ≤ ₦250M), and you are not a Professional Services company.
                  Your company qualifies as <strong>Small and is exempt from CIT, CGT and Development Levy</strong>.
                </>
              ) : (
                <>
                  {turnoverAmount > turnoverThreshold || fixedAssetsAmount > fixedAssetThreshold ? (
                    <>
                      Your turnover ({formatCurrency(turnoverAmount)}) or assets ({formatCurrency(fixedAssetsAmount)}) exceed the Small Company threshold.
                      Standard taxation applies under NTA 2025.
                    </>
                  ) : isProfessionalServices ? (
                    <>
                      Although you meet the size thresholds (Turnover ≤ ₦50M, Fixed Assets ≤ ₦250M), 
                      Professional Services companies are excluded from the small company exemption.
                    </>
                  ) : null}
                  {" "}
                  {profit === 0 ? (
                    "No CIT or Development Levy is due as you have no assessable profit."
                  ) : (
                    <>
                      We applied <strong>30% CIT</strong> on your Total Profit of {formatCurrency(taxableProfit)} and 
                      <strong> 4% Development Levy</strong> on your Assessable Profit of {formatCurrency(profit)}.
                      {isMNE && results.topUpTax > 0 && ` As an MNE, a top-up tax of ${formatCurrency(results.topUpTax)} was applied to meet the 15% Effective Tax Rate requirement.`}
                    </>
                  )}
                </>
              )}
            </p>
          </div>

          {/* Results Ad (sponsored) */}
          <div className="mt-6">
            <p className="text-xs text-muted-foreground mb-2 font-semibold">SPONSORED</p>
            <AdSenseAd slot="RESULTS_SLOT_COMPANY" format="horizontal" />
          </div>
        </div>
      )}
    </Card>
  );
};

export default CompanyCalculator;
