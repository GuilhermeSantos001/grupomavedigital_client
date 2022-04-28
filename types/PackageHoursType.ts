import type { DatabaseStatusType } from '@/types/DatabaseStatusType';
import type { DatabasePaymentMethodType } from '@/types/DatabasePaymentMethodType';
import type { DatabasePaymentStatusType } from '@/types/DatabasePaymentStatusType';

import type { CostCenterType } from '@/types/CostCenterType';
import type { PersonPHType } from '@/types/PersonPHType';
import type { WorkplaceType } from './WorkplaceType';

export type PackageHoursType = {
  id: string
  cursorId: number
  author: string
  costCenterId: string
  periodStart: string
  periodEnd: string
  description?: string
  personId: string
  workplacePHDestinationId: string
  contractStartedAt: string
  contractFinishAt: string
  entryTime: string
  exitTime: string
  valueClosed: number
  jobTitle: string
  lawdays: number
  onlyHistory: boolean
  paymentMethod: DatabasePaymentMethodType
  paymentValue: number
  paymentDatePayable: string
  paymentStatus: DatabasePaymentStatusType
  paymentDatePaid?: string
  paymentDateCancelled?: string
  status: DatabaseStatusType
  createdAt: string
  updatedAt: string
  costCenter: CostCenterType
  personPH: PersonPHType
  workplaceDestination: WorkplaceType
}