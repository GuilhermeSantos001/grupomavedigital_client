import { DatabaseStatusType } from './DatabaseStatusType';

export type PersonType = {
    id: string
    cursorId: number
    matricule: string
    name: string
    cpf: string
    rg: string
    motherName: string
    birthDate: Date
    phone: string
    mail: string
    addressId: string
    scaleId: string
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
    personService: {
        id: string
        service: {
            value: string
        }
    }
    cards: {
        lotNum: string
        serialNumber: string
        lastCardNumber: string
        costCenter: {
            value: string
        }
    }[]
    createdAt: Date
    updatedAt: Date
}