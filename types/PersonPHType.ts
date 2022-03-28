import type { PersonType } from '@/types/PersonType';

export type PersonPHType = {
  id: string
  cursorId: number
  personId: string
  createdAt: string
  updatedAt: string
  person: PersonType
}