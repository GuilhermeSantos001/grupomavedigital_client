import type { DatabaseStatusType } from '@/types/DatabaseStatusType'
import type { DatabasePaymentMethodType } from '@/types/DatabasePaymentMethodType'
import type { DatabasePaymentStatusType } from '@/types/DatabasePaymentStatusType'
import type { PersonCoveringType } from '@/types/PersonCoveringType'
import type { PersonCoverageType } from '@/types/PersonCoverageType'
import type { WorkplaceType } from '@/types/WorkplaceType'
import type { CostCenterType } from '@/types/CostCenterType'

export type PostingModality = '' | 'absence_person' | 'lack_people';

export type PostingType = {
    id: string
    cursorId: number
    author: string
    costCenterId: string
    periodStart: string
    periodEnd: string
    originDate: string
    description?: string
    coveringId?: string
    coverageId: string
    coveringWorkplaceId: string
    coverageWorkplaceId?: string
    paymentMethod: DatabasePaymentMethodType
    paymentValue: number
    paymentDatePayable: string
    paymentStatus: DatabasePaymentStatusType
    paymentDatePaid?: string
    paymentDateCancelled?: string
    foremanApproval?: boolean
    managerApproval?: boolean
    status: DatabaseStatusType
    costCenter: CostCenterType
    covering?: PersonCoveringType
    coverage: PersonCoverageType
    coveringWorkplace: WorkplaceType
    coverageWorkplace?: WorkplaceType
    createdAt: string
    updatedAt: string
}