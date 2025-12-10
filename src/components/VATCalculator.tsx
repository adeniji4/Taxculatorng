import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { AdSenseAd } from "@/components/AdSenseAd";

const VATCalculator = () => {
  const [amount, setAmount] = useState<string>("");
  const [isAddVAT, setIsAddVAT] = useState(true);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const inputAmount = parseFloat(amount) || 0;
  const result = isAddVAT ? inputAmount * 1.075 : inputAmount / 1.075;
  const vatAmount = isAddVAT ? inputAmount * 0.075 : inputAmount - (inputAmount / 1.075);

  const clearInputs = () => {
    setAmount("");
    setIsAddVAT(true);
  };

  return (
    <Card className="p-6 shadow-lg">
      <h3 className="text-xl font-bold text-foreground mb-4">VAT Calculator (7.5%)</h3>
      
      {/* Toggle: Add VAT or Remove VAT */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-between">
          <Label htmlFor="vat-mode" className="text-base font-medium">
            {isAddVAT ? "Add VAT" : "Remove VAT"}
          </Label>
          <Switch
            id="vat-mode"
            checked={isAddVAT}
            onCheckedChange={setIsAddVAT}
          />
        </div>
      </div>

      {/* Amount Input */}
      <div className="space-y-2 mb-6">
        <Label htmlFor="amount">Amount (₦)</Label>
        <Input
          id="amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-4">
        <Button size="sm" variant="outline" onClick={clearInputs} disabled={inputAmount === 0}>
          Clear
        </Button>
      </div>

      {/* Result */}
      {inputAmount > 0 && (
        <div className="space-y-4">
          <div className="bg-primary p-4 rounded-lg">
            <p className="text-sm text-primary-foreground mb-1">
              {isAddVAT ? "Amount with VAT" : "Amount without VAT"}
            </p>
            <p className="text-2xl font-bold text-primary-foreground">
              {formatCurrency(result)}
            </p>
          </div>

          <div className="bg-secondary p-3 rounded-lg">
            <p className="text-sm text-secondary-foreground">VAT Amount (7.5%)</p>
            <p className="text-lg font-semibold text-secondary-foreground">
              {formatCurrency(vatAmount)}
            </p>
          </div>

          {/* Smart Tip */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Smart Tip
            </h5>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Did you know? If your business turnover is less than ₦25 Million, you are EXEMPT from charging VAT.
            </p>
          </div>

          {/* Results Ad */}
          <div className="mt-6">
            <p className="text-xs text-muted-foreground mb-2 font-semibold">SPONSORED</p>
            <AdSenseAd slot="RESULTS_SLOT_VAT" format="horizontal" />
          </div>
        </div>
      )}
    </Card>
  );
};

export default VATCalculator;
