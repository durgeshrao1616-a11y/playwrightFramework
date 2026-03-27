import * as fs   from 'fs';
import * as path from 'path';
import ExcelJS   from 'exceljs';

/**
 * DataReader — Reads test data from JSON and Excel files.
 */
export class DataReader {

  // ════════════════════════════════════
  // JSON Reader
  // ════════════════════════════════════

  /**
   * Read JSON test data file.
   * @param filePath relative to project root or absolute
   */
  static readJson<T = any>(filePath: string): T {
    const fullPath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`JSON file not found: ${fullPath}`);
    }
    const raw = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(raw) as T;
  }

  /**
   * Read JSON and return data for a specific environment.
   */
  static readJsonForEnv<T = any>(filePath: string, env?: string): T {
    const data = this.readJson<Record<string, T>>(filePath);
    const targetEnv = env || process.env.ENV || 'qa';
    if (!data[targetEnv]) {
      throw new Error(`No data for env "${targetEnv}" in ${filePath}`);
    }
    return data[targetEnv];
  }

  // ════════════════════════════════════
  // Excel Reader
  // ════════════════════════════════════

  /**
   * Read Excel sheet and return rows as array of objects.
   * First row = headers, remaining rows = data.
   */
  static async readExcel(
    filePath: string,
    sheetName: string
  ): Promise<Record<string, string>[]> {
    const fullPath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Excel file not found: ${fullPath}`);
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(fullPath);

    const sheet = workbook.getWorksheet(sheetName);
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found in ${filePath}`);
    }

    const rows: Record<string, string>[] = [];
    const headers: string[] = [];

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        // Header row
        row.eachCell((cell) => {
          headers.push(String(cell.value ?? '').trim());
        });
      } else {
        // Data rows
        const rowData: Record<string, string> = {};
        row.eachCell((cell, colNumber) => {
          const header = headers[colNumber - 1];
          if (header) {
            rowData[header] = String(cell.value ?? '').trim();
          }
        });
        if (Object.keys(rowData).length > 0) {
          rows.push(rowData);
        }
      }
    });

    console.log(`📊 Read ${rows.length} rows from Excel: ${sheetName}`);
    return rows;
  }

  /**
   * Read Excel and return as Playwright DataProvider format.
   */
  static async readExcelAsDataProvider(
    filePath: string,
    sheetName: string
  ): Promise<Array<[string, Record<string, string>]>> {
    const rows = await this.readExcel(filePath, sheetName);
    return rows.map((row, i) => [`Row ${i + 1}`, row]);
  }
}
