import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PersonalTax from "./pages/PersonalTax";
import BusinessTax from "./pages/BusinessTax";
import VATPage from "./pages/VATPage";
import WHTPage from "./pages/WHTPage";
import CryptoTaxPage from "./pages/CryptoTaxPage";
import TaxCalendarPage from "./pages/TaxCalendarPage";
import TaxLawPage from "./pages/TaxLawPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PersonalTax />} />
          <Route path="/business-tax" element={<BusinessTax />} />
          <Route path="/vat-calculator" element={<VATPage />} />
          <Route path="/wht-calculator" element={<WHTPage />} />
          <Route path="/crypto-tax" element={<CryptoTaxPage />} />
          <Route path="/tax-calendar" element={<TaxCalendarPage />} />
          <Route path="/tax-law" element={<TaxLawPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
