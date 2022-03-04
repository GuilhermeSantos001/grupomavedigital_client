import { WorkplaceType } from '@/types/WorkplaceType';

export type DataWorkplace = Pick<WorkplaceType,
  | "name"
  | "scaleId"
  | "entryTime"
  | "exitTime"
  | "addressId"
  | "status"
>;

export type ResponseCreateWorkplace = {
  data: WorkplaceType
  update: typeof UpdateWorkplace
  delete: typeof DeleteWorkplace
} | undefined

declare function CreateWorkplace(data: DataWorkplace): Promise<ResponseCreateWorkplace>
declare function SetWorkplace(data: ResponseCreateWorkplace): void
declare function UpdateWorkplace(newData: DataWorkplace): Promise<boolean>
declare function DeleteWorkplace(): Promise<boolean>

declare function UpdateWorkplaces(id: string, newData: DataWorkplace): Promise<boolean>
declare function DeleteWorkplaces(id: string): Promise<boolean>

export type FunctionCreateWorkplaceTypeof = typeof CreateWorkplace;
export type FunctionSetWorkplaceTypeof = typeof SetWorkplace;
export type FunctionUpdateWorkplaceTypeof = typeof UpdateWorkplace | undefined;
export type FunctionDeleteWorkplaceTypeof = typeof DeleteWorkplace | undefined;

export type FunctionUpdateWorkplacesTypeof = typeof UpdateWorkplaces | undefined;
export type FunctionDeleteWorkplacesTypeof = typeof DeleteWorkplaces | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;