import type { PersonCoverageType } from '@/types/PersonCoverageType';

export type DataPersonCoverage = Pick<PersonCoverageType,
  | 'mirrorId'
  | 'personId'
  | 'modalityOfCoverage'
>;

export type ResponseCreatePersonCoverage = {
  data: PersonCoverageType
  update: typeof UpdatePersonCoverage
  delete: typeof DeletePersonCoverage
} | undefined

declare function CreatePersonCoverage(data: DataPersonCoverage): Promise<ResponseCreatePersonCoverage>
declare function SetPersonCoverage(data: ResponseCreatePersonCoverage): void
declare function UpdatePersonCoverage(newData: DataPersonCoverage): Promise<boolean>
declare function DeletePersonCoverage(): Promise<boolean>

declare function UpdatePeopleCoverage(id: string, newData: DataPersonCoverage): Promise<boolean>
declare function DeletePeopleCoverage(id: string): Promise<boolean>

export type FunctionCreatePersonCoverageTypeof = typeof CreatePersonCoverage;
export type FunctionSetPersonCoverageTypeof = typeof SetPersonCoverage;
export type FunctionUpdatePeopleCoverageTypeof = typeof UpdatePersonCoverage | undefined;
export type FunctionDeletePeopleCoverageTypeof = typeof DeletePersonCoverage | undefined;

export type FunctionUpdatePersonCoverageTypeof = typeof UpdatePeopleCoverage | undefined;
export type FunctionDeletePersonCoverageTypeof = typeof DeletePeopleCoverage | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;