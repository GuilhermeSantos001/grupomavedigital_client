import type { ScaleType } from '@/types/ScaleType';

export type DataScale = Pick<ScaleType, 'value'>;

export type ResponseCreateScale = {
  data: ScaleType
  update: typeof UpdateScale
  delete: typeof DeleteScale
} | undefined

declare function CreateScale(data: DataScale): Promise<ResponseCreateScale>
declare function SetScale(data: ResponseCreateScale): void
declare function UpdateScale(newData: DataScale): Promise<boolean>
declare function DeleteScale(): Promise<boolean>

declare function UpdateScales(id: string, newData: DataScale): Promise<boolean>
declare function DeleteScales(id: string): Promise<boolean>

export type FunctionCreateScaleTypeof = typeof CreateScale;
export type FunctionSetScaleTypeof = typeof SetScale;
export type FunctionUpdateScaleTypeof = typeof UpdateScale | undefined;
export type FunctionDeleteScaleTypeof = typeof DeleteScale | undefined;

export type FunctionUpdateScalesTypeof = typeof UpdateScales | undefined;
export type FunctionDeleteScalesTypeof = typeof DeleteScales | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;