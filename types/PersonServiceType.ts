import type { PersonType } from '@/types/PersonType';

export type DataPerson = Pick<PersonType,
  | 'matricule'
  | 'name'
  | 'cpf'
  | 'rg'
  | 'birthDate'
  | 'motherName'
  | 'mail'
  | 'phone'
  | 'addressId'
  | 'scaleId'
  | 'status'
>;

export type ResponseCreatePerson = {
  data: PersonType
  update: typeof UpdatePerson
  delete: typeof DeletePerson
} | undefined

declare function CreatePerson(data: DataPerson): Promise<ResponseCreatePerson>
declare function SetPerson(data: ResponseCreatePerson): void
declare function UpdatePerson(newData: DataPerson): Promise<boolean>
declare function DeletePerson(): Promise<boolean>

declare function UpdatePeople(id: string, newData: DataPerson): Promise<boolean>
declare function DeletePeople(id: string): Promise<boolean>

export type FunctionCreatePersonTypeof = typeof CreatePerson;
export type FunctionSetPersonTypeof = typeof SetPerson;
export type FunctionUpdatePersonTypeof = typeof UpdatePerson | undefined;
export type FunctionDeletePersonTypeof = typeof DeletePerson | undefined;

export type FunctionUpdatePeopleTypeof = typeof UpdatePeople | undefined;
export type FunctionDeletePeopleTypeof = typeof DeletePeople | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;