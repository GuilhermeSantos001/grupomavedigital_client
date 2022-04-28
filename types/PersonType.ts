import type { DatabaseStatusType } from '@/types/DatabaseStatusType'

import type { ServiceType } from '@/types/ServiceType'
import type { AddressType } from '@/types/AddressType'
import type { ScaleType } from '@/types/ScaleType'
import type { CardType } from '@/types/CardType'

export type PersonService = {
    id: string
    personId: string
    person: PersonType
    serviceId: string
    service: ServiceType
}

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
    address: AddressType
    scale: ScaleType
    personService: PersonService[]
    cards: CardType[]
    createdAt: string
    updatedAt: string
}