import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, Info, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaxBreakdownChart from "./TaxBreakdownChart";
interface IndividualCalculatorProps {
  onCalculate?: (data: any) => void;
}
const IndividualCalculator = ({
  onCalculate
}: IndividualCalculatorProps) => {
  const [viewMode, setViewMode] = useState<"monthly" | "annual">("monthly");
  const [salaryInput, setSalaryInput] = useState<string>("");
  const [hasThirteenthMonth, setHasThirteenthMonth] = useState(false);
  const [rent, setRent] = useState<string>("");
  const [pensionInput, setPensionInput] = useState<string>("");
  const [contributesPension, setContributesPension] = useState(false);
  const [nhisInput, setNhisInput] = useState<string>("");
  const [contributeNHF, setContributeNHF] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(value);
  };
  const formatNumber = (value: string) => {
    const cleanValue = value.replace(/,/g, '');
    const num = parseFloat(cleanValue);
    if (isNaN(num) || cleanValue === '') return value;
    return num.toLocaleString('en-NG');
  };
  const handleNumberInput = (value: string) => {
    // Remove all non-digit characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');

    // Prevent multiple decimal points
    const parts = cleanValue.split('.');
    if (parts.length > 2) return cleanValue.slice(0, -1);

    // Format with commas in real-time
    if (cleanValue === '' || cleanValue === '.') return cleanValue;
    const [integerPart, decimalPart] = parts;
    const formattedInteger = integerPart ? parseInt(integerPart).toLocaleString('en-NG') : '';
    return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  };
  const parseFormattedNumber = (value: string) => {
    return parseFloat(value.replace(/,/g, '')) || 0;
  };
  const calculateTax = async () => {
    setIsCalculating(true);
    setResult(null);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const inputSalary = parseFormattedNumber(salaryInput);
    const inputRent = parseFormattedNumber(rent);

    // Step A: Standardization - Convert all inputs to Annual Figures
    let annualGross = viewMode === "monthly" ? inputSalary * 12 : inputSalary;

    // Add 13th month if applicable
    if (hasThirteenthMonth) {
      const monthlyBase = viewMode === "monthly" ? inputSalary : annualGross / 12;
      annualGross += monthlyBase;
    }
    // Rent is entered as an annual amount (Nigerian rents typically paid yearly)
    const annualRent = inputRent;
    const annualNHIS = nhisInput ? viewMode === "monthly" ? parseFormattedNumber(nhisInput) * 12 : parseFormattedNumber(nhisInput) : 0;

    // Step B: Calculate Tax Exemptions (Reliefs)
    const autoPension = annualGross * 0.08;
    let pensionDed = 0;
    // Only deduct pension if user indicates they contribute. If they check the box but leave amount empty, default to 8%.
    if (contributesPension) {
      pensionDed = pensionInput ? parseFormattedNumber(pensionInput) : autoPension;
    } else {
      pensionDed = 0;
    }
    const nhfDed = contributeNHF ? annualGross * 0.025 : 0;
    const nhisDed = annualNHIS;
    const rentRelief = Math.min(annualRent * 0.2, 500000);
    const totalReliefs = pensionDed + nhfDed + nhisDed + rentRelief;

    // Step C: Determine Taxable Base
    const taxableBase = Math.max(annualGross - totalReliefs, 0);

    // Step D: Apply 2026 Tax Bands
    let annualTax = 0;
    let remaining = taxableBase;
    const bands = [{
      limit: 800000,
      rate: 0,
      label: "First ₦800,000"
    }, {
      limit: 3000000,
      rate: 0.15,
      label: "Next ₦2,200,000"
    }, {
      limit: 12000000,
      rate: 0.18,
      label: "Next ₦9,000,000"
    }, {
      limit: 25000000,
      rate: 0.21,
      label: "Next ₦13,000,000"
    }, {
      limit: 50000000,
      rate: 0.23,
      label: "Next ₦25,000,000"
    }, {
      limit: Infinity,
      rate: 0.25,
      label: "Above ₦50,000,000"
    }];
    let previousLimit = 0;
    const bandBreakdown = [];
    for (const band of bands) {
      if (remaining <= 0) break;
      const bandSize = band.limit - previousLimit;
      const taxableInBand = Math.min(remaining, bandSize);
      const taxInBand = taxableInBand * band.rate;
      if (taxableInBand > 0) {
        bandBreakdown.push({
          label: band.label,
          amount: taxableInBand,
          rate: band.rate,
          tax: taxInBand
        });
        annualTax += taxInBand;
      }
      remaining -= taxableInBand;
      previousLimit = band.limit;
    }
    const netPay = annualGross - annualTax - pensionDed - nhfDed - nhisDed;
    const calculationResult = {
      viewMode,
      inputSalary,
      annualGross,
      pensionDed,
      nhfDed,
      nhisDed,
      rentRelief,
      totalReliefs,
      taxableBase,
      annualTax,
      netPay,
      hasThirteenthMonth,
      contributeNHF,
      bandBreakdown,
      annualRent
    };
    setResult(calculationResult);
    setIsCalculating(false);
    onCalculate?.(calculationResult);
  };

  const clearInputs = () => {
    setViewMode("monthly");
    setSalaryInput("");
    setHasThirteenthMonth(false);
    setRent("");
    setPensionInput("");
    setContributesPension(false);
    setNhisInput("");
    setContributeNHF(false);
    setResult(null);
    setIsCalculating(false);
    onCalculate?.(null);
  };

  // Auto-calculate pension suggestion — mirror the same annualGross logic used in calculateTax
  const computeAnnualFromInputs = () => {
    const baseAnnual = viewMode === "monthly" ? parseFormattedNumber(salaryInput) * 12 : parseFormattedNumber(salaryInput);
    const monthlyBase = viewMode === "monthly" ? parseFormattedNumber(salaryInput) : baseAnnual / 12;
    return hasThirteenthMonth ? baseAnnual + monthlyBase : baseAnnual;
  };

  const suggestedPension = computeAnnualFromInputs() * 0.08;
  return <Card className="p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Pay as you earn (PAYE)</h3>
      </div>

      {/* Smart View Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg border border-border p-1 bg-muted">
          <button onClick={() => setViewMode("monthly")} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === "monthly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            Monthly View
          </button>
          <button onClick={() => setViewMode("annual")} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === "annual" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            Annual View
          </button>
        </div>
      </div>

      {/* Salary Input */}
      <div className="space-y-2 mb-4">
        <Label htmlFor="salary">
          {viewMode === "monthly" ? "Monthly Gross Salary (₦)" : "Annual Gross Salary (₦)"}
        </Label>
        <Input id="salary" type="text" placeholder="0" value={salaryInput} onChange={e => {
        const formatted = handleNumberInput(e.target.value);
        setSalaryInput(formatted);
        setPensionInput(''); // Reset pension when salary changes
      }} />
      </div>

      {/* Rent Input (annual): Nigerians usually pay rent yearly */}
      <div className="space-y-2 mb-4">
        <Label htmlFor="rent">Annual Rent (₦)</Label>
        <Input id="rent" type="text" placeholder="0" value={rent} onChange={e => {
        const formatted = handleNumberInput(e.target.value);
        setRent(formatted);
      }} />
        <p className="text-xs text-muted-foreground">
          Relief is 20% of annual rent, capped at ₦500,000
        </p>
      </div>

      {/* Pension Input */}
      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-3 mb-2 p-3 rounded-lg border border-border bg-muted/50">
          <Checkbox id="pension-checkbox" checked={contributesPension} onCheckedChange={checked => setContributesPension(checked === true)} />
          <div className="flex-1">
            <Label htmlFor="pension" className="cursor-pointer font-medium">I contribute to a pension scheme</Label>
            <p className="text-xs text-muted-foreground mt-1">Only contributors can claim pension relief. Check this if you make pension contributions; if checked but left blank, the calculator will assume 8% of gross.</p>
          </div>
        </div>

        <Label htmlFor="pension">Annual Pension Contribution (₦)</Label>
        <Input id="pension" type="text" placeholder={contributesPension ? (suggestedPension > 0 ? formatCurrency(suggestedPension) : "Enter annual pension") : "Disabled — not contributing"} value={pensionInput} onChange={e => {
        const formatted = handleNumberInput(e.target.value);
        setPensionInput(formatted);
      }} disabled={!contributesPension} readOnly={!contributesPension} />
        <p className="text-xs text-muted-foreground">
          {contributesPension && suggestedPension > 0 && `Suggested: ${formatCurrency(suggestedPension)} (8% of gross)`}
        </p>
      </div>

      {/* NHIS Input */}
      <div className="space-y-2 mb-4">
        <Label htmlFor="nhis">{viewMode === "monthly" ? "Monthly Health Insurance/NHIS (₦)" : "Annual Health Insurance/NHIS (₦)"}</Label>
        <Input id="nhis" type="text" placeholder="0" value={nhisInput} onChange={e => {
        const formatted = handleNumberInput(e.target.value);
        setNhisInput(formatted);
      }} />
        <p className="text-xs text-muted-foreground">
          Health Insurance contributions are tax-deductible
        </p>
      </div>

      {/* NHF Checkbox */}
      <div className="flex items-start gap-3 mb-4 p-3 rounded-lg border border-border bg-muted/50">
        <Checkbox id="nhf" checked={contributeNHF} onCheckedChange={checked => setContributeNHF(checked === true)} />
        <div className="flex-1">
          <Label htmlFor="nhf" className="cursor-pointer font-medium">
            I contribute to National Housing Fund (NHF)
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Optional contribution of 2.5% of gross salary (Business Facilitation Act 2023)
          </p>
        </div>
      </div>

      {/* 13th Month Toggle */}
      <div className="flex items-start gap-3 mb-6 p-3 rounded-lg border border-border bg-muted/50">
        <Checkbox id="thirteenth-month" checked={hasThirteenthMonth} onCheckedChange={checked => setHasThirteenthMonth(checked === true)} />
        <div className="flex-1">
          <Label htmlFor="thirteenth-month" className="cursor-pointer font-medium">
            I receive 13th Month Salary
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Adds one additional month to your annual gross
          </p>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="flex gap-3 mb-6">
        <Button onClick={calculateTax} className="flex-1 bg-green-600 hover:bg-green-700 text-white" disabled={!salaryInput || !rent || isCalculating}>
          {isCalculating ? <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating...
            </> : <>
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Tax
            </>}
        </Button>

        <Button variant="outline" onClick={clearInputs} className="w-36" disabled={isCalculating && !result}>
          Clear
        </Button>
      </div>

      {/* Results */}
      {result && <Tabs defaultValue="tax-due" className="w-full">
          <TabsList className="grid w-full grid-cols-3 gap-1 p-1">
            <TabsTrigger value="tax-due" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Total Tax Due</TabsTrigger>
            <TabsTrigger value="payslip" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Payslip Breakdown</TabsTrigger>
            <TabsTrigger value="explanation" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Explanation</TabsTrigger>
          </TabsList>

          {/* Tab 1: Total Tax Due */}
          <TabsContent value="tax-due" className="space-y-6 mt-4">
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 p-4 sm:p-6 md:p-8 rounded-lg border-2 border-red-200 dark:border-red-800">
              <h4 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6 text-center">Your Tax Obligation</h4>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Annual Tax */}
                <div className="text-center pb-6 border-b border-red-300 dark:border-red-700">
                  <p className="text-sm text-muted-foreground mb-2">Annual Tax</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-red-600 dark:text-red-400 break-words">
                    {formatCurrency(result.annualTax)}
                  </p>
                </div>

                {/* Monthly Tax */}
                <div className="text-center pb-6 border-b border-red-300 dark:border-red-700">
                  <p className="text-sm text-muted-foreground mb-2">Monthly Tax</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400 break-words">
                    {formatCurrency(result.annualTax / 12)}
                  </p>
                </div>

                {/* Net Pay - The Good News */}
                <div className="text-center pt-2">
                  <p className="text-sm text-muted-foreground mb-2">Your Monthly Net Pay (Credit Alert)</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 break-words">
                    {formatCurrency(result.netPay / 12)}
                  </p>
                </div>
              </div>
            </div>

            {/* Tax Breakdown Chart */}
            <TaxBreakdownChart takeHomePay={result.netPay} tax={result.annualTax} pension={result.pensionDed} />
          </TabsContent>

          {/* Tab 2: Payslip Breakdown */}
          <TabsContent value="payslip" className="space-y-6">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg border-2 border-primary/20">
              <h4 className="text-lg font-bold text-foreground mb-4">Monthly Payslip</h4>
              
              <div className="space-y-3">
                {/* Gross Income */}
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm font-medium text-foreground">Gross Income</span>
                  <span className="text-lg font-semibold text-foreground">
                    {formatCurrency(result.annualGross / 12)}
                  </span>
                </div>

                {/* Less Deductions Section */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Less Deductions:</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Pension</span>
                    <span className="text-sm text-foreground">-{formatCurrency(result.pensionDed / 12)}</span>
                  </div>

                  {result.contributeNHF && <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">NHF</span>
                      <span className="text-sm text-foreground">-{formatCurrency(result.nhfDed / 12)}</span>
                    </div>}

                  {result.nhisDed > 0 && <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">NHIS</span>
                      <span className="text-sm text-foreground">-{formatCurrency(result.nhisDed / 12)}</span>
                    </div>}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">PAYE Tax</span>
                    <span className="text-sm text-foreground">-{formatCurrency(result.annualTax / 12)}</span>
                  </div>
                </div>

                {/* Net Pay (Credit Alert) */}
                <div className="flex justify-between items-center pt-3 mt-3 border-t-2 border-primary/30">
                  <span className="text-base font-bold text-foreground">Net Pay (Credit Alert)</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(result.netPay / 12)}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Annual Breakdown */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Annual Breakdown</h4>
              
              <div className="bg-secondary p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-foreground">Total Gross Income</span>
                  <span className="font-semibold text-secondary-foreground">{formatCurrency(result.annualGross)}</span>
                </div>
                {result.hasThirteenthMonth && <p className="text-xs text-muted-foreground mt-1">Includes 13th month salary</p>}
              </div>

              <div className="bg-secondary p-3 rounded-lg space-y-2">
                <p className="text-xs font-semibold text-secondary-foreground mb-2">Deductions:</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-foreground">Pension (8%)</span>
                  <span className="text-secondary-foreground">-{formatCurrency(result.pensionDed)}</span>
                </div>
                {result.contributeNHF && <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary-foreground">NHF (2.5%)</span>
                    <span className="text-secondary-foreground">-{formatCurrency(result.nhfDed)}</span>
                  </div>}
                {result.nhisDed > 0 && <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary-foreground">NHIS</span>
                    <span className="text-secondary-foreground">-{formatCurrency(result.nhisDed)}</span>
                  </div>}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-foreground">Rent Relief (20%, max ₦500k)</span>
                  <span className="text-secondary-foreground">-{formatCurrency(result.rentRelief)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border/50">
                  <span className="text-sm font-semibold text-secondary-foreground">Total Reliefs</span>
                  <span className="font-semibold text-secondary-foreground">-{formatCurrency(result.totalReliefs)}</span>
                </div>
              </div>

              <div className="bg-accent p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-accent-foreground">Taxable Income</span>
                  <span className="font-semibold text-accent-foreground">{formatCurrency(result.taxableBase)}</span>
                </div>
              </div>

              {/* Tax Band Breakdown */}
              <div className="bg-muted p-3 rounded-lg space-y-2">
                <p className="text-xs font-semibold text-foreground mb-2">Tax Calculation (2026 Bands):</p>
                {result.bandBreakdown.map((band: any, index: number) => <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      {band.label} @ {(band.rate * 100).toFixed(0)}%
                    </span>
                    <span className="text-foreground font-medium">
                      {formatCurrency(band.tax)}
                    </span>
                  </div>)}
                <div className="flex justify-between items-center pt-2 border-t border-border/50">
                  <span className="text-sm font-semibold text-foreground">Total Annual Tax</span>
                  <span className="font-semibold text-foreground">{formatCurrency(result.annualTax)}</span>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-green-900 dark:text-green-100">Annual Net Pay</span>
                  <span className="font-semibold text-green-900 dark:text-green-100">{formatCurrency(result.netPay)}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 3: Explanation */}
          <TabsContent value="explanation" className="space-y-6">
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <Info className="h-4 w-4 text-blue-900 dark:text-blue-100" />
              <AlertDescription className="text-blue-900 dark:text-blue-100 text-sm">
                <strong>How your tax was calculated:</strong><br /><br />
                Your Taxable Income was reduced by your Pension ({formatCurrency(result.pensionDed)})
                {result.contributeNHF && `, NHF (${formatCurrency(result.nhfDed)})`}
                {result.nhisDed > 0 && `, NHIS (${formatCurrency(result.nhisDed)})`}, 
                and Rent Relief ({formatCurrency(result.rentRelief)}). 
                Tax was calculated on the remaining balance of {formatCurrency(result.taxableBase)} using the 2026 bands.
              </AlertDescription>
            </Alert>

            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h4 className="font-semibold text-foreground">2026 Tax Bands</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">First ₦800,000</span>
                  <span className="font-medium text-foreground">0% (Tax-Free)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next ₦2,200,000</span>
                  <span className="font-medium text-foreground">15%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next ₦9,000,000</span>
                  <span className="font-medium text-foreground">18%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next ₦13,000,000</span>
                  <span className="font-medium text-foreground">21%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next ₦25,000,000</span>
                  <span className="font-medium text-foreground">23%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Above ₦50,000,000</span>
                  <span className="font-medium text-foreground">25%</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>}
    </Card>;
};
export default IndividualCalculator;