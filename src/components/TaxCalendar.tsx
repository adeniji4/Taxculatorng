import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, AlertCircle, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DeadlineCategory = "WHT" | "VAT" | "PAYE" | "CIT" | "Returns";

interface TaxDeadline {
  title: string;
  description: string;
  category: DeadlineCategory;
}

const TaxCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedCategories, setSelectedCategories] = useState<DeadlineCategory[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 0, 1));

  // Map of tax deadlines by date (format: "2026-MM-DD")
  const taxDeadlines: Record<string, TaxDeadline[]> = {
    "2026-01-21": [{ title: "WHT Remittance", description: "Monthly Withholding Tax remittance to FIRS", category: "WHT" }],
    "2026-01-31": [{ title: "Annual Tax Returns", description: "Submit previous year's tax returns for individuals and companies", category: "Returns" }],
    
    "2026-02-21": [{ title: "WHT Remittance", description: "Monthly Withholding Tax remittance to FIRS", category: "WHT" }],
    "2026-02-28": [{ title: "PAYE Returns", description: "Submit monthly PAYE returns", category: "PAYE" }],
    
    "2026-03-21": [{ title: "WHT Remittance", description: "Monthly Withholding Tax remittance to FIRS", category: "WHT" }],
    "2026-03-31": [
      { title: "Q1 VAT Returns", description: "Submit Value Added Tax returns for Q1", category: "VAT" },
      { title: "Annual Tax Returns", description: "Extended deadline for corporate tax returns", category: "Returns" }
    ],
    
    "2026-04-21": [{ title: "WHT Remittance", description: "Monthly Withholding Tax remittance to FIRS", category: "WHT" }],
    
    "2026-05-21": [{ title: "WHT Remittance", description: "Monthly Withholding Tax remittance to FIRS", category: "WHT" }],
    
    "2026-06-21": [{ title: "WHT Remittance", description: "Monthly Withholding Tax remittance to FIRS", category: "WHT" }],
    "2026-06-30": [
      { title: "Q2 VAT Returns", description: "Submit Value Added Tax returns for Q2", category: "VAT" },
      { title: "Mid-Year Company Tax", description: "Companies pay 50% of estimated annual tax", category: "CIT" }
    ],
    
    "2026-07-21": [{ title: "WHT Remittance", description: "Monthly Withholding Tax remittance to FIRS", category: "WHT" }],
    
    "2026-08-21": [{ title: "WHT Remittance", description: "Monthly Withholding Tax remittance to FIRS", category: "WHT" }],
    
    "2026-09-21": [{ title: "WHT Remittance", description: "Monthly Withholding Tax remittance to FIRS", category: "WHT" }],
    "2026-09-30": [{ title: "Q3 VAT Returns", description: "Submit Value Added Tax returns for Q3", category: "VAT" }],
    
    "2026-10-21": [{ title: "WHT Remittance", description: "Monthly Withholding Tax remittance to FIRS", category: "WHT" }],
    
    "2026-11-21": [{ title: "WHT Remittance", description: "Monthly Withholding Tax remittance to FIRS", category: "WHT" }],
    
    "2026-12-21": [{ title: "WHT Remittance", description: "Monthly Withholding Tax remittance to FIRS", category: "WHT" }],
    "2026-12-31": [
      { title: "Q4 VAT Returns", description: "Submit Value Added Tax returns for Q4", category: "VAT" },
      { title: "Year-End PAYE", description: "Final PAYE remittance for the year", category: "PAYE" }
    ]
  };

  // Category colors
  const categoryColors: Record<DeadlineCategory, string> = {
    WHT: "bg-blue-500",
    VAT: "bg-green-500",
    PAYE: "bg-purple-500",
    CIT: "bg-orange-500",
    Returns: "bg-red-500"
  };

  // Format date as "YYYY-MM-DD"
  const formatDateKey = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Filter deadlines by selected categories
  const filterDeadlines = (deadlines: TaxDeadline[]): TaxDeadline[] => {
    if (selectedCategories.length === 0) return deadlines;
    return deadlines.filter(d => selectedCategories.includes(d.category));
  };

  // Get filtered deadlines for each date
  const filteredTaxDeadlines = useMemo(() => {
    if (selectedCategories.length === 0) return taxDeadlines;
    
    const filtered: Record<string, TaxDeadline[]> = {};
    Object.entries(taxDeadlines).forEach(([date, deadlines]) => {
      const filteredDeadlines = filterDeadlines(deadlines);
      if (filteredDeadlines.length > 0) {
        filtered[date] = filteredDeadlines;
      }
    });
    return filtered;
  }, [selectedCategories]);

  // Get all deadline dates as Date objects
  const parseDateStringToLocal = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const deadlineDates = Object.keys(filteredTaxDeadlines).map(dateStr => parseDateStringToLocal(dateStr));

  // Check if a date has deadlines
  const hasDeadline = (date: Date): boolean => {
    const key = formatDateKey(date);
    return !!filteredTaxDeadlines[key];
  };

  // Get deadlines for selected date
  const getSelectedDeadlines = (): TaxDeadline[] => {
    if (!selectedDate) return [];
    const key = formatDateKey(selectedDate);
    // respect active category filters by reading from filteredTaxDeadlines first
    const source = filteredTaxDeadlines[key] || taxDeadlines[key] || [];
    return filterDeadlines(source);
  };

  // Get all deadlines in chronological order
  const allDeadlinesChronological = useMemo(() => {
    const allDeadlines: Array<{ date: string; deadlines: TaxDeadline[] }> = [];
    Object.entries(filteredTaxDeadlines)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .forEach(([date, deadlines]) => {
        allDeadlines.push({ date, deadlines });
      });
    return allDeadlines;
  }, [filteredTaxDeadlines]);

  // Toggle category filter
  const toggleCategory = (category: DeadlineCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold text-foreground">Nigerian Tax Calendar 2026</h3>
        </div>

        <Alert className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-900 dark:text-blue-100" />
          <AlertDescription className="text-blue-900 dark:text-blue-100 text-sm">
            <strong>Important:</strong> Always verify specific deadlines with FIRS as dates may change. 
            Penalties apply for late filing and payment.
          </AlertDescription>
        </Alert>

        {/* Filter Buttons */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filter by Type:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["WHT", "VAT", "PAYE", "CIT", "Returns"] as DeadlineCategory[]).map((category) => (
              <Button
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleCategory(category)}
                className="gap-2"
              >
                <span className={cn("h-2 w-2 rounded-full", categoryColors[category])} />
                {category}
              </Button>
            ))}
            {selectedCategories.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategories([])}
                className="text-muted-foreground"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  aria-label="Previous month"
                  className="p-2 rounded hover:bg-muted/50"
                  onClick={() => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  aria-label="Next month"
                  className="p-2 rounded hover:bg-muted/50"
                  onClick={() => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="ml-3 text-lg font-semibold">
                  {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentMonth(new Date(2026, 0, 1))}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Reset to 2026
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                defaultMonth={currentMonth}
                fromDate={new Date(2026, 0, 1)}
                toDate={new Date(2026, 11, 31)}
                modifiers={{
                  deadline: deadlineDates
                }}
                modifiersClassNames={{
                  deadline: "font-bold text-primary relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
                }}
                className="rounded-md border"
              />
            </div>
          </div>

          {/* Deadline Details */}
          <div className="flex-1">
            <div className="sticky top-20">
              {selectedDate && getSelectedDeadlines().length > 0 ? (
                <div className="border rounded-lg p-4 bg-card shadow-sm">
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </h4>
                  <div className="space-y-3">
                    {getSelectedDeadlines().map((deadline, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <span className={cn("h-2 w-2 rounded-full mt-1.5 flex-shrink-0", categoryColors[deadline.category])} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold text-foreground text-sm">{deadline.title}</h5>
                            <Badge variant="secondary" className="text-xs">{deadline.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{deadline.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg p-6 bg-muted/10 text-center">
                  <p className="text-muted-foreground text-sm">
                    Click a date (highlighted) to view tax deadlines for that day.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Alert className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Key Reminders:</strong><br />
            • PAYE must be remitted by the 10th of the following month<br />
            • VAT returns are due within 21 days after each quarter<br />
            • Companies Income Tax is payable in installments (June and at year-end)<br />
            • Keep records for at least 6 years as required by law
          </AlertDescription>
        </Alert>
      </Card>

      {/* Chronological list removed — details shown in the right panel when a date is clicked */}
    </div>
  );
};

export default TaxCalendar;
