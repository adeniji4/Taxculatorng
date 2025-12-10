import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { AdSenseAd } from "@/components/AdSenseAd";

const CryptoTaxCalculator = () => {
  const [profit, setProfit] = useState<string>("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const profitAmount = parseFloat(profit) || 0;
  const tax = profitAmount * 0.1; // 10% flat rate

  const clearInputs = () => {
    setProfit("");
  };

  return (
    <Card className="p-6 shadow-lg">
      <h3 className="text-xl font-bold text-foreground mb-4">Crypto Profit Tax Estimator</h3>
      
      {/* Profit Input */}
      <div className="space-y-2 mb-6">
        <Label htmlFor="crypto-profit">Profit from Crypto/Forex (₦)</Label>
        <Input
          id="crypto-profit"
          type="number"
          placeholder="0.00"
          value={profit}
          onChange={(e) => setProfit(e.target.value)}
        />
      </div>

      <div className="flex gap-3 mb-4">
        <Button size="sm" variant="outline" onClick={clearInputs} disabled={profitAmount === 0}>
          Clear
        </Button>
      </div>

      {/* Result */}
      {profitAmount > 0 && (
        <div className="space-y-4">
          <div className="bg-primary p-4 rounded-lg">
            <p className="text-sm text-primary-foreground mb-1">Estimated Tax (10%)</p>
            <p className="text-2xl font-bold text-primary-foreground">
              {formatCurrency(tax)}
            </p>
          </div>

          <div className="bg-secondary p-3 rounded-lg">
            <p className="text-sm text-secondary-foreground">Net Profit After Tax</p>
            <p className="text-lg font-semibold text-secondary-foreground">
              {formatCurrency(profitAmount - tax)}
            </p>
          </div>

          {/* Disclaimer */}
          <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <Info className="h-4 w-4 text-amber-900 dark:text-amber-100" />
            <AlertDescription className="text-amber-900 dark:text-amber-100 text-sm">
              <strong>Disclaimer:</strong> Under the 2025 Act, digital asset gains are taxable. 
              This is a simplified estimate using a 10% Capital Gains rate. 
              Consult a tax professional for exact filing requirements.
            </AlertDescription>
          </Alert>

          {/* Results Ad */}
          <div className="mt-6">
            <p className="text-xs text-muted-foreground mb-2 font-semibold">SPONSORED</p>
            <AdSenseAd slot="RESULTS_SLOT_CRYPTO" format="horizontal" />
          </div>
        </div>
      )}
    </Card>
  );
};

export default CryptoTaxCalculator;
