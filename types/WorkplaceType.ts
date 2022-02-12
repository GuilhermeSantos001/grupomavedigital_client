import { DatabaseStatusType } from './DatabaseStatusType';

export type WorkplaceType = {
    id: string
    cursorId: number
    name: string
    scaleId: string
    entryTime: string
    exitTime: string
    addressId: string
    status: DatabaseStatusType
    address: {
        street: {
            value: string
        }
        number: string
        complement: string
        neighborhood: {
            value: string
        }
        city: {
            value: string
        }
        district: {
            value: string
        }
        zipCode: string
    }
    scale: {
        value: string
    }
    workplaceService: {
        id: string
        service: {
            value: string
        }
    }[]
    createdAt: string
    updatedAt: string
}