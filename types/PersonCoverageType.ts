import type { DatabaseModalityOfCoveringType } from '@/types/DatabaseModalityOfCoveringType'
import type { UploadType } from '@/types/UploadType'
import type { PersonType } from '@/types/PersonType'
import type { ReasonForAbsenceType } from '@/types/ReasonForAbsenceType'

export type PersonCoverageType = {
  id: string
  cursorId: number
  mirrorId: string
  personId: string
  modalityOfCoverage: DatabaseModalityOfCoveringType
  mirror: UploadType
  person: PersonType
  reasonForAbsence: ReasonForAbsenceType
  createdAt: string
  updatedAt: string
}