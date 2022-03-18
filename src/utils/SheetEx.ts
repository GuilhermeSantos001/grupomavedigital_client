import * as XLSX from "xlsx";

declare type Options = {
  sheetName: string
  worksheetName: string
  columnNames: string[]
}

export async function SheetEx<Row>(rows: Row[], options: Options) {
  const
    workbook = XLSX.utils.book_new(),
    worksheet = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(workbook, worksheet, options.worksheetName);
  XLSX.utils.sheet_add_aoa(worksheet, [options.columnNames], { origin: "A1" });

  XLSX.writeFile(workbook, `${options.sheetName}.xlsx`);
}

export type LayoutPayAlelo = {
  serialNumber: string
  cpf: string
  value: string
  description?: string
}

export const layoutPayAleloColumnNames = [
  'Número de Série',
  'CPF',
  'Valor da Carga',
  'Observacao'
]