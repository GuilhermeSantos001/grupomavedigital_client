import type { ReasonForAbsenceType } from '@/types/ReasonForAbsenceType'

export type DataReasonForAbsence = Pick<ReasonForAbsenceType, 'value'>;

export type ResponseCreateReasonForAbsence = {
  data: ReasonForAbsenceType
  update: typeof UpdateReasonForAbsence
  delete: typeof DeleteReasonForAbsence
} | undefined

declare function CreateReasonForAbsence(data: DataReasonForAbsence): Promise<ResponseCreateReasonForAbsence>
declare function SetReasonForAbsence(data: ResponseCreateReasonForAbsence): void
declare function UpdateReasonForAbsence(newData: DataReasonForAbsence): Promise<boolean>
declare function DeleteReasonForAbsence(): Promise<boolean>

declare function UpdateReasonForAbsences(id: string, newData: DataReasonForAbsence): Promise<boolean>
declare function DeleteReasonForAbsences(id: string): Promise<boolean>

export type FunctionCreateReasonForAbsenceTypeof = typeof CreateReasonForAbsence;
export type FunctionSetReasonForAbsenceTypeof = typeof SetReasonForAbsence;
export type FunctionUpdateReasonForAbsenceTypeof = typeof UpdateReasonForAbsence | undefined;
export type FunctionDeleteReasonForAbsenceTypeof = typeof DeleteReasonForAbsence | undefined;

export type FunctionUpdateReasonForAbsencesTypeof = typeof UpdateReasonForAbsences | undefined;
export type FunctionDeleteReasonForAbsencesTypeof = typeof DeleteReasonForAbsences | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;