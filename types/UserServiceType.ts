import type { UserType } from '@/types/UserType';

export type DataUser = Pick<UserType,
  | 'authorization'
  | 'name'
  | 'surname'
  | 'username'
  | 'email'
  | 'cnpj'
  | 'location'
  | 'photoProfile'
  | 'privileges'
>;

export type DataUserWithPassword = DataUser & { password: string }

export type ResponseCreateUser = {
  data: UserType
  update: typeof UpdateUser
  delete: typeof DeleteUser
} | undefined

declare function CreateUser(data: DataUserWithPassword): Promise<ResponseCreateUser>
declare function SetUser(data: ResponseCreateUser): void
declare function UpdateUser(newData: DataUser): Promise<boolean>
declare function DeleteUser(): Promise<boolean>

declare function UpdateUsers(auth: string, newData: DataUser): Promise<boolean>
declare function DeleteUsers(auth: string): Promise<boolean>

export type FunctionCreateUserTypeof = typeof CreateUser;
export type FunctionSetUserTypeof = typeof SetUser;
export type FunctionUpdateUserTypeof = typeof UpdateUser | undefined;
export type FunctionDeleteUserTypeof = typeof DeleteUser | undefined;

export type FunctionUpdateUsersTypeof = typeof UpdateUsers | undefined;
export type FunctionDeleteUsersTypeof = typeof DeleteUsers | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;