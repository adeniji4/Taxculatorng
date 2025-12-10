import { Calculator, Building2, Receipt, FileText, Bitcoin, CalendarDays, BookOpen } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
const menuItems = [{
  title: "Personal Tax (PAYE)",
  url: "/",
  icon: Calculator
}, {
  title: "Business Tax (CIT)",
  url: "/business-tax",
  icon: Building2
}, {
  title: "VAT Calculator",
  url: "/vat-calculator",
  icon: Receipt
}, {
  title: "WHT Calculator",
  url: "/wht-calculator",
  icon: FileText
}, {
  title: "Crypto Tax Estimator",
  url: "/crypto-tax",
  icon: Bitcoin
}, {
  title: "Tax Calendar 2026",
  url: "/tax-calendar",
  icon: CalendarDays
}, {
  title: "Understanding Tax Law",
  url: "/tax-law",
  icon: BookOpen
}];
interface AppSidebarProps {
  onLinkClick?: () => void;
}
export function AppSidebar({
  onLinkClick
}: AppSidebarProps) {
  const location = useLocation();
  return <div className="w-64 h-full border-r border-border bg-white flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">₦</span>
          </div>
          <h1 className="text-xl font-bold text-foreground font-sans">​Taxculator ng   </h1>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {menuItems.map(item => {
          const isActive = location.pathname === item.url;
          return <li key={item.title}>
                <NavLink to={item.url} end onClick={onLinkClick} className="relative flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors" activeClassName="text-[#008751] bg-[#008751]/10 font-medium before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#008751] before:rounded-l-lg">
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.title}</span>
                </NavLink>
              </li>;
        })}
        </ul>
      </nav>
    </div>;
}