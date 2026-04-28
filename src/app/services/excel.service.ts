import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  exportToExcel(data: any[], fileName: string, sheetName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    const workbook: XLSX.WorkBook = { 
      Sheets: { [sheetName]: worksheet }, 
      SheetNames: [sheetName] 
    };

    const columnWidths = Object.keys(data[0] || {}).map(key => ({
      wch: Math.max(key.length, ...data.map(obj => obj[key]?.toString().length || 0)) + 2
    }));
    worksheet['!cols'] = columnWidths;

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }
}