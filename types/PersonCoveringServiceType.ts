import { PersonCoveringType } from '@/types/PersonCoveringType'

export type DataPersonCovering = Pick<PersonCoveringType,
  | 'mirrorId'
  | 'personId'
  | 'reasonForAbsenceId'
>;

export type ResponseCreatePersonCovering = {
  data: PersonCoveringType
  update: typeof UpdatePersonCovering
  delete: typeof DeletePersonCovering
} | undefined

declare function CreatePersonCovering(data: DataPersonCovering): Promise<ResponseCreatePersonCovering>
declare function SetPersonCovering(data: ResponseCreatePersonCovering): void
declare function UpdatePersonCovering(newData: DataPersonCovering): Promise<boolean>
declare function DeletePersonCovering(): Promise<boolean>

declare function UpdatePeopleCovering(id: string, newData: DataPersonCovering): Promise<boolean>
declare function DeletePeopleCovering(id: string): Promise<boolean>

export type FunctionCreatePersonCoveringTypeof = typeof CreatePersonCovering;
export type FunctionSetPersonCoveringTypeof = typeof SetPersonCovering;
export type FunctionUpdatePersonCoveringTypeof = typeof UpdatePersonCovering | undefined;
export type FunctionDeletePersonCoveringTypeof = typeof DeletePersonCovering | undefined;

export type FunctionUpdatePeopleCoveringTypeof = typeof UpdatePeopleCovering | undefined;
export type FunctionDeletePeopleCoveringTypeof = typeof DeletePeopleCovering | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;