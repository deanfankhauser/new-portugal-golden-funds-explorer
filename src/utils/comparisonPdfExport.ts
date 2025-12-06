import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Fund } from '@/data/types/funds';
import { formatFundSize } from './fundSizeFormatters';
import { formatManagementFee, formatPerformanceFee } from './feeFormatters';

export const exportComparisonToPDF = (funds: Fund[]) => {
  const doc = new jsPDF('landscape', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Header
  doc.setFillColor(75, 15, 35); // Bordeaux color
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Portugal Golden Visa Fund Comparison', pageWidth / 2, 12, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, pageWidth / 2, 19, { align: 'center' });
  
  // Reset text color for content
  doc.setTextColor(0, 0, 0);
  
  let yPosition = 35;
  
  // Fund Names Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Comparing Funds:', 14, yPosition);
  yPosition += 7;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  funds.forEach((fund, index) => {
    doc.text(`${index + 1}. ${fund.name}`, 20, yPosition);
    yPosition += 5;
  });
  
  yPosition += 5;
  
  // Key Financial Metrics Table
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Financial Metrics', 14, yPosition);
  yPosition += 5;
  
  const financialRows = [
    ['Verification Status', ...funds.map(f => f.isVerified ? 'Verified ✓' : 'Not Verified')],
    ['Minimum Investment', ...funds.map(f => f.minimumInvestment ? `€${f.minimumInvestment.toLocaleString()}` : 'Not disclosed')],
    ['Target Return', ...funds.map(f => f.returnTarget || 'Not disclosed')],
    ['Fund Size (AUM)', ...funds.map(f => formatFundSize(f.fundSize))],
    ['Management Fee', ...funds.map(f => formatManagementFee(f.managementFee))],
    ['Performance Fee', ...funds.map(f => formatPerformanceFee(f.performanceFee))],
  ];
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Metric', ...funds.map((_, i) => `Fund ${i + 1}`)]],
    body: financialRows,
    theme: 'striped',
    headStyles: {
      fillColor: [75, 15, 35],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45 },
    },
    margin: { left: 14, right: 14 },
  });
  
  yPosition = (doc as any).lastAutoTable.finalY + 10;
  
  // Risk & Structure Table
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Risk & Structure', 14, yPosition);
  yPosition += 5;
  
  const riskRows = [
    ['Risk Band', ...funds.map(f => f.riskBand || 'Not specified')],
    ['Category', ...funds.map(f => f.category || 'Other')],
    ['Fund Manager', ...funds.map(f => f.managerName || 'Not disclosed')],
    ['Established', ...funds.map(f => f.established ? f.established.toString() : 'Not disclosed')],
    ['Location', ...funds.map(f => f.location || 'Not disclosed')],
    ['Regulated By', ...funds.map(f => f.regulatedBy || 'Not disclosed')],
  ];
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Criteria', ...funds.map((_, i) => `Fund ${i + 1}`)]],
    body: riskRows,
    theme: 'striped',
    headStyles: {
      fillColor: [75, 15, 35],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45 },
    },
    margin: { left: 14, right: 14 },
  });
  
  yPosition = (doc as any).lastAutoTable.finalY + 10;
  
  // Redemption Terms Table
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Liquidity & Redemption', 14, yPosition);
  yPosition += 5;
  
  const redemptionRows = [
    ['Distribution Frequency', ...funds.map(f => f.redemptionTerms?.frequency || 'Not disclosed')],
    ['Redemption Open', ...funds.map(f => f.redemptionTerms?.redemptionOpen ? 'Yes' : 'No')],
    ['Notice Period', ...funds.map(f => {
      const period = f.redemptionTerms?.noticePeriod;
      return period ? `${period} days` : 'Not disclosed';
    })],
    ['Minimum Holding Period', ...funds.map(f => {
      const period = f.redemptionTerms?.minimumHoldingPeriod;
      return period ? `${period} months` : 'Not disclosed';
    })],
  ];
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Term', ...funds.map((_, i) => `Fund ${i + 1}`)]],
    body: redemptionRows,
    theme: 'striped',
    headStyles: {
      fillColor: [75, 15, 35],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45 },
    },
    margin: { left: 14, right: 14 },
  });
  
  // Footer on every page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Movingto Funds | funds.movingto.com | Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    
    doc.setFontSize(7);
    doc.text(
      'This comparison is for informational purposes only. Please consult with a financial advisor before making investment decisions.',
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }
  
  // Generate filename with fund names
  const fundNames = funds.map(f => f.name.replace(/[^a-z0-9]/gi, '_').substring(0, 20)).join('_vs_');
  const filename = `fund_comparison_${fundNames}_${new Date().getTime()}.pdf`;
  
  doc.save(filename);
};
