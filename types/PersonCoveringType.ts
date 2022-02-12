import { UploadType } from '@/types/UploadType'
import { CardType } from '@/types/CardType'

export type PersonCoveringType = {
  id: string
  cursorId: number
  mirrorId: string
  personId: string
  reasonForAbsenceId: string
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