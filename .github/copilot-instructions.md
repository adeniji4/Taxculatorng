# Copilot Instructions for Taxculator 2026

## Project Overview
Taxculator 2026 is a Nigerian tax calculation web application built with **Vite + React + TypeScript** using **shadcn-ui** components and **Tailwind CSS**. It provides calculators for Personal Tax (PAYE), Business Tax (CIT), VAT, Withholding Tax (WHT), and Crypto Tax, along with tax education and calendar features.

**Key URLs:**
- Lovable Project: https://lovable.dev/projects/1bf988b7-d69b-4d0d-841c-8e4844f2c518
- Tech Stack: React 18 + TypeScript + Vite + shadcn-ui + Tailwind CSS + React Router

## Architecture Patterns

### Page & Layout Structure
- **Pages** (`src/pages/`) are route-level components that wrap content with `DashboardLayout`
- **DashboardLayout** (`src/components/DashboardLayout.tsx`) handles:
  - Desktop sidebar (always visible on lg+ screens)
  - Mobile drawer sidebar with overlay
  - Mobile sticky header with menu toggle
  - Download PDF button with `generatePDF()` from `src/lib/pdfGenerator.ts`
- Example pattern from `PersonalTax.tsx`:
  ```tsx
  const [calculationData, setCalculationData] = useState(null);
  return (
    <DashboardLayout title="..." calculationData={calculationData} activeTab="individual">
      <IndividualCalculator onCalculate={setCalculationData} />
    </DashboardLayout>
  );
  ```

### Calculator Components
- **Location:** `src/components/`
- **Pattern:** Stateful components that accept `onCalculate` callback prop
- **Behavior:** Calculate on value change using `useEffect`, pass results object to parent
- **Examples:** `CompanyCalculator`, `IndividualCalculator`, `VATCalculator`, `WithholdingTaxCalculator`, `CryptoTaxCalculator`
- **Key logic:** Tax thresholds (e.g., small companies under ₦100m turnover are exempt), rate calculations (CIT 25%, Dev Levy 4%)

### Routing
- **Router:** React Router v6 in `src/App.tsx`
- **Routes defined:**
  - `/` → PersonalTax (PAYE calculator)
  - `/business-tax` → BusinessTax (CIT calculator)
  - `/vat-calculator` → VAT page
  - `/wht-calculator` → WHT page
  - `/crypto-tax` → Crypto tax estimator
  - `/tax-calendar` → Tax calendar for 2026
  - `/tax-law` → Tax education/law reference
  - `*` → NotFound (catch-all)

### UI Component Library
- **All components from shadcn-ui** imported from `@/components/ui/`
- **Navigation:** Custom `NavLink` wrapper with active state styling (green `#008751` color scheme)
- **Icons:** `lucide-react` for all icons (Calculator, Building2, Bitcoin, etc.)
- **Styling:** Tailwind CSS with custom utilities in `src/index.css`
- **Alerts & Toasts:** Use `<Alert>` from ui/alert.tsx or `toast()` from ui/use-toast.ts

## Developer Workflows

### Setup & Running
```bash
# Install dependencies
npm install

# Start dev server (auto-reload on port 8080, fallback to 8081 if in use)
npm run dev

# Build for production
npm build

# Build in dev mode
npm run build:dev

# Lint (ESLint)
npm run lint

# Preview production build locally
npm run preview
```

### Key Commands
- **Port:** Default 8080, auto-increments if busy
- **Environment:** Lovable tagger plugin in development mode (`mode === "development"`)
- **Build output:** Standard Vite output

### Import Aliases
- `@` maps to `src/` directory (configured in `vite.config.ts` and `tsconfig.json`)
- Always use `@/` prefix for imports: `import X from "@/components/..."`

## Project Conventions

### File Organization
- **Pages** → route components in `src/pages/`
- **Feature components** → `src/components/` (e.g., calculators, DashboardLayout)
- **UI primitives** → `src/components/ui/` (shadcn-ui components, do not modify)
- **Utilities** → `src/lib/` (pdfGenerator.ts, utils.ts)
- **Hooks** → `src/hooks/` (mobile detection, toast usage)

### Naming & Patterns
- **Components:** PascalCase (PersonalTax.tsx, CompanyCalculator.tsx)
- **Props interface:** ComponentNameProps (CompanyCalculatorProps with onCalculate callback)
- **State updates:** Pass calculation results objects with keys like `{ turnover, cit, devLevy, totalTax, message }`
- **Currency formatting:** Use Nigerian Naira (NGN) with `Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' })`

### Responsive Design
- **Breakpoint:** lg (1024px) is primary breakpoint
  - `hidden lg:block` for desktop sidebar
  - `lg:hidden` for mobile drawer
- **Mobile first:** Mobile drawer, sticky header, hamburger menu
- **Grid layouts:** `grid md:grid-cols-2` for form fields

## PDF Generation & Export
- **Function:** `generatePDF(type, data)` in `src/lib/pdfGenerator.ts`
- **Types:** "individual" | "company" | "tools"
- **Dependencies:** jsPDF (v3.0.4)
- **Header:** Nigerian green (#008751), app branding
- **Footer:** Legal notice referencing Nigeria Tax Act 2025
- **Usage:** Called from DashboardLayout when Download button clicked

## External Dependencies
- **React Query:** `@tanstack/react-query` for potential data fetching
- **React Router:** Navigation and routing
- **Form Handling:** `@hookform/resolvers` (setup ready but minimal form usage currently)
- **PDF:** jsPDF
- **Date Utilities:** date-fns (for calendar features)
- **Styling:** clsx + tailwind-merge for className utilities (`cn` helper)

## Integration Points & Cross-Component Communication
- **Calculator → Parent Page:** Via `onCalculate` callback prop
- **Page → DashboardLayout:** Pass `calculationData` and `activeTab` props
- **Sidebar navigation:** Uses `useLocation()` from React Router for active route highlighting
- **Mobile menu:** State managed in DashboardLayout, passed as `onLinkClick` to AppSidebar

## Important Notes
- ⚠️ **Lovable integration:** Changes sync bidirectionally—edits in IDE push to Lovable, and vice versa
- ⚠️ **UI Components:** shadcn-ui components in `src/components/ui/` are controlled by Lovable; avoid direct edits unless necessary
- ⚠️ **Tax calculations:** Must comply with Nigeria Tax Act 2025 (effective Jan 1, 2026)
- ✅ **TypeScript config:** Loose checks enabled (noImplicitAny: false, strictNullChecks: false) for flexibility
- ✅ **Router:** Always add custom routes ABOVE the `*` catch-all route in App.tsx

## When Adding New Features
1. Create route in App.tsx (before `*` catch-all)
2. Create page component in `src/pages/`
3. Wrap with `DashboardLayout` component
4. Create calculator or content component if needed
5. Add navigation item to `menuItems` array in `AppSidebar.tsx`
6. Use established props patterns (onCalculate callbacks, state management)
