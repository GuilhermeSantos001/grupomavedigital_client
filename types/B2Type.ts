import type { DatabaseStatusType } from '@/types/DatabaseStatusType';
import type { DatabasePaymentMethodType } from '@/types/DatabasePaymentMethodType';
import type { DatabasePaymentStatusType } from '@/types/DatabasePaymentStatusType';

import type { CostCenterType } from '@/types/CostCenterType';
import type { PersonB2Type } from '@/types/PersonB2Type';
import type { WorkplaceType } from './WorkplaceType';

export type RoleGratification = 'VIGILANTE' | 'PORTEIRO';

export type B2Type = {
  id: string
  cursorId: number
  author: string
  costCenterId: string
  periodStart: string
  periodEnd: string
  description?: string
  personId: string
  workplaceOriginId: string
  workplaceDestinationId: string
  coverageStartedAt: string
  entryTime: string
  exitTime: string
  valueClosed: number
  absences: number
  lawdays: number
  discountValue: number
  level: number
  roleGratification: RoleGratification
  gratification: number
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
  personB2: PersonB2Type
  workplaceOrigin: WorkplaceType
  workplaceDestination: WorkplaceType
}