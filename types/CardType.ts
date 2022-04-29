import type { DatabaseStatusType } from '@/types/DatabaseStatusType';

import type { CostCenterType } from '@/types/CostCenterType';
import type { PersonType } from '@/types/PersonType';

export type CardType = {
  id: string
  cursorId: number
  costCenterId: string
  lotNum: string
  serialNumber: string
  lastCardNumber: string
  personId: string | null
  unlocked: boolean
  status: DatabaseStatusType
  createdAt: string
  updatedAt: string
  costCenter: CostCenterType
  person?: PersonType
}