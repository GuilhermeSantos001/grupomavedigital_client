import { DistrictType } from '@/types/DistrictType';

export type DataDistrict = Pick<DistrictType, 'value'>;

export type ResponseCreateDistrict = {
  data: DistrictType
  update: typeof UpdateDistrict
  delete: typeof DeleteDistrict
} | undefined

declare function CreateDistrict(data: DataDistrict): Promise<ResponseCreateDistrict>
declare function SetDistrict(data: ResponseCreateDistrict): void
declare function UpdateDistrict(newData: DataDistrict): Promise<boolean>
declare function DeleteDistrict(): Promise<boolean>

declare function UpdateDistricts(id: string, newData: DataDistrict): Promise<boolean>
declare function DeleteDistricts(id: string): Promise<boolean>

export type FunctionCreateDistrictTypeof = typeof CreateDistrict;
export type FunctionSetDistrictTypeof = typeof SetDistrict;
export type FunctionUpdateDistrictTypeof = typeof UpdateDistrict | undefined;
export type FunctionDeleteDistrictTypeof = typeof DeleteDistrict | undefined;

export type FunctionUpdateDistrictsTypeof = typeof UpdateDistricts | undefined;
export type FunctionDeleteDistrictsTypeof = typeof DeleteDistricts | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;