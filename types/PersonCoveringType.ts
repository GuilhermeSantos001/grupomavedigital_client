import { UploadType } from '@/types/UploadType'
import {PersonType} from '@/types/PersonType'

export type PersonCoveringType = {
  id: string
  cursorId: number
  mirrorId: string
  personId: string
  reasonForAbsenceId: string
  mirror: UploadType
  person: Pick<PersonType, 'matricule' | 'name' | 'mail' | 'cards'>
  reasonForAbsence: {
    value: string
  }
  createdAt: string
  updatedAt: string
}