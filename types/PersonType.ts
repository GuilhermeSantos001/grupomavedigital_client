import { DatabaseStatusType } from './DatabaseStatusType';

export type PersonType = {
    id: string
    cursorId: number
    matricule: string
    name: string
    cpf: string
    rg: string
    motherName: string
    birthDate: string
    phone: string
    mail: string
    addressId: string
    scaleId: string
    status: DatabaseStatusType
    address: {
        id: string
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
        id: string
        value: string
    }
    personService: {
        id: string
        service: {
            value: string
        }
    }[]
    cards: {
        id: string
        lotNum: string
        serialNumber: string
        lastCardNumber: string
        costCenter: {
            id: string
            value: string
        }
    }[]
    createdAt: string
    updatedAt: string
}