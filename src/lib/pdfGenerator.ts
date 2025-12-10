import jsPDF from "jspdf";

export const generatePDF = (type: "individual" | "company" | "tools", data: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentPage = 1;
  
  // Helper function to add page header
  const addPageHeader = () => {
    doc.setFillColor(0, 135, 81); // Nigerian green
    doc.rect(0, 0, pageWidth, 35, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Taxculator 2026", 20, 15);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Comprehensive Tax Report", 20, 25);
    
    // Page number
    doc.setFontSize(9);
    doc.text(`Page ${currentPage}`, pageWidth - 30, 25);
  };
  
  // Helper function to add page footer
  const addPageFooter = () => {
    const footerY = pageHeight - 15;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.setFont("helvetica", "italic");
    doc.text("Based on Nigeria Tax Act 2025 (effective January 1, 2026)", 20, footerY);
    doc.text("For informational purposes only. Consult a tax professional.", 20, footerY + 5);
  };
  
  // Helper function to check if new page is needed
  const checkNewPage = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - 25) {
      addPageFooter();
      doc.addPage();
      currentPage++;
      addPageHeader();
      yPos = 50;
      return true;
    }
    return false;
  };
  
  // Helper function to add section header
  const addSectionHeader = (title: string) => {
    checkNewPage(20);
    doc.setFillColor(240, 240, 240);
    doc.rect(15, yPos - 5, pageWidth - 30, 12, "F");
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 135, 81);
    doc.text(title, 20, yPos + 3);
    doc.setTextColor(0, 0, 0);
    yPos += 18;
  };
  
  // Helper function to add divider line
  const addDivider = () => {
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 8;
  };
  
  // Initialize first page
  addPageHeader();
  doc.setTextColor(0, 0, 0);
  
  let yPos = 50;
  
  if (type === "individual") {
    // Title Section
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Personal Income Tax Report (PAYE)", 20, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Report Generated: ${new Date().toLocaleString('en-NG', { dateStyle: 'full', timeStyle: 'short' })}`, 20, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 15;
    
    addDivider();
    
    // Executive Summary
    addSectionHeader("Executive Summary");
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    const summaryBox: Array<{ label: string; value: string; highlight?: boolean }> = [
      { label: "Gross Annual Income", value: formatCurrency(data.annualGross) },
      { label: "Total Tax Reliefs", value: formatCurrency(data.totalReliefs) },
      { label: "Taxable Income", value: formatCurrency(data.taxableBase) },
      { label: "Annual Tax Payable", value: formatCurrency(data.annualTax), highlight: true },
      { label: "Monthly Tax Deduction", value: formatCurrency(data.annualTax / 12), highlight: true },
      { label: "Annual Take Home Pay", value: formatCurrency(data.netPay) }
    ];
    
    summaryBox.forEach((item, idx) => {
      if (item.highlight) {
        doc.setFillColor(0, 135, 81);
        doc.rect(20, yPos - 4, pageWidth - 40, 10, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
      }
      
      doc.text(item.label + ":", 25, yPos + 2);
      doc.text(item.value, pageWidth - 25, yPos + 2, { align: "right" });
      
      if (item.highlight) {
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
      }
      
      yPos += 10;
    });
    
    yPos += 5;
    addDivider();
    
    // Income Details
    addSectionHeader("1. Income Details");
    doc.setFontSize(10);
    doc.text("Your gross annual income before any deductions:", 25, yPos);
    yPos += 8;
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Gross Annual Income:", 30, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(formatCurrency(data.annualGross), pageWidth - 25, yPos, { align: "right" });
    yPos += 10;
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Monthly equivalent: ${formatCurrency(data.annualGross / 12)}`, 30, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 15;
    
    addDivider();
    
    // Tax Reliefs Breakdown
    addSectionHeader("2. Tax Reliefs & Allowances");
    doc.setFontSize(10);
    doc.text("The following reliefs reduce your taxable income:", 25, yPos);
    yPos += 10;
    
    const reliefs = [
      { name: "Pension Contribution (8%)", amount: data.pensionDed, desc: "Mandatory retirement savings" },
      { name: "National Housing Fund (NHF)", amount: data.nhfDed || 0, desc: "Optional housing contribution" },
      { name: "Rent Relief (Accommodation)", amount: data.rentRelief, desc: "Annual rent paid by employer" },
      { name: "Health Insurance Premium", amount: data.nhisDed || 0, desc: "Medical coverage costs" }
    ];
    
    reliefs.forEach((relief) => {
      checkNewPage(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(relief.name, 30, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(formatCurrency(relief.amount), pageWidth - 25, yPos, { align: "right" });
      yPos += 6;
      
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(relief.desc, 35, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 10;
    });
    
    // Total reliefs
    doc.setDrawColor(0, 135, 81);
    doc.setLineWidth(1);
    doc.line(30, yPos, pageWidth - 25, yPos);
    yPos += 8;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Total Tax Reliefs:", 30, yPos);
    doc.text(formatCurrency(data.totalReliefs), pageWidth - 25, yPos, { align: "right" });
    yPos += 15;
    
    addDivider();
    
    // Taxable Income Calculation
    addSectionHeader("3. Taxable Income Computation");
    checkNewPage(30);
    
    doc.setFontSize(10);
    doc.text("Gross Income:", 30, yPos);
    doc.text(formatCurrency(data.annualGross), pageWidth - 25, yPos, { align: "right" });
    yPos += 8;
    
    doc.text("Less: Total Reliefs:", 30, yPos);
    doc.text(`(${formatCurrency(data.totalReliefs)})`, pageWidth - 25, yPos, { align: "right" });
    yPos += 8;
    
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(30, yPos, pageWidth - 25, yPos);
    yPos += 8;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Taxable Income:", 30, yPos);
    doc.text(formatCurrency(data.taxableBase), pageWidth - 25, yPos, { align: "right" });
    doc.setFont("helvetica", "normal");
    yPos += 15;
    
    addDivider();
    
    // Tax Bands Breakdown
    addSectionHeader("4. Tax Calculation (2026 Tax Bands)");
    checkNewPage(80);
    
    doc.setFontSize(9);
    doc.text("Your tax is calculated using Nigeria's progressive tax bands:", 25, yPos);
    yPos += 10;
    
    // Use the actual band breakdown from the calculator if available
    const taxBands = data.bandBreakdown && data.bandBreakdown.length > 0 
      ? data.bandBreakdown.map((band: any) => ({
          range: band.label,
          rate: `${(band.rate * 100).toFixed(0)}%`,
          amount: band.tax
        }))
      : [
          { range: "First ₦800,000", rate: "0%", amount: Math.min(data.taxableBase, 800000) * 0 },
          { range: "Next ₦2,200,000", rate: "15%", amount: Math.max(0, Math.min(data.taxableBase - 800000, 2200000)) * 0.15 },
          { range: "Next ₦9,000,000", rate: "18%", amount: Math.max(0, Math.min(data.taxableBase - 3000000, 9000000)) * 0.18 },
          { range: "Next ₦13,000,000", rate: "21%", amount: Math.max(0, Math.min(data.taxableBase - 12000000, 13000000)) * 0.21 },
          { range: "Next ₦25,000,000", rate: "23%", amount: Math.max(0, Math.min(data.taxableBase - 25000000, 25000000)) * 0.23 },
          { range: "Above ₦50,000,000", rate: "25%", amount: Math.max(0, data.taxableBase - 50000000) * 0.25 }
        ].filter(band => band.amount > 0);
    
    // Table header
    doc.setFillColor(230, 230, 230);
    doc.rect(25, yPos - 4, pageWidth - 50, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Income Band", 30, yPos);
    doc.text("Rate", 100, yPos);
    doc.text("Tax Amount", pageWidth - 30, yPos, { align: "right" });
    yPos += 10;
    
    doc.setFont("helvetica", "normal");
    taxBands.forEach((band) => {
      if (band.amount > 0) {
        checkNewPage(8);
        doc.text(band.range, 30, yPos);
        doc.text(band.rate, 100, yPos);
        doc.text(formatCurrency(band.amount), pageWidth - 30, yPos, { align: "right" });
        yPos += 7;
      }
    });
    
    // Total tax line
    yPos += 3;
    doc.setDrawColor(0, 135, 81);
    doc.setLineWidth(1);
    doc.line(30, yPos, pageWidth - 30, yPos);
    yPos += 8;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Total Annual Tax:", 30, yPos);
    doc.text(formatCurrency(data.annualTax), pageWidth - 30, yPos, { align: "right" });
    yPos += 15;
    
    addDivider();
    
    // Monthly Breakdown
    addSectionHeader("5. Monthly Breakdown");
    checkNewPage(40);
    
    const monthlyBreakdown: Array<{ label: string; value: number; highlight?: boolean }> = [
      { label: "Gross Monthly Income", value: data.annualGross / 12 },
      { label: "Monthly Tax Deduction", value: data.annualTax / 12 },
      { label: "Monthly Take Home Pay", value: data.netPay / 12, highlight: true }
    ];
    
    doc.setFontSize(10);
    monthlyBreakdown.forEach((item) => {
      if (item.highlight) {
        doc.setFillColor(240, 253, 244);
        doc.rect(25, yPos - 4, pageWidth - 50, 10, "F");
        doc.setFont("helvetica", "bold");
      }
      
      doc.text(item.label + ":", 30, yPos + 2);
      doc.text(formatCurrency(item.value), pageWidth - 30, yPos + 2, { align: "right" });
      
      if (item.highlight) {
        doc.setFont("helvetica", "normal");
      }
      yPos += 10;
    });
    
    yPos += 10;
    addDivider();
    
    // Important Notes
    addSectionHeader("6. Important Notes");
    checkNewPage(50);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const notes = [
      "• PAYE must be remitted to FIRS by the 10th of the following month",
      "• Employers are responsible for deducting and remitting PAYE on behalf of employees",
      "• Annual tax returns must be filed by January 31st of the following year",
      "• Penalties apply for late remittance: 10% of unpaid tax + 5% interest per annum",
      "• Keep all payslips and tax certificates for at least 6 years",
      "• You may be eligible for additional reliefs - consult with a tax professional"
    ];
    
    notes.forEach((note) => {
      checkNewPage(8);
      const lines = doc.splitTextToSize(note, pageWidth - 60);
      doc.text(lines, 30, yPos);
      yPos += lines.length * 6;
    });
    
  } else {
    // Title Section
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Company Tax Report (CIT)", 20, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Report Generated: ${new Date().toLocaleString('en-NG', { dateStyle: 'full', timeStyle: 'short' })}`, 20, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 15;
    
    addDivider();
    
    // Executive Summary
    addSectionHeader("Executive Summary");
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    const companySummary: Array<{ label: string; value: string; highlight?: boolean }> = [
      { label: "Annual Turnover", value: formatCurrency(data.turnover) },
      { label: "Assessable Profit", value: formatCurrency(data.assessableProfit) },
      { label: "Company Category", value: data.isSmall ? "Small Company (Turnover < ₦100m)" : "Large/Medium Company" }
    ];
    
    if (!data.isSmall) {
      companySummary.push(
        { label: "Companies Income Tax (25%)", value: formatCurrency(data.cit) },
        { label: "Tertiary Education Tax (4%)", value: formatCurrency(data.devLevy) },
        { label: "Total Tax Payable", value: formatCurrency(data.totalTax), highlight: true }
      );
    } else {
      companySummary.push(
        { label: "Tax Status", value: "EXEMPT - Small Company Incentive", highlight: true }
      );
    }
    
    companySummary.forEach((item) => {
      if (item.highlight) {
        doc.setFillColor(0, 135, 81);
        doc.rect(20, yPos - 4, pageWidth - 40, 10, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
      }
      
      doc.text(item.label + ":", 25, yPos + 2);
      doc.text(item.value, pageWidth - 25, yPos + 2, { align: "right" });
      
      if (item.highlight) {
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
      }
      
      yPos += 10;
    });
    
    yPos += 5;
    addDivider();
    
    // Company Details
    addSectionHeader("1. Company Financial Information");
    doc.setFontSize(10);
    
    doc.text("Annual Turnover (Revenue):", 30, yPos);
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(data.turnover), pageWidth - 25, yPos, { align: "right" });
    doc.setFont("helvetica", "normal");
    yPos += 10;
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Total revenue generated from all business activities during the year", 35, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 12;
    
    doc.setFontSize(10);
    doc.text("Assessable Profit:", 30, yPos);
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(data.assessableProfit), pageWidth - 25, yPos, { align: "right" });
    doc.setFont("helvetica", "normal");
    yPos += 10;
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Profit after deducting allowable expenses and capital allowances", 35, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 15;
    
    addDivider();
    
    if (data.isSmall) {
      // Small Company Exemption Details
      addSectionHeader("2. Small Company Tax Exemption");
      checkNewPage(60);
      
      doc.setFillColor(240, 253, 244);
      doc.rect(20, yPos - 5, pageWidth - 40, 50, "F");
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 135, 81);
      doc.text("✓ TAX EXEMPT", 30, yPos + 10);
      doc.setTextColor(0, 0, 0);
      yPos += 20;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Your company qualifies for small company tax exemption under", 30, yPos);
      yPos += 7;
      doc.text("the Nigeria Tax Act 2025.", 30, yPos);
      yPos += 55;
      
      addSectionHeader("Small Company Benefits");
      checkNewPage(40);
      
      doc.setFontSize(9);
      const benefits = [
        "✓ Zero Companies Income Tax (CIT) - 0% tax rate",
        "✓ Exemption from Tertiary Education Tax (TET)",
        "✓ Reduced compliance requirements",
        "✓ Qualification criteria: Annual turnover below ₦100,000,000"
      ];
      
      benefits.forEach((benefit) => {
        doc.text(benefit, 30, yPos);
        yPos += 8;
      });
      
      yPos += 10;
      addDivider();
      
      addSectionHeader("Important Compliance Notes");
      checkNewPage(50);
      
      doc.setFontSize(9);
      const complianceNotes = [
        "• File annual tax returns by March 31st, even if exempt from tax",
        "• Maintain proper accounting records and financial statements",
        "• If turnover exceeds ₦100m, notify FIRS immediately",
        "• Exemption is reviewed annually based on prior year turnover",
        "• Company must still comply with VAT and WHT obligations",
        "• Keep supporting documents for at least 6 years"
      ];
      
      complianceNotes.forEach((note) => {
        checkNewPage(8);
        const lines = doc.splitTextToSize(note, pageWidth - 60);
        doc.text(lines, 30, yPos);
        yPos += lines.length * 6;
      });
      
    } else {
      // Tax Calculation for Large/Medium Companies
      addSectionHeader("2. Tax Calculation Breakdown");
      checkNewPage(60);
      
      doc.setFontSize(10);
      doc.text("Based on Assessable Profit:", 30, yPos);
      doc.setFont("helvetica", "bold");
      doc.text(formatCurrency(data.assessableProfit), pageWidth - 25, yPos, { align: "right" });
      doc.setFont("helvetica", "normal");
      yPos += 15;
      
      // CIT Details
      doc.setFillColor(245, 245, 245);
      doc.rect(25, yPos - 4, pageWidth - 50, 25, "F");
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Companies Income Tax (CIT)", 30, yPos + 3);
      doc.setFont("helvetica", "normal");
      yPos += 10;
      
      doc.setFontSize(9);
      doc.text("Rate: 25% of assessable profit", 30, yPos);
      yPos += 7;
      doc.text("Calculation: " + formatCurrency(data.assessableProfit) + " × 25%", 30, yPos);
      yPos += 7;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Amount:", 30, yPos);
      doc.text(formatCurrency(data.cit), pageWidth - 30, yPos, { align: "right" });
      doc.setFont("helvetica", "normal");
      yPos += 20;
      
      // TET Details
      doc.setFillColor(245, 245, 245);
      doc.rect(25, yPos - 4, pageWidth - 50, 25, "F");
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Tertiary Education Tax (TET)", 30, yPos + 3);
      doc.setFont("helvetica", "normal");
      yPos += 10;
      
      doc.setFontSize(9);
      doc.text("Rate: 4% of assessable profit", 30, yPos);
      yPos += 7;
      doc.text("Calculation: " + formatCurrency(data.assessableProfit) + " × 4%", 30, yPos);
      yPos += 7;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Amount:", 30, yPos);
      doc.text(formatCurrency(data.devLevy), pageWidth - 30, yPos, { align: "right" });
      doc.setFont("helvetica", "normal");
      yPos += 20;
      
      // Total
      doc.setDrawColor(0, 135, 81);
      doc.setLineWidth(1.5);
      doc.line(25, yPos, pageWidth - 25, yPos);
      yPos += 10;
      
      doc.setFillColor(0, 135, 81);
      doc.rect(25, yPos - 5, pageWidth - 50, 15, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("TOTAL TAX PAYABLE:", 30, yPos + 5);
      doc.text(formatCurrency(data.totalTax), pageWidth - 30, yPos + 5, { align: "right" });
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      yPos += 25;
      
      addDivider();
      
      // Payment Schedule
      addSectionHeader("3. Payment Schedule & Deadlines");
      checkNewPage(50);
      
      doc.setFontSize(9);
      doc.text("Company tax is payable in installments throughout the year:", 25, yPos);
      yPos += 12;
      
      const paymentSchedule = [
        { period: "1st Installment", date: "Within 6 months of accounting period", amount: data.totalTax * 0.5, desc: "50% of estimated tax" },
        { period: "2nd Installment", date: "Within 3 months after year-end", amount: data.totalTax * 0.5, desc: "Balance of tax due" }
      ];
      
      paymentSchedule.forEach((payment, idx) => {
        checkNewPage(25);
        doc.setFillColor(250, 250, 250);
        doc.rect(25, yPos - 4, pageWidth - 50, 20, "F");
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(payment.period, 30, yPos + 3);
        doc.text(formatCurrency(payment.amount), pageWidth - 30, yPos + 3, { align: "right" });
        yPos += 8;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text("Due: " + payment.date, 30, yPos + 2);
        yPos += 6;
        doc.setTextColor(100, 100, 100);
        doc.text(payment.desc, 30, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 12;
      });
      
      yPos += 5;
      addDivider();
      
      // Important Compliance Notes
      addSectionHeader("4. Compliance Requirements");
      checkNewPage(60);
      
      doc.setFontSize(9);
      const companyNotes = [
        "• File audited financial statements with annual returns by March 31st",
        "• Pay CIT in two installments: mid-year and final payment within 3 months of year-end",
        "• TET payment must accompany CIT remittance",
        "• Late payment penalty: 10% of unpaid tax plus 5% interest per annum",
        "• Companies must file quarterly returns even with nil activity",
        "• Maintain proper books of accounts and supporting documents for 6 years",
        "• Notify FIRS of any change in company structure or tax status",
        "• Capital allowances and other deductions must be properly documented"
      ];
      
      companyNotes.forEach((note) => {
        checkNewPage(8);
        const lines = doc.splitTextToSize(note, pageWidth - 60);
        doc.text(lines, 30, yPos);
        yPos += lines.length * 6;
      });
    }
  }
  
  // Add footer to last page
  addPageFooter();
  
  // Save
  const fileName = `Taxculator_${type}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(value);
};
