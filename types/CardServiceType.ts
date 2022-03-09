import { CardType } from '@/types/CardType';

export type DataCard = Pick<CardType,
  | 'costCenterId'
  | 'lotNum'
  | 'serialNumber'
  | 'lastCardNumber'
  | 'status'
>;

export type DataPersonId = Pick<CardType, 'personId'>;

export type ResponseCreateCard = {
  data: CardType
  update: typeof UpdateCard
  assignPersonCard: typeof AssignPersonCard
  unassignPersonCard: typeof UnassignPersonCard
  delete: typeof DeleteCard
} | undefined

declare function CreateCard(data: DataCard): Promise<ResponseCreateCard>
declare function SetCard(data: ResponseCreateCard): void
declare function UpdateCard(newData: DataCard): Promise<boolean>
declare function AssignPersonCard(data: DataPersonId): Promise<boolean>
declare function UnassignPersonCard(): Promise<boolean>
declare function DeleteCard(): Promise<boolean>

declare function UpdateCards(id: string, newData: DataCard): Promise<boolean>
declare function AssignPeopleCard(id: string, dataPersonId: DataPersonId[]): Promise<void>
declare function UnassignPeopleCard(id: string[]): Promise<void>
declare function DeleteCards(id: string): Promise<boolean>

export type FunctionCreateCardTypeof = typeof CreateCard;
export type FunctionSetCardTypeof = typeof SetCard;
export type FunctionUpdateCardTypeof = typeof UpdateCard | undefined;
export type FunctionAssignPersonCardTypeof = typeof AssignPersonCard | undefined;
export type FunctionUnassignPersonCardTypeof = typeof UnassignPersonCard | undefined;
export type FunctionDeleteCardTypeof = typeof DeleteCard | undefined;

export type FunctionUpdateCardsTypeof = typeof UpdateCards | undefined;
export type FunctionAssignPeopleCardTypeof = typeof AssignPeopleCard | undefined;
export type FunctionUnassignPeopleCardTypeof = typeof UnassignPeopleCard | undefined;
export type FunctionDeleteCardsTypeof = typeof DeleteCards | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;