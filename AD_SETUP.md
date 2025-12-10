AdSense Integration Notes

Files updated:
- `index.html` — AdSense script + page-level ads push
- `src/components/AdSenseAd.tsx` — reusable ad unit (responsive)
- `src/components/InArticleAd.tsx` — responsive in-article ad unit
- `src/components/DashboardLayout.tsx` — ad under page title, ad below results, right sidebar vertical ads, bottom banner
 - `src/pages/PersonalTax.tsx` — explanatory content + in-article ad
 - `src/pages/*` — added consistent in-article ad placeholders for BusinessTax, VATPage, WHTPage, CryptoTaxPage, TaxCalendarPage, TaxLawPage
 - Calculator components updated: `CompanyCalculator`, `VATCalculator`, `WithholdingTaxCalculator`, `CryptoTaxCalculator` now render a results-level ad when results exist

Important: replace placeholders before going live
- In `index.html` replace `ca-pub-xxxxxxxxxxxxxxxx` with your AdSense Publisher ID.
- In `src/components/AdSenseAd.tsx` and `src/components/InArticleAd.tsx` replace `data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"` with your Publisher ID.
- Replace ad `slot` strings (e.g. `TITLE_SLOT_1`, `RESULTS_SLOT_1`, `IN_ARTICLE_SLOT_1`, `1234567890`, `0987654321`) with the real ad slot IDs provided by AdSense when you create ad units.
 - Replace ad `slot` strings (e.g. `TITLE_SLOT_1`, `RESULTS_SLOT_COMPANY`, `RESULTS_SLOT_VAT`, `RESULTS_SLOT_WHT`, `RESULTS_SLOT_CRYPTO`, `IN_ARTICLE_SLOT_COMPANY`, `IN_ARTICLE_SLOT_VAT`, `IN_ARTICLE_SLOT_WHT`, `IN_ARTICLE_SLOT_CRYPTO`, `IN_ARTICLE_SLOT_CALENDAR`, `IN_ARTICLE_SLOT_TAXLAW`, `1234567890`, `0987654321`) with the real ad slot IDs provided by AdSense when you create ad units.

Auto Ads
- Auto Ads (anchor and vignette) must be enabled in your AdSense dashboard. The script and push call are included in `index.html` but Google will only show Auto Ads when enabled for your property.

Testing locally
- AdSense often hides ads for `localhost` and local files. To test layout/responsiveness:
  - Use your browser devtools to emulate mobile/desktop widths.
  - Use test ad slot IDs if provided by AdSense, or expect placeholders until deployed to a domain approved by AdSense.

Placement guidance implemented
- Ads are placed outside calculator inputs/buttons (below title, below results, in-article section, right sidebar, and bottom banner)
- Right sidebar uses `lg+` breakpoints to avoid mobile clutter
- Avoided placing ads inside inputs/buttons per your request

Notes on placements
- Title ad: displayed below page title on all pages for consistency (labelled "SPONSORED").
- Results ads: placed below calculator results inside each calculator component to ensure they appear only after a calculation finishes.
- In-article ads: inserted into page content areas below calculators and explanatory sections.
- Sidebar ads: remain on the right-hand whitespace for `lg+` screens (300×250 or 300×600 units).

Privacy & Policy
- Ensure you add a privacy policy and follow AdSense placement policies (no deceptive placements, avoid encouraging clicks, disclose sponsored content if required).
