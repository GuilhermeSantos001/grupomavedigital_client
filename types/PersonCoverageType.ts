import { DatabaseModalityOfCoveringType } from '@/types/DatabaseModalityOfCoveringType'
import { UploadType } from '@/types/UploadType'
import { CardType } from '@/types/CardType'

export type PersonCoverageType = {
  id: string
  cursorId: number
  mirrorId: string
  personId: string
  modalityOfCoverage: DatabaseModalityOfCoveringType
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