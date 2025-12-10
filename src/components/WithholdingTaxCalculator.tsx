import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, Info, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AdSenseAd } from "@/components/AdSenseAd";

const WithholdingTaxCalculator = () => {
  const [transactionType, setTransactionType] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const whtRates = {
    "dividend": { rate: 0.10, description: "Dividend payments to individuals and companies" },
    "interest": { rate: 0.10, description: "Interest on deposits, securities, and loans" },
    "rent": { rate: 0.10, description: "Rent on land, buildings, and other properties" },
    "royalty": { rate: 0.10, description: "Royalties and similar payments" },
    "consultancy": { rate: 0.10, description: "Professional fees and consultancy services" },
    "technical": { rate: 0.10, description: "Technical and management fees" },
    "contract": { rate: 0.05, description: "Construction, haulage, and contract services" },
    "director-fee": { rate: 0.10, description: "Directors' fees and similar payments" },
    "commission": { rate: 0.10, description: "Commission and brokerage fees" }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(value);
  };

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
    return parseFloat(value.replace(/,/g, '')) || 0;
  };

  const calculateWHT = async () => {
    if (!transactionType || !amount) return;

    setIsCalculating(true);
    setResult(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const transactionAmount = parseFormattedNumber(amount);
    const rateInfo = whtRates[transactionType as keyof typeof whtRates];
    const whtAmount = transactionAmount * rateInfo.rate;
    const netAmount = transactionAmount - whtAmount;

    setResult({
      grossAmount: transactionAmount,
      whtRate: rateInfo.rate * 100,
      whtAmount: whtAmount,
      netAmount: netAmount,
      description: rateInfo.description
    });

    setIsCalculating(false);
  };

  const clearInputs = () => {
    setTransactionType("");
    setAmount("");
    setResult(null);
    setIsCalculating(false);
  };

  return (
    <Card className="p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Withholding Tax (WHT) Calculator</h3>
      </div>

      <Alert className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <Info className="h-4 w-4 text-blue-900 dark:text-blue-100" />
        <AlertDescription className="text-blue-900 dark:text-blue-100 text-sm">
          Withholding Tax (WHT) is a tax deducted at source on certain transactions. 
          The payer must remit WHT to FIRS within 21 days of the transaction.
        </AlertDescription>
      </Alert>

      {/* Transaction Type Selection */}
      <div className="space-y-2 mb-4">
        <Label htmlFor="transaction-type">Transaction Type</Label>
        <Select value={transactionType} onValueChange={setTransactionType}>
          <SelectTrigger id="transaction-type">
            <SelectValue placeholder="Select transaction type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dividend">Dividend (10%)</SelectItem>
            <SelectItem value="interest">Interest (10%)</SelectItem>
            <SelectItem value="rent">Rent (10%)</SelectItem>
            <SelectItem value="royalty">Royalty (10%)</SelectItem>
            <SelectItem value="consultancy">Consultancy/Professional Fees (10%)</SelectItem>
            <SelectItem value="technical">Technical/Management Fees (10%)</SelectItem>
            <SelectItem value="contract">Contract/Construction (5%)</SelectItem>
            <SelectItem value="director-fee">Directors' Fees (10%)</SelectItem>
            <SelectItem value="commission">Commission/Brokerage (10%)</SelectItem>
          </SelectContent>
        </Select>
        {transactionType && (
          <p className="text-xs text-muted-foreground">
            {whtRates[transactionType as keyof typeof whtRates].description}
          </p>
        )}
      </div>

      {/* Amount Input */}
      <div className="space-y-2 mb-6">
        <Label htmlFor="amount">Gross Amount (₦)</Label>
        <Input
          id="amount"
          type="text"
          placeholder="0"
          value={amount}
          onChange={(e) => {
            const formatted = handleNumberInput(e.target.value);
            setAmount(formatted);
          }}
        />
        <p className="text-xs text-muted-foreground">
          Enter the total amount before WHT deduction
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Button 
          onClick={calculateWHT} 
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          disabled={!transactionType || !amount || isCalculating}
        >
          {isCalculating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="mr-2 h-4 w-4" />
              Calculate WHT
            </>
          )}
        </Button>

        <Button variant="outline" onClick={clearInputs} className="w-36" disabled={isCalculating && !result}>
          Clear
        </Button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg border-2 border-primary/20">
            <h4 className="text-lg font-bold text-foreground mb-4">WHT Calculation Summary</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm font-medium text-foreground">Gross Amount</span>
                <span className="text-lg font-semibold text-foreground">
                  {formatCurrency(result.grossAmount)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">WHT Rate</span>
                <span className="text-sm font-medium text-foreground">{result.whtRate}%</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">WHT to Deduct</span>
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                  -{formatCurrency(result.whtAmount)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 mt-3 border-t-2 border-primary/30">
                <span className="text-base font-bold text-foreground">Net Amount Payable</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(result.netAmount)}
                </span>
              </div>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Important Reminders:</strong><br />
              • Issue a WHT certificate to the recipient<br />
              • File WHT returns monthly (by the 21st)<br />
              • Remit WHT to FIRS within 21 days of transaction<br />
              • Maintain proper records of all WHT deductions<br />
              • Late remittance attracts penalties and interest
            </AlertDescription>
          </Alert>

          {/* Results Ad */}
          <div className="mt-6">
            <p className="text-xs text-muted-foreground mb-2 font-semibold">SPONSORED</p>
            <AdSenseAd slot="RESULTS_SLOT_WHT" format="horizontal" />
          </div>
        </div>
      )}

      {!result && (
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-semibold text-foreground mb-3 text-sm">WHT Quick Reference</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dividends, Interest, Rent, Royalty</span>
              <span className="font-medium text-foreground">10%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Professional/Consultancy Fees</span>
              <span className="font-medium text-foreground">10%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contract/Construction Services</span>
              <span className="font-medium text-foreground">5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Directors' Fees</span>
              <span className="font-medium text-foreground">10%</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default WithholdingTaxCalculator;
