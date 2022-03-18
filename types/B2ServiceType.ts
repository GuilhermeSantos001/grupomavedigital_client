import { B2Type } from '@/types/B2Type';

export type DataB2 = Pick<B2Type,
  | 'author'
  | 'costCenterId'
  | 'periodStart'
  | 'periodEnd'
  | 'description'
  | 'personId'
  | 'workplaceOriginId'
  | 'workplaceDestinationId'
  | 'coverageStartedAt'
  | 'entryTime'
  | 'exitTime'
  | 'valueClosed'
  | 'absences'
  | 'lawdays'
  | 'discountValue'
  | 'level'
  | 'roleGratification'
  | 'gratification'
  | 'paymentMethod'
  | 'paymentValue'
  | 'paymentDatePayable'
  | 'paymentStatus'
  | 'status'
>;

export type ResponseCreateB2 = {
  data: B2Type
  update: typeof UpdateB2
  delete: typeof DeleteB2
} | undefined

declare function CreateB2(data: DataB2): Promise<ResponseCreateB2>
declare function UpdateB2(newData: DataB2): Promise<boolean>
declare function DeleteB2(): Promise<boolean>

declare function UpdateB2All(id: string, newData: DataB2): Promise<boolean>
declare function DeleteB2All(id: string): Promise<boolean>

export type FunctionCreateB2Typeof = typeof CreateB2;
export type FunctionUpdateB2Typeof = typeof UpdateB2 | undefined;
export type FunctionDeleteB2Typeof = typeof DeleteB2 | undefined;

export type FunctionUpdateB2AllTypeof = typeof UpdateB2All | undefined;
export type FunctionDeleteB2AllTypeof = typeof DeleteB2All | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;