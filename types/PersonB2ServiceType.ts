import { PersonB2Type } from '@/types/PersonB2Type';

export type DataPersonB2 = Pick<PersonB2Type,
  | 'personId'
>;

export type ResponseCreatePersonB2 = {
  data: PersonB2Type
  update: typeof UpdatePersonB2
  delete: typeof DeletePersonB2
} | undefined

declare function CreatePersonB2(data: DataPersonB2): Promise<ResponseCreatePersonB2>
declare function UpdatePersonB2(newData: DataPersonB2): Promise<boolean>
declare function DeletePersonB2(): Promise<boolean>

declare function UpdatePeopleB2(id: string, newData: DataPersonB2): Promise<boolean>
declare function DeletePeopleB2(id: string): Promise<boolean>

export type FunctionCreatePersonB2Typeof = typeof CreatePersonB2;
export type FunctionUpdatePersonB2Typeof = typeof UpdatePersonB2 | undefined;
export type FunctionDeletePersonB2Typeof = typeof DeletePersonB2 | undefined;

export type FunctionUpdatePeopleB2Typeof = typeof UpdatePeopleB2 | undefined;
export type FunctionDeletePeopleB2Typeof = typeof DeletePeopleB2 | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;