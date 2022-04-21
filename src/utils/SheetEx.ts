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

export async function SheetCSV<Row>(rows: Row[], options: Options) {
  const
    workbook = XLSX.utils.book_new(),
    worksheet = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(workbook, worksheet, options.worksheetName);
  XLSX.utils.sheet_add_aoa(worksheet, [options.columnNames], { origin: "A1" });

  return XLSX.utils.sheet_to_csv(worksheet, { FS: ';', RS: '\n' });
}

export type LayoutUnlockAlelo = {
  serialNumber: string
  cpf: string
}

export const layoutUnlockAleloColumnNames = [
  'Número de Série',
  'CPF',
]

export type LayoutAssignAlelo = {
  serialNumber: string
  name: string
  birthDate: string
  cpf: string
  matricule: string
  mail: string
  motherName: string
  ddd_phone: string
  phone: string
  ddd_cellphone: string
  cellphone: string
  costCenterCode: string
}

export const layoutAssignAleloColumnNames = [
  'Número de Série',
  'Nome Completo',
  'Data de Nascimento',
  'CPF',
  'Matrícula',
  'E-mail',
  'Nome da Mãe',
  'DDD Telefone Fixo',
  'Telefone Fixo',
  'DDD Telefone Celular',
  'Telefone Celular',
  'Centro de Custo',
]

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
  'Observacao',
]

export type LayoutCashierPay = {
  period: string
  item: number
  costCenter: string
  originDate: string
  matricule: string
  personCoverage: string
  reasonForAbsence: string
  workplaceCoverage: string
  paymentValue: string
}

export const layoutCashierPayColumnNames = [
  'Período de Apuração',
  'Item',
  'Filial',
  'Data de Origem',
  'RE',
  'Funcionário de Cobertura',
  'Motivo',
  'Posto de Cobertura',
  'Valor'
]