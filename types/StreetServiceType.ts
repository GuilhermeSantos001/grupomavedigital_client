import type { StreetType } from '@/types/StreetType';

export type DataStreet = Pick<StreetType, 'value'>;

export type ResponseCreateStreet = {
  data: StreetType
  update: typeof UpdateStreet
  delete: typeof DeleteStreet
} | undefined

declare function CreateStreet(data: DataStreet): Promise<ResponseCreateStreet>
declare function SetCostCenter(data: ResponseCreateStreet): void
declare function UpdateStreet(newData: DataStreet): Promise<boolean>
declare function DeleteStreet(): Promise<boolean>

declare function UpdateStreets(id: string, newData: DataStreet): Promise<boolean>
declare function DeleteStreets(id: string): Promise<boolean>

export type FunctionCreateStreetTypeof = typeof CreateStreet
export type FunctionSetStreetTypeof = typeof SetCostCenter
export type FunctionUpdateStreetTypeof = typeof UpdateStreet | undefined
export type FunctionDeleteStreetTypeof = typeof DeleteStreet | undefined

export type FunctionUpdateStreetsTypeof = typeof UpdateStreets | undefined
export type FunctionDeleteStreetsTypeof = typeof DeleteStreets | undefined
export type FunctionNextPageTypeof = (() => void) | undefined
export type FunctionPreviousPageTypeof = (() => void) | undefined