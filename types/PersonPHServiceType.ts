import { PersonPHType } from '@/types/PersonPHType';

export type DataPersonPH = Pick<PersonPHType,
  | 'personId'
>;

export type ResponseCreatePersonPH = {
  data: PersonPHType
  update: typeof UpdatePersonPH
  delete: typeof DeletePersonPH
} | undefined

declare function CreatePersonPH(data: DataPersonPH): Promise<ResponseCreatePersonPH>
declare function UpdatePersonPH(newData: DataPersonPH): Promise<boolean>
declare function DeletePersonPH(): Promise<boolean>

declare function UpdatePeoplePH(id: string, newData: DataPersonPH): Promise<boolean>
declare function DeletePeoplePH(id: string): Promise<boolean>

export type FunctionCreatePersonPHTypeof = typeof CreatePersonPH;
export type FunctionUpdatePersonPHTypeof = typeof UpdatePersonPH | undefined;
export type FunctionDeletePersonPHTypeof = typeof DeletePersonPH | undefined;

export type FunctionUpdatePeoplePHTypeof = typeof UpdatePeoplePH | undefined;
export type FunctionDeletePeoplePHTypeof = typeof DeletePeoplePH | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;