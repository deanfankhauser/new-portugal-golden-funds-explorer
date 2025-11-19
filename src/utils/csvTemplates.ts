/**
 * Utility functions for generating CSV templates for historical performance data
 */

export const generatePerformanceCSVTemplate = (): string => {
  const headers = ['Date', 'Returns', 'AUM', 'NAV'];
  const exampleRows = [
    ['2024-01', '2.5', '50.0', '1.025'],
    ['2024-02', '1.8', '52.3', '1.043'],
    ['2024-03', '-0.5', '51.8', '1.038'],
  ];

  const csvContent = [
    headers.join(','),
    ...exampleRows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};

export const downloadCSVTemplate = () => {
  const csvContent = generatePerformanceCSVTemplate();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'historical_performance_template.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
