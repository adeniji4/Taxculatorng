import { Card } from "@/components/ui/card";
import { BookOpen, AlertCircle, CheckCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const TaxEducation = () => {
  return (
    <Card className="p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Understanding Nigerian Tax Law</h3>
      </div>

      <Alert className="mb-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
        <CheckCircle className="h-4 w-4 text-green-900 dark:text-green-100" />
        <AlertDescription className="text-green-900 dark:text-green-100 text-sm">
          <strong>Good News!</strong> Understanding your tax obligations helps you maximize legal deductions 
          and avoid penalties. This guide simplifies Nigerian tax law for you.
        </AlertDescription>
      </Alert>

      <Accordion type="single" collapsible className="space-y-2">
        {/* PAYE Section */}
        <AccordionItem value="paye" className="border rounded-lg px-4">
          <AccordionTrigger className="text-left hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="font-semibold">What is PAYE (Pay As You Earn)?</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pt-2">
            <p className="mb-3">
              PAYE is income tax deducted from your salary by your employer before you receive your pay. 
              It applies to all employees in Nigeria earning above the tax-free threshold.
            </p>
            <div className="bg-muted p-3 rounded-lg mb-3">
              <p className="font-semibold text-foreground mb-2">Key Points:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Your employer calculates and deducts PAYE monthly</li>
                <li>First ₦800,000 of taxable income is tax-free (2026 rate)</li>
                <li>Tax rates range from 15% to 25% on income above ₦800,000</li>
                <li>You should receive a payslip showing PAYE deductions</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tax Reliefs Section */}
        <AccordionItem value="reliefs" className="border rounded-lg px-4">
          <AccordionTrigger className="text-left hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="font-semibold">What Tax Reliefs Can I Claim?</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pt-2">
            <p className="mb-3">
              Tax reliefs reduce your taxable income, which means you pay less tax. Here are the main reliefs available:
            </p>
            <div className="space-y-3">
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-semibold text-foreground mb-1">1. Pension Relief (8%)</p>
                <p>Your employer deducts 8% of your gross salary for pension. This amount is tax-free.</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-semibold text-foreground mb-1">2. Rent Relief</p>
                <p>You can claim 20% of your annual rent, up to a maximum of ₦500,000 per year.</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-semibold text-foreground mb-1">3. National Housing Fund (NHF) - Optional</p>
                <p>If you contribute 2.5% of your salary to NHF, this is also tax-deductible.</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-semibold text-foreground mb-1">4. Health Insurance (NHIS)</p>
                <p>Contributions to approved health insurance schemes are tax-deductible.</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tax Filing Section */}
        <AccordionItem value="filing" className="border rounded-lg px-4">
          <AccordionTrigger className="text-left hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="font-semibold">Do I Need to File Tax Returns?</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pt-2">
            <p className="mb-3">
              Yes! Even if your employer deducts PAYE, you must file annual tax returns by March 31st each year.
            </p>
            <div className="bg-muted p-3 rounded-lg mb-3">
              <p className="font-semibold text-foreground mb-2">Who Must File:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>All employees earning taxable income</li>
                <li>Self-employed individuals and business owners</li>
                <li>Anyone with rental or investment income</li>
                <li>Company directors</li>
              </ul>
            </div>
            <Alert className="mt-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                You can file online at <strong>taxpromax.firs.gov.ng</strong> or visit your nearest FIRS office.
              </AlertDescription>
            </Alert>
          </AccordionContent>
        </AccordionItem>

        {/* TIN Section */}
        <AccordionItem value="tin" className="border rounded-lg px-4">
          <AccordionTrigger className="text-left hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="font-semibold">What is a TIN and Why Do I Need It?</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pt-2">
            <p className="mb-3">
              Your Tax Identification Number (TIN) is a unique number that identifies you with FIRS. 
              It's like your tax "ID card" for life.
            </p>
            <div className="bg-muted p-3 rounded-lg mb-3">
              <p className="font-semibold text-foreground mb-2">Why You Need a TIN:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Required for filing tax returns</li>
                <li>Needed to open corporate bank accounts</li>
                <li>Required for government contracts and tenders</li>
                <li>Necessary for importing/exporting goods</li>
                <li>Required for property transactions above ₦5 million</li>
              </ul>
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Get your TIN free at <strong>tin.firs.gov.ng</strong> or visit any FIRS office with valid ID.
              </AlertDescription>
            </Alert>
          </AccordionContent>
        </AccordionItem>

        {/* Penalties Section */}
        <AccordionItem value="penalties" className="border rounded-lg px-4">
          <AccordionTrigger className="text-left hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="font-semibold">What Happens If I Don't Pay or File?</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pt-2">
            <Alert className="mb-3 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4 text-red-900 dark:text-red-100" />
              <AlertDescription className="text-red-900 dark:text-red-100 text-sm">
                <strong>Warning:</strong> Tax evasion is a criminal offense in Nigeria with serious consequences.
              </AlertDescription>
            </Alert>
            <div className="space-y-3">
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-semibold text-foreground mb-1">Late Filing Penalty</p>
                <p>₦25,000 initial penalty, plus ₦5,000 for every month the failure continues</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-semibold text-foreground mb-1">Late Payment Penalty</p>
                <p>10% of unpaid tax, plus 5% interest per annum on outstanding amount</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-semibold text-foreground mb-1">Criminal Prosecution</p>
                <p>Tax evasion can result in imprisonment for up to 3 years or a fine of up to ₦10 million</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Self-Employment Section */}
        <AccordionItem value="self-employed" className="border rounded-lg px-4">
          <AccordionTrigger className="text-left hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="font-semibold">I'm Self-Employed. How Does Tax Work for Me?</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pt-2">
            <p className="mb-3">
              As a self-employed individual or business owner, you're responsible for calculating and paying your own tax.
            </p>
            <div className="bg-muted p-3 rounded-lg mb-3">
              <p className="font-semibold text-foreground mb-2">Your Tax Obligations:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Keep accurate records of all income and expenses</li>
                <li>File annual tax returns showing your profit/loss</li>
                <li>Pay tax on your net profit (after allowable expenses)</li>
                <li>Make advance tax payments in June and December</li>
              </ul>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="font-semibold text-foreground mb-2">Allowable Business Expenses:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Office rent and utilities</li>
                <li>Business equipment and tools</li>
                <li>Transport for business purposes</li>
                <li>Professional training and licenses</li>
                <li>Marketing and advertising costs</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* VAT Section */}
        <AccordionItem value="vat" className="border rounded-lg px-4">
          <AccordionTrigger className="text-left hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="font-semibold">What is VAT and When Do I Charge It?</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pt-2">
            <p className="mb-3">
              Value Added Tax (VAT) is a consumption tax added to the price of goods and services. 
              The current rate in Nigeria is 7.5%.
            </p>
            <div className="bg-muted p-3 rounded-lg mb-3">
              <p className="font-semibold text-foreground mb-2">When to Register for VAT:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>If your annual turnover exceeds ₦25 million</li>
                <li>You can voluntarily register below this threshold</li>
              </ul>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="font-semibold text-foreground mb-2">VAT Exemptions:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Medical and pharmaceutical products</li>
                <li>Basic food items (rice, bread, milk, etc.)</li>
                <li>Books and educational materials</li>
                <li>Baby products</li>
                <li>Agricultural equipment and inputs</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Resources Section */}
        <AccordionItem value="resources" className="border rounded-lg px-4">
          <AccordionTrigger className="text-left hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="font-semibold">Where Can I Get Help?</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pt-2">
            <div className="space-y-3">
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-semibold text-foreground mb-1">Federal Inland Revenue Service (FIRS)</p>
                <p className="mb-2">The main tax authority in Nigeria</p>
                <ul className="space-y-1 text-xs">
                  <li>Website: <span className="text-primary">www.firs.gov.ng</span></li>
                  <li>Contact Centre: 0700-CALL-FIRS (0700-2255-3477)</li>
                  <li>Email: contactcentre@firs.gov.ng</li>
                </ul>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-semibold text-foreground mb-1">TaxProMax</p>
                <p className="mb-2">Online tax filing platform</p>
                <ul className="space-y-1 text-xs">
                  <li>Website: <span className="text-primary">taxpromax.firs.gov.ng</span></li>
                  <li>File returns, pay taxes, and download receipts online</li>
                </ul>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-semibold text-foreground mb-1">State Tax Authorities</p>
                <p className="text-xs">For PAYE and personal income tax, contact your State Internal Revenue Service (SIRS)</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Alert className="mt-6">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Disclaimer:</strong> This guide provides general information only and should not replace 
          professional tax advice. Tax laws change regularly. Always verify current requirements with FIRS 
          or consult a qualified tax professional for your specific situation.
        </AlertDescription>
      </Alert>
    </Card>
  );
};

export default TaxEducation;
