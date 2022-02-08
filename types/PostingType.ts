import { DatabaseStatusType } from './DatabaseStatusType'
import { DatabasePaymentMethodType } from './DatabasePaymentMethodType'
import {DatabasePaymentStatusType } from './DatabasePaymentStatusType'
import { PersonCoveringType } from './PersonCoveringType'
import { PersonCoverageType } from './PersonCoverageType'
import {WorkplaceType} from './WorkplaceType'

export type PostingType = {
    id: string
    cursorId: number
    author: string
    costCenterId: string
    periodStart: Date
    periodEnd: Date
    originDate: Date
    description?: string
    coveringId?: string
    coverageId: string
    coveringWorkplaceId: string
    coverageWorkplaceId?: string
    paymentMethod: DatabasePaymentMethodType
    paymentValue: number
    paymentDatePayable: Date
    paymentStatus: DatabasePaymentStatusType
    paymentDatePaid?: Date
    paymentDateCancelled?: Date
    foremanApproval?: boolean
    managerApproval?: boolean
    status: DatabaseStatusType
    costCenter: {
        value: string
    }
    covering?: PersonCoveringType
    coverage: PersonCoverageType
    coveringWorkplace: WorkplaceType
    coverageWorkplace?: WorkplaceType
    createdAt: Date
    updatedAt: Date
}