import * as XLSX from 'xlsx';

export function downloadRowsAsExcel(
  fileName: string,
  sheetName: string,
  rows: (string | number)[][],
) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
}
