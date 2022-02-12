import { DatabaseModalityOfCoverageType } from '@/types/DatabaseModalityOfCoverageType'
import { UploadType } from '@/types/UploadType'
import { CardType } from '@/types/CardType'

export type PersonCoverageType = {
  id: string
  cursorId: number
  mirrorId: string
  personId: string
  modalityOfCoverage: DatabaseModalityOfCoverageType
  mirror: UploadType
  person: {
    matricule: string
    name: string
    mail: string
    cards: CardType[]
  }
  reasonForAbsence: {
    value: string
  }
  createdAt: string
  updatedAt: string
}