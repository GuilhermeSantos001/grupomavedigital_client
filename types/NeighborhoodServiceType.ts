import { NeighborhoodType } from '@/types/NeighborhoodType';

export type DataNeighborhood = Pick<NeighborhoodType, 'value'>;

export type ResponseCreateNeighborhood = {
  data: NeighborhoodType
  update: typeof UpdateNeighborhood
  delete: typeof DeleteNeighborhood
} | undefined

declare function CreateNeighborhood(data: DataNeighborhood): Promise<ResponseCreateNeighborhood>
declare function SetNeighborhood(data: ResponseCreateNeighborhood): void
declare function UpdateNeighborhood(newData: DataNeighborhood): Promise<boolean>
declare function DeleteNeighborhood(): Promise<boolean>

declare function UpdateNeighborhoods(id: string, newData: DataNeighborhood): Promise<boolean>
declare function DeleteNeighborhoods(id: string): Promise<boolean>

export type FunctionCreateNeighborhoodTypeof = typeof CreateNeighborhood;
export type FunctionSetNeighborhoodTypeof = typeof SetNeighborhood;
export type FunctionUpdateNeighborhoodTypeof = typeof UpdateNeighborhood | undefined;
export type FunctionDeleteNeighborhoodTypeof = typeof DeleteNeighborhood | undefined;

export type FunctionUpdateNeighborhoodsTypeof = typeof UpdateNeighborhoods | undefined;
export type FunctionDeleteNeighborhoodsTypeof = typeof DeleteNeighborhoods | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;