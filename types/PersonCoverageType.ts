import { DatabaseModalityOfCoveringType } from '@/types/DatabaseModalityOfCoveringType'
import { UploadType } from '@/types/UploadType'
import {PersonType} from '@/types/PersonType'

export type PersonCoverageType = {
  id: string
  cursorId: number
  mirrorId: string
  personId: string
  modalityOfCoverage: DatabaseModalityOfCoveringType
  mirror: UploadType
  person: Pick<PersonType, 'matricule' | 'name' | 'mail' | 'cards'>
  reasonForAbsence: {
    value: string
  }
  createdAt: string
  updatedAt: string
}