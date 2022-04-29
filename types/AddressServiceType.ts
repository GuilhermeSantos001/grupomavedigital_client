import { AddressType } from '@/types/AddressType';

export type DataAddress = Pick<AddressType,
  | 'streetId'
  | 'number'
  | 'complement'
  | 'neighborhoodId'
  | 'cityId'
  | 'districtId'
  | 'zipCode'
>;

export type ResponseCreateAddress = {
  data: AddressType
  update: typeof UpdateAddress
  delete: typeof DeleteAddress
} | undefined;

declare function CreateAddress(data: DataAddress): Promise<ResponseCreateAddress>
declare function SetAddress(data: ResponseCreateAddress): void
declare function UpdateAddress(newData: DataAddress): Promise<boolean>
declare function DeleteAddress(): Promise<boolean>

declare function UpdateAddresses(id: string, newData: DataAddress): Promise<boolean>
declare function DeleteAddresses(id: string): Promise<boolean>

export type FunctionCreateAddressTypeof = typeof CreateAddress;
export type FunctionSetAddressTypeof = typeof SetAddress;
export type FunctionUpdateAddressTypeof = typeof UpdateAddress | undefined;
export type FunctionDeleteAddressTypeof = typeof DeleteAddress | undefined;

export type FunctionUpdateAddressesTypeof = typeof UpdateAddresses | undefined;
export type FunctionDeleteAddressesTypeof = typeof DeleteAddresses | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;