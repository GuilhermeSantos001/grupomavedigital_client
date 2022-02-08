export type AddressType = {
    id: string
    cursorId: number
    streetId: string
    number: string
    complement?: string
    neighborhoodId: string
    cityId: string
    districtId: string
    zipCode: string
    street: {
        value: string
    }
    neighborhood: {
        value: string
    }
    city: {
        value: string
    }
    district: {
        value: string
    }
    createdAt: Date
    updatedAt: Date
}