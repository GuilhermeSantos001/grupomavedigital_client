import type { DatabaseStatusType } from '@/types/DatabaseStatusType'

import type { ServiceType } from '@/types/ServiceType'

import type { AddressType } from '@/types/AddressType';
import type { ScaleType } from '@/types/ScaleType'

export type WorkplaceServiceType = {
    id: string
    workplaceId: string
    workplace: WorkplaceType
    serviceId: string
    service: ServiceType
}

export type WorkplaceType = {
    id: string
    cursorId: number
    name: string
    scaleId: string
    entryTime: string
    exitTime: string
    addressId: string
    status: DatabaseStatusType
    address: AddressType
    scale: ScaleType
    workplaceService: WorkplaceServiceType[]
    createdAt: string
    updatedAt: string
}