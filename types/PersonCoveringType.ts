import type { UploadType } from '@/types/UploadType'
import type { PersonType } from '@/types/PersonType'
import type { ReasonForAbsenceType } from '@/types/ReasonForAbsenceType'

export type PersonCoveringType = {
  id: string
  cursorId: number
  mirrorId: string
  personId: string
  reasonForAbsenceId: string
  mirror: UploadType
  person: PersonType
  reasonForAbsence: ReasonForAbsenceType
  createdAt: string
  updatedAt: string
}