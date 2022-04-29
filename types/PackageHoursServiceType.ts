import { PackageHoursType } from '@/types/PackageHoursType';

export type DataPackageHours = Pick<PackageHoursType,
  | 'author'
  | 'costCenterId'
  | 'periodStart'
  | 'periodEnd'
  | 'description'
  | 'personId'
  | 'workplacePHDestinationId'
  | 'contractStartedAt'
  | 'contractFinishAt'
  | 'entryTime'
  | 'exitTime'
  | 'valueClosed'
  | 'lawdays'
  | 'jobTitle'
  | 'onlyHistory'
  | 'paymentMethod'
  | 'paymentValue'
  | 'paymentDatePayable'
  | 'paymentStatus'
  | 'paymentDatePaid'
  | 'paymentDateCancelled'
  | 'status'
>;

export type ResponseCreatePackageHours = {
  data: PackageHoursType
  update: typeof UpdatePackageHours
  delete: typeof DeletePackageHours
} | undefined

declare function CreatePackageHours(data: DataPackageHours): Promise<ResponseCreatePackageHours>
declare function UpdatePackageHours(newData: DataPackageHours): Promise<boolean>
declare function DeletePackageHours(): Promise<boolean>

declare function UpdatePackageHoursAll(id: string, newData: DataPackageHours): Promise<boolean>
declare function DeletePackageHoursAll(id: string): Promise<boolean>

export type FunctionCreatePackageHoursTypeof = typeof CreatePackageHours;
export type FunctionUpdatePackageHoursTypeof = typeof UpdatePackageHours | undefined;
export type FunctionDeletePackageHoursTypeof = typeof DeletePackageHours | undefined;

export type FunctionUpdatePackageHoursAllTypeof = typeof UpdatePackageHoursAll | undefined;
export type FunctionDeletePackageHoursAllTypeof = typeof DeletePackageHoursAll | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;