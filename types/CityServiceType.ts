import { CityType } from '@/types/CityType';

export type DataCity = Pick<CityType, 'value'>;

export type ResponseCreateCity = {
  data: CityType
  update: typeof UpdateCity
  delete: typeof DeleteCity
} | undefined

declare function CreateCity(data: DataCity): Promise<ResponseCreateCity>
declare function SetCity(data: ResponseCreateCity): void
declare function UpdateCity(newData: DataCity): Promise<boolean>
declare function DeleteCity(): Promise<boolean>

declare function UpdateCities(id: string, newData: DataCity): Promise<boolean>
declare function DeleteCities(id: string): Promise<boolean>

export type FunctionCreateCityTypeof = typeof CreateCity;
export type FunctionSetCityTypeof = typeof SetCity;
export type FunctionUpdateCityTypeof = typeof UpdateCity | undefined;
export type FunctionDeleteCityTypeof = typeof DeleteCity | undefined;

export type FunctionUpdateCitiesTypeof = typeof UpdateCities | undefined;
export type FunctionDeleteCitiesTypeof = typeof DeleteCities | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;