import { CostCenterType } from "@/types/CostCenterType";

export type DataCostCenter = Pick<CostCenterType, 'value'>;

export type ResponseCreateCostCenter = {
  data: CostCenterType
  update: typeof UpdateCostCenter
  delete: typeof DeleteCostCenter
} | undefined

declare function CreateCostCenter(data: DataCostCenter): Promise<ResponseCreateCostCenter>
declare function SetCostCenter(data: ResponseCreateCostCenter): void
declare function UpdateCostCenter(newData: DataCostCenter): Promise<boolean>
declare function DeleteCostCenter(): Promise<boolean>

declare function UpdateCostCenters(id: string, newData: DataCostCenter): Promise<boolean>
declare function DeleteCostCenters(id: string): Promise<boolean>

export type FunctionCreateCostCenterTypeof = typeof CreateCostCenter;
export type FunctionSetCostCenterTypeof = typeof SetCostCenter;
export type FunctionUpdateCostCenterTypeof = typeof UpdateCostCenter | undefined;
export type FunctionDeleteCostCenterTypeof = typeof DeleteCostCenter | undefined;

export type FunctionUpdateCostCentersTypeof = typeof UpdateCostCenters | undefined;
export type FunctionDeleteCostCentersTypeof = typeof DeleteCostCenters | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;