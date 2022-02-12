import { DatabaseStatusType } from './DatabaseStatusType';

export type CardType = {
  id: string
  cursorId: number
  costCenterId: string
  lotNum: string
  serialNumber: string
  lastCardNumber: string
  personId: string
  status: DatabaseStatusType
  createdAt: string
  updatedAt: string
  costCenter: {
    value: string
  }
  person: {
    matricule: string
    name: string
  }
}