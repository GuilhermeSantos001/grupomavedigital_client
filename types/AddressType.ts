import type { StreetType } from '@/types/StreetType'
import type { NeighborhoodType } from '@/types/NeighborhoodType'
import type { CityType } from '@/types/CityType'
import type { DistrictType } from '@/types/DistrictType'

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
    street: StreetType
    neighborhood: NeighborhoodType
    city: CityType
    district: DistrictType
    createdAt: string
    updatedAt: string
}