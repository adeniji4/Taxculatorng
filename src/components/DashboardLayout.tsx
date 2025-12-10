import { ReactNode, useState } from "react";
import { Menu, Download, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/AppSidebar";
import HowToPayModal from "@/components/HowToPayModal";
import { generatePDF } from "@/lib/pdfGenerator";
import { AdSenseAd } from "@/components/AdSenseAd";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  calculationData?: any;
  activeTab?: "individual" | "company" | "tools";
}

export function DashboardLayout({ children, title, calculationData, activeTab = "individual" }: DashboardLayoutProps) {
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDownloadReport = () => {
    if (calculationData) {
      generatePDF(activeTab, calculationData);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Desktop Sidebar - Always Visible on Large Screens */}
      <div className="hidden lg:block">
        <AppSidebar onLinkClick={closeMobileMenu} />
      </div>

      {/* Desktop Right Ad Sidebar */}
      <div className="hidden lg:flex lg:w-72 xl:w-80 flex-col bg-white border-l border-border p-4 overflow-y-auto">
        <div className="sticky top-4 space-y-6">
          <div>
            <p className="text-xs text-muted-foreground mb-3 font-semibold">SPONSORED</p>
            <AdSenseAd slot="1234567890" format="vertical" />
          </div>
          <div className="border-t border-border pt-6">
            <AdSenseAd slot="0987654321" format="vertical" />
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full z-50 lg:hidden transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative h-full bg-white">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10"
            onClick={closeMobileMenu}
          >
            <X className="h-5 w-5" />
          </Button>
          <AppSidebar onLinkClick={closeMobileMenu} />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header - Sticky at Top */}
        <header className="lg:hidden sticky top-0 z-30 border-b border-border bg-white shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">₦</span>
              </div>
              <h1 className="text-lg font-semibold">Taxculator 2026</h1>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8">
            {/* Top Banner Ad - Mobile Only */}
            <div className="mb-6 lg:hidden">
              <p className="text-xs text-muted-foreground mb-2 font-semibold">SPONSORED</p>
              <AdSenseAd slot="1234567890" format="horizontal" />
            </div>

            {/* Page Header */}
            <div className="mb-6 md:mb-8 flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">{title}</h2>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setIsPayModalOpen(true)}
                  className="gap-2"
                >
                  <Info className="h-4 w-4" />
                  <span className="hidden sm:inline">How do I pay?</span>
                </Button>
                <Button 
                  onClick={handleDownloadReport}
                  disabled={!calculationData}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download Report</span>
                </Button>
              </div>
            </div>

            {/* Ad directly below page title (consistent across pages) */}
            <div className="mb-6">
              <p className="text-xs text-muted-foreground mb-2 font-semibold">SPONSORED</p>
              <AdSenseAd slot="TITLE_SLOT_1" format="horizontal" />
            </div>

            {/* Page Content */}
            <div className="max-w-4xl">
              {children}
            </div>

            {/* Ad shown directly below calculator results when data exists (PersonalTax) */}
            {calculationData && activeTab === "individual" && (
              <div className="mt-6">
                <AdSenseAd slot="RESULTS_SLOT_1" format="horizontal" />
              </div>
            )}

            {/* Bottom Banner Ad */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2 font-semibold">SPONSORED</p>
              <AdSenseAd slot="0987654321" format="horizontal" />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-white py-4 md:py-6 px-4 md:px-6 lg:px-8">
          <div className="text-center text-muted-foreground text-sm">
            <p>© 2026 Taxculator. Calculations based on Nigeria Tax Act 2025.</p>
            <p className="mt-1">For informational purposes only. Consult a tax professional for specific advice.</p>
          </div>
        </footer>
      </div>

      <HowToPayModal 
        isOpen={isPayModalOpen} 
        onClose={() => setIsPayModalOpen(false)}
        activeTab={activeTab}
      />
    </div>
  );
}
