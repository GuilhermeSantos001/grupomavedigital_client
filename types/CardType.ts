import { DatabaseStatusType } from './DatabaseStatusType';

export type CardType = {
  id: string
  cursorId: number
  costCenterId: string
  serialNumber: string
  lastCardNumber: string
  personId: string
  status: DatabaseStatusType
  createdAt: Date
  updatedAt: Date
  costCenter: {
    value: string
  }
  person: {
    matricule: string
    name: string
  }
}