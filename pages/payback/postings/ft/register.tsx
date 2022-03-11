import React, { useState } from 'react'

import { GetServerSidePropsContext } from 'next/types'

import { useGetUserInfoService } from '@/services/graphql/useGetUserInfoService'

import { compressToEncodedURIComponent } from 'lz-string'

import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import Button from '@mui/material/Button'

import NoPrivilege, { handleClickFunction } from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'

import { DatePicker } from '@/components/selects/DatePicker'
import { AssistantPostingsRegister } from '@/components/assistants/AssistantPostingsRegister'
import { AssistantCoverageDefine } from '@/components/assistants/AssistantCoverageDefine'
import { ListWithCheckboxMUI } from '@/components/lists/ListWithCheckboxMUI'
import { ListWorkplacesSelected } from '@/components/lists/ListWorkplacesSelected'
import { RegisterWorkplace } from '@/components/modals/RegisterWorkplace'
import { RegisterAddress } from '@/components/modals/RegisterAddress'
import { RegisterPeople } from '@/components/modals/RegisterPeople'
import { EditWorkplace } from '@/components/modals/EditWorkplace'
import { EditAddress } from '@/components/modals/EditAddress'
import { EditPeople } from '@/components/modals/EditPeople'
import { ListCoverageDefined } from '@/components/lists/ListCoverageDefined'
import { SelectAddress } from '@/components/selects/SelectAddress'

import { BoxError } from '@/components/utils/BoxError'

import { PageProps } from '@/pages/_app'
import { GetMenuMain } from '@/bin/GetMenuMain'
import { PrivilegesSystem } from '@/types/UserType'

import { SocketConnection } from '@/components/socket-io'
import {
  PaybackSocketEvents
} from '@/constants/socketEvents'
import {
  TYPEOF_EMITTER_PAYBACK_DELETE_MIRROR,
  TYPEOF_LISTENER_PAYBACK_DELETE_MIRROR,
} from '@/constants/SocketTypes'

import Alerting from '@/src/utils/alerting'
import StringEx from '@/src/utils/stringEx'
import DateEx from '@/src/utils/dateEx'

import getWorkPlaceForTable from '@/src/functions/getWorkPlaceForTable'
import getPeopleForTable from '@/src/functions/getPeopleForTable'

import type { CostCenterType } from '@/types/CostCenterType'
import type { WorkplaceType } from '@/types/WorkplaceType'
import type { AddressType } from '@/types/AddressType'
import type { StreetType } from '@/types/StreetType'
import type { CityType } from '@/types/CityType'
import type { NeighborhoodType } from '@/types/NeighborhoodType'
import type { DistrictType } from '@/types/DistrictType'
import type { PersonType } from '@/types/PersonType'
import type { PostingType } from '@/types/PostingType'
import type { ServiceType } from '@/types/ServiceType'
import type { CardType } from '@/types/CardType'
import type { ScaleType } from '@/types/ScaleType'
import type { UploadType } from '@/types/UploadType'

import { usePostingsService } from '@/services/usePostingsService'
import { usePeopleCoveringService } from '@/services/usePeopleCoveringService'
import { usePeopleCoverageService } from '@/services/usePeopleCoverageService'
import { useCostCentersService } from '@/services/useCostCentersService'
import { useWorkplaceService } from '@/services/useWorkplaceService'
import { useWorkplacesService } from '@/services/useWorkplacesService'
import { useAddressService } from '@/services/useAddressService'
import { useAddressesService } from '@/services/useAddressesService'
import { usePersonService } from '@/services/usePersonService'
import { usePeopleService } from '@/services/usePeopleService'
import { useServicesService } from '@/services/useServicesService'
import { useCardsService } from '@/services/useCardsService'
import { useUploadsService } from '@/services/useUploadsService'
import { useServiceService } from '@/services/useServiceService'
import { useScaleService } from '@/services/useScaleService'
import { useScalesService } from '@/services/useScalesService'
import { useStreetService } from '@/services/useStreetService'
import { useStreetsService } from '@/services/useStreetsService'
import { useCityService } from '@/services/useCityService'
import { useCitiesService } from '@/services/useCitiesService'
import { useNeighborhoodsService } from '@/services/useNeighborhoodsService'
import { useNeighborhoodService } from '@/services/useNeighborhoodService'
import { useDistrictService } from '@/services/useDistrictService'
import { useDistrictsService } from '@/services/useDistrictsService'
import { usePostingService } from '@/services/usePostingService'
import { useUploadService } from '@/services/useUploadService'
import { usePersonCoveringService } from '@/services/usePersonCoveringService'
import { usePersonCoverageService } from '@/services/usePersonCoverageService'
import { useReasonForAbsenceService } from '@/services/useReasonForAbsenceService'
import { useReasonForAbsenceWithIdService } from '@/services/useReasonForAbsenceWithIdService'
import { useReasonForAbsencesService } from '@/services/useReasonForAbsencesService'

import type {
  FunctionCreateWorkplaceTypeof,
  FunctionUpdateWorkplacesTypeof
} from '@/types/WorkplaceServiceType'

import type {
  FunctionCreateAddressTypeof,
  FunctionUpdateAddressesTypeof
} from '@/types/AddressServiceType';

import type {
  FunctionCreatePersonTypeof,
  FunctionUpdatePeopleTypeof
} from '@/types/PersonServiceType';

import type {
  DataAssignPerson,
  DataAssignWorkplace,
  FunctionCreateServiceTypeof,
  FunctionUpdateServicesTypeof,
  FunctionAssignPeopleServiceTypeof,
  FunctionAssignWorkplacesServiceTypeof,
  FunctionUnassignPeopleServiceTypeof,
  FunctionUnassignWorkplacesServiceTypeof,
  FunctionDeleteServicesTypeof
} from '@/types/ServiceServiceType';

import type {
  DataPersonId,
  FunctionAssignPeopleCardTypeof,
  FunctionUnassignPeopleCardTypeof
} from '@/types/CardServiceType';

import type {
  FunctionCreateScaleTypeof,
  FunctionUpdateScalesTypeof,
  FunctionDeleteScalesTypeof,
} from '@/types/ScaleServiceType'

import type {
  FunctionCreateStreetTypeof,
  FunctionUpdateStreetsTypeof,
  FunctionDeleteStreetsTypeof,
} from '@/types/StreetServiceType'

import type {
  FunctionCreateCityTypeof,
  FunctionUpdateCitiesTypeof,
  FunctionDeleteCitiesTypeof,
} from '@/types/CityServiceType'

import type {
  FunctionCreateNeighborhoodTypeof,
  FunctionUpdateNeighborhoodsTypeof,
  FunctionDeleteNeighborhoodsTypeof,
} from '@/types/NeighborhoodServiceType'

import type {
  FunctionCreateDistrictTypeof,
  FunctionUpdateDistrictsTypeof,
  FunctionDeleteDistrictsTypeof,
} from '@/types/DistrictServiceType'

import type {
  FunctionCreatePersonCoveringTypeof
} from '@/types/PersonCoveringServiceType'
import type {
  FunctionCreatePersonCoverageTypeof
} from '@/types/PersonCoverageServiceType'
import type {
  FunctionCreateReasonForAbsenceTypeof,
  FunctionUpdateReasonForAbsencesTypeof,
  FunctionDeleteReasonForAbsencesTypeof,
} from '@/types/ReasonForAbsenceServiceType'
import type {
  ReasonForAbsenceType
} from '@/types/ReasonForAbsenceType'
import type {
  FunctionCreatePostingTypeof
} from '@/types/PostingServiceType'

import type {
  FunctionCreateUploadTypeof,
  FunctionUpdateUploadsTypeof
} from '@/types/UploadServiceType'

const serverSideProps: PageProps = {
  title: 'Lançamentos/Cadastro',
  description: 'Cadastro de lançamentos operacionais',
  themeColor: '#004a6e',
  menu: GetMenuMain('mn-payback')
}

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const privileges: PrivilegesSystem[] = [
    'administrador',
    'ope_gerente',
    'ope_coordenador',
    'ope_mesa'
  ]

  return {
    props: {
      ...serverSideProps,
      privileges,
      auth: req.cookies.auth,
      getUserInfoAuthorization: process.env.GRAPHQL_AUTHORIZATION_GETUSERINFO!,
    },
  }
}

//  TODO: Implementar o esqueleto de loading da página
function compose_load() {
  return (
    <div>
      {/* Mobile */}
      <div className="d-block d-md-none">
        <div className="col-12">
          <div className="d-flex flex-column p-2">
            <div className="col-12">
              <SkeletonLoader
                width={'100%'}
                height={'5rem'}
                radius={10}
                circle={false}
              />
            </div>
            <div className="d-flex flex-row justify-content-center col-12 mt-4 mb-2">
              <SkeletonLoader
                width={'80%'}
                height={'1.5rem'}
                radius={0}
                circle={false}
              />
            </div>
            <div className="col-12 my-2">
              <SkeletonLoader
                width={'100%'}
                height={'3rem'}
                radius={5}
                circle={false}
              />
            </div>
            <div className="col-12 my-2">
              <SkeletonLoader
                width={'100%'}
                height={'3rem'}
                radius={5}
                circle={false}
              />
            </div>
            <div className="d-flex flex-row justify-content-center col-12 mt-2 mb-2">
              <SkeletonLoader
                width={'80%'}
                height={'1.5rem'}
                radius={0}
                circle={false}
              />
            </div>
            <div className="col-12 my-2">
              <SkeletonLoader
                width={'100%'}
                height={'3rem'}
                radius={5}
                circle={false}
              />
            </div>
            <div className="col-12 my-2">
              <SkeletonLoader
                width={'100%'}
                height={'3rem'}
                radius={5}
                circle={false}
              />
            </div>
            <div className="d-flex flex-row justify-content-center col-12 mt-2 mb-2">
              <SkeletonLoader
                width={'80%'}
                height={'1.5rem'}
                radius={0}
                circle={false}
              />
            </div>
            <div className="col-12 my-2">
              <SkeletonLoader
                width={'100%'}
                height={'3rem'}
                radius={5}
                circle={false}
              />
            </div>
            <div className="d-flex flex-row justify-content-center col-12 my-2">
              <SkeletonLoader
                width={'80%'}
                height={'3rem'}
                radius={10}
                circle={false}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Desktop */}
      <div className="d-none d-md-flex">
        <div className="col-12">
          <div className="row g-2">
            <div className="col-12">
              <div className="p-1">
                <SkeletonLoader
                  width={'100%'}
                  height={'5rem'}
                  radius={10}
                  circle={false}
                />
              </div>
            </div>
          </div>
          <div className="d-flex flex-row justify-content-center mt-2 p-2">
            <SkeletonLoader
              width={'50%'}
              height={'1.5rem'}
              radius={0}
              circle={false}
            />
          </div>
          <div className="col-12 p-2">
            <SkeletonLoader
              width={'100%'}
              height={'0.1rem'}
              radius={0}
              circle={false}
            />
          </div>
          <div className="row g-2">
            <div className="col-6">
              <div className="p-1">
                <SkeletonLoader
                  width={'100%'}
                  height={'3rem'}
                  radius={10}
                  circle={false}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="p-1">
                <SkeletonLoader
                  width={'100%'}
                  height={'3rem'}
                  radius={10}
                  circle={false}
                />
              </div>
            </div>
          </div>
          <div className="d-flex flex-row justify-content-center mt-2 p-2">
            <SkeletonLoader
              width={'50%'}
              height={'1.5rem'}
              radius={0}
              circle={false}
            />
          </div>
          <div className="col-12 p-2">
            <SkeletonLoader
              width={'100%'}
              height={'0.1rem'}
              radius={0}
              circle={false}
            />
          </div>
          <div className="row g-2">
            <div className="col-6">
              <div className="p-1">
                <SkeletonLoader
                  width={'100%'}
                  height={'3rem'}
                  radius={10}
                  circle={false}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="p-1">
                <SkeletonLoader
                  width={'100%'}
                  height={'3rem'}
                  radius={10}
                  circle={false}
                />
              </div>
            </div>
          </div>
          <div className="d-flex flex-row justify-content-center mt-2 p-2">
            <SkeletonLoader
              width={'50%'}
              height={'1.5rem'}
              radius={0}
              circle={false}
            />
          </div>
          <div className="col-12 p-2">
            <SkeletonLoader
              width={'100%'}
              height={'0.1rem'}
              radius={0}
              circle={false}
            />
          </div>
          <div className="row g-2">
            <div className="col-12">
              <div className="p-1">
                <SkeletonLoader
                  width={'100%'}
                  height={'3rem'}
                  radius={10}
                  circle={false}
                />
              </div>
            </div>
          </div>
          <div className="d-flex flex-row justify-content-end mt-2 p-2">
            <SkeletonLoader
              width={'20%'}
              height={'2rem'}
              radius={2}
              circle={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function compose_noPrivilege(handleClick: handleClickFunction) {
  return <NoPrivilege handleClick={handleClick} />
}

function compose_noAuth(handleClick: handleClickFunction) {
  return <NoAuth handleClick={handleClick} />
}

function compose_ready(
  handleClickBackPage: () => void,
  auth: string,
  assistantStep: number,
  assistantFinish: boolean,
  handleChangeAssistantStep: (step: number) => void,
  handleFinishAssistant: () => void,
  hasCompletedAssistantStep: (step: number) => boolean,
  pageSizeTableWorkplaces: number,
  pageSizeTablePeopleInWorkplaces: number,
  pageSizeOptionsTableWorkplaces: number[],
  pageSizeOptionsTablePeopleInWorkplaces: number[],
  handleChangePageSizeTableWorkplaces: (pageSize: number) => void,
  handleChangePageSizeTablePeopleInWorkplaces: (pageSize: number) => void,
  costCenters: CostCenterType[],
  costCenter: string,
  isLoadingCostCenters: boolean,
  handleChangeCostCenter: (id: string) => void,
  periodStart: Date,
  setPeriodStart: React.Dispatch<React.SetStateAction<Date>>,
  periodEnd: Date,
  setPeriodEnd: React.Dispatch<React.SetStateAction<Date>>,
  workplaces: WorkplaceType[],
  isLoadingWorkplaces: boolean,
  createWorkplace: FunctionCreateWorkplaceTypeof,
  updateWorkplaces: FunctionUpdateWorkplacesTypeof,
  isLoadingAddresses: boolean,
  addresses: AddressType[],
  createAddress: FunctionCreateAddressTypeof,
  updateAddresses: FunctionUpdateAddressesTypeof,
  isLoadingStreets: boolean,
  createStreet: FunctionCreateStreetTypeof,
  streets: StreetType[],
  updateStreets: FunctionUpdateStreetsTypeof,
  deleteStreets: FunctionDeleteStreetsTypeof,
  isLoadingCities: boolean,
  createCity: FunctionCreateCityTypeof,
  cities: CityType[],
  updateCities: FunctionUpdateCitiesTypeof,
  deleteCities: FunctionDeleteCitiesTypeof,
  isLoadingNeighborhoods: boolean,
  createNeighborhood: FunctionCreateNeighborhoodTypeof,
  neighborhoods: NeighborhoodType[],
  updateNeighborhoods: FunctionUpdateNeighborhoodsTypeof,
  deleteNeighborhoods: FunctionDeleteNeighborhoodsTypeof,
  isLoadingDistricts: boolean,
  createDistrict: FunctionCreateDistrictTypeof,
  districts: DistrictType[],
  updateDistricts: FunctionUpdateDistrictsTypeof,
  deleteDistricts: FunctionDeleteDistrictsTypeof,
  showModalRegisterWorkplace: boolean,
  showModalRegisterAddress: boolean,
  showModalRegisterPeopleInWorkplace: boolean,
  showModalEditWorkplace: boolean,
  showModalEditAddress: boolean,
  showModalEditPeopleInWorkplace: boolean,
  handleShowModalRegisterWorkplace: () => void,
  handleShowModalRegisterAddress: () => void,
  handleShowModalRegisterPeopleInWorkplace: () => void,
  handleCloseModalRegisterWorkplace: () => void,
  handleCloseModalRegisterAddress: () => void,
  handleCloseModalRegisterPeopleInWorkplace: () => void,
  handleShowModalEditWorkplace: () => void,
  handleShowModalEditAddress: () => void,
  handleShowModalEditPeopleInWorkplace: () => void,
  handleCloseModalEditWorkplace: () => void,
  handleCloseModalEditAddress: () => void,
  handleCloseModalEditPeopleInWorkplace: () => void,
  selectWorkplaces: string[],
  selectAddressId: string,
  selectPeopleInWorkplaces: string[],
  handleDefineSelectWorkplaces: (itens: string[]) => void,
  handleDefineSelectPeopleInWorkplaces: (itens: string[]) => void,
  handleDeleteWorkplaces: (workplacesId: string[]) => void,
  handleDeleteAddress: (addressId: string) => void,
  handleDeletePeopleInWorkplaces: (peopleId: string[]) => void,
  isLoadingPeople: boolean,
  people: PersonType[],
  createPerson: FunctionCreatePersonTypeof,
  createPersonCovering: FunctionCreatePersonCoveringTypeof,
  createPersonCoverage: FunctionCreatePersonCoverageTypeof,
  updatePeople: FunctionUpdatePeopleTypeof,
  createReasonForAbsence: FunctionCreateReasonForAbsenceTypeof,
  reasonForAbsence: ReasonForAbsenceType | undefined,
  handleChangeIdReasonForAbsence: (id: string) => void,
  isLoadingReasonForAbsence: boolean,
  reasonForAbsences: ReasonForAbsenceType[],
  isLoadingReasonForAbsences: boolean,
  updateReasonForAbsences: FunctionUpdateReasonForAbsencesTypeof,
  deleteReasonForAbsences: FunctionDeleteReasonForAbsencesTypeof,
  appliedWorkplaces: WorkplaceType[],
  appliedPeopleInWorkplaces: PersonType[],
  handleAppendAppliedWorkplaces: (itens: WorkplaceType[]) => void,
  handleAppendAppliedPeopleInWorkplaces: (itens: PersonType[]) => void,
  handleRemoveAppliedWorkplaces: (itens: WorkplaceType[]) => void,
  handleRemoveAppliedPeopleInWorkplaces: (itens: PersonType[]) => void,
  handleChangeIdAddress: (id: string) => void,
  isLoadingServices: boolean,
  services: ServiceType[],
  createService: FunctionCreateServiceTypeof,
  updateServices: FunctionUpdateServicesTypeof,
  deleteServices: FunctionDeleteServicesTypeof,
  handleAssignPeopleService: FunctionAssignPeopleServiceTypeof,
  handleAssignWorkplacesService: FunctionAssignWorkplacesServiceTypeof,
  handleUnassignPeopleService: FunctionUnassignPeopleServiceTypeof,
  handleUnassignWorkplacesService: FunctionUnassignWorkplacesServiceTypeof,
  isLoadingCards: boolean,
  cards: CardType[],
  handleAssignPeopleCard: FunctionAssignPeopleCardTypeof,
  handleUnassignPeopleCard: FunctionUnassignPeopleCardTypeof,
  isLoadingScales: boolean,
  scales: ScaleType[],
  createScale: FunctionCreateScaleTypeof,
  updateScales: FunctionUpdateScalesTypeof,
  deleteScales: FunctionDeleteScalesTypeof,
  postings: PostingType[],
  createPosting: FunctionCreatePostingTypeof,
  createUpload: FunctionCreateUploadTypeof,
  uploads: UploadType[],
  isLoadingUploads: boolean,
  updateUploads: FunctionUpdateUploadsTypeof,
  showModalAssistantCoverageDefine: boolean,
  handleOpenModalAssistantCoverageDefine: () => void,
  handleCloseModalAssistantCoverageDefine: () => void,
  postingsDefined: PostingType[],
  handleDefinePostingDefined: (postings: PostingType[]) => void,
  handleResetPostingDefined: () => void,
  handleRemovePostingDefined: (id: string) => void
) {
  const
    { columns: workPlaceColumns, rows: workPlaceRows } =
      getWorkPlaceForTable(workplaces),
    { columns: peopleColumns, rows: peopleRows } =
      getPeopleForTable(people),
    searchPostingsDefined = () => {
      const search = postings.filter(posting => {
        if (costCenters.map(costCenter => costCenter.value).includes(posting.costCenter.value) && posting.paymentStatus === 'pending') {
          if (DateEx.isWithinInterval(new Date(posting.originDate), {
            start: periodStart,
            end: periodEnd
          }))
            return true;
        }

        return false;
      });

      if (search.length > 0)
        handleDefinePostingDefined(search);
      else {
        Alerting.create('warning', `Nenhum lançamento encontrado, dentro do período informado.`);

        if (postings.filter(posting => posting.costCenter.value === costCenter && posting.paymentStatus === 'pending').length > 0)
          Alerting.create('info', `Existem ${postings.filter(posting => posting.paymentStatus === 'pending').length} lançamento(s) a pagar.`);
        else
          Alerting.create('info', `Não existem lançamentos a pagar.`);
      }
    };

  return (
    <>
      {!window.socket && <SocketConnection />}
      <RegisterWorkplace
        show={showModalRegisterWorkplace}
        createWorkplace={createWorkplace}
        addresses={addresses}
        isLoadingAddresses={isLoadingAddresses}
        services={services}
        isLoadingServices={isLoadingServices}
        createService={createService}
        updateServices={updateServices}
        assignWorkplacesService={handleAssignWorkplacesService}
        deleteServices={deleteServices}
        createScale={createScale}
        scale={undefined}
        isLoadingScale={false}
        scales={scales}
        isLoadingScales={isLoadingScales}
        updateScales={updateScales}
        deleteScales={deleteScales}
        handleClose={handleCloseModalRegisterWorkplace}
      />
      <RegisterAddress
        createAddress={createAddress}
        createStreet={createStreet}
        street={undefined}
        isLoadingStreet={false}
        streets={streets}
        isLoadingStreets={isLoadingStreets}
        updateStreets={updateStreets}
        deleteStreets={deleteStreets}
        createCity={createCity}
        city={undefined}
        isLoadingCity={false}
        cities={cities}
        isLoadingCities={isLoadingCities}
        updateCities={updateCities}
        deleteCities={deleteCities}
        createNeighborhood={createNeighborhood}
        neighborhood={undefined}
        isLoadingNeighborhood={false}
        neighborhoods={neighborhoods}
        isLoadingNeighborhoods={isLoadingNeighborhoods}
        updateNeighborhoods={updateNeighborhoods}
        deleteNeighborhoods={deleteNeighborhoods}
        createDistrict={createDistrict}
        district={undefined}
        isLoadingDistrict={false}
        districts={districts}
        isLoadingDistricts={isLoadingDistricts}
        updateDistricts={updateDistricts}
        deleteDistricts={deleteDistricts}
        show={showModalRegisterAddress}
        handleClose={handleCloseModalRegisterAddress}
      />
      {
        selectWorkplaces.length === 1 &&
        <EditWorkplace
          workplace={workplaces.find(place => place.id === selectWorkplaces[0])}
          isLoadingWorkplace={false}
          updateWorkplaces={updateWorkplaces}
          addresses={addresses}
          isLoadingAddresses={isLoadingAddresses}
          createService={createService}
          services={services}
          isLoadingServices={isLoadingServices}
          updateServices={updateServices}
          assignWorkplacesService={handleAssignWorkplacesService}
          unassignWorkplacesService={handleUnassignWorkplacesService}
          deleteServices={deleteServices}
          createScale={createScale}
          scale={workplaces.find(place => place.id === selectWorkplaces[0])?.scale}
          isLoadingScale={false}
          scales={scales}
          isLoadingScales={isLoadingScales}
          updateScales={updateScales}
          deleteScales={deleteScales}
          show={showModalEditWorkplace}
          handleClose={handleCloseModalEditWorkplace}
        />
      }
      {
        selectAddressId.length > 0 &&
        <EditAddress
          address={addresses.find(address => address.id === selectAddressId)}
          isLoadingAddress={false}
          updateAddresses={updateAddresses}
          createStreet={createStreet}
          street={addresses.find(address => address.id === selectAddressId)?.street}
          isLoadingStreet={false}
          streets={streets}
          isLoadingStreets={isLoadingStreets}
          updateStreets={updateStreets}
          deleteStreets={deleteStreets}
          createCity={createCity}
          city={addresses.find(address => address.id === selectAddressId)?.city}
          isLoadingCity={false}
          cities={cities}
          isLoadingCities={isLoadingCities}
          updateCities={updateCities}
          deleteCities={deleteCities}
          createNeighborhood={createNeighborhood}
          neighborhood={addresses.find(address => address.id === selectAddressId)?.neighborhood}
          isLoadingNeighborhood={false}
          neighborhoods={neighborhoods}
          isLoadingNeighborhoods={isLoadingNeighborhoods}
          updateNeighborhoods={updateNeighborhoods}
          deleteNeighborhoods={deleteNeighborhoods}
          createDistrict={createDistrict}
          district={addresses.find(address => address.id === selectAddressId)?.district}
          isLoadingDistrict={false}
          districts={districts}
          isLoadingDistricts={isLoadingDistricts}
          updateDistricts={updateDistricts}
          deleteDistricts={deleteDistricts}
          show={showModalEditAddress}
          handleClose={handleCloseModalEditAddress}
        />
      }
      <RegisterPeople
        show={showModalRegisterPeopleInWorkplace}
        createPerson={createPerson}
        addresses={addresses}
        isLoadingAddresses={isLoadingAddresses}
        services={services}
        isLoadingServices={isLoadingServices}
        createService={createService}
        updateServices={updateServices}
        assignPeopleService={handleAssignPeopleService}
        deleteServices={deleteServices}
        cards={cards}
        isLoadingCards={isLoadingCards}
        assignPeopleCard={handleAssignPeopleCard}
        createScale={createScale}
        scale={undefined}
        isLoadingScale={false}
        scales={scales}
        isLoadingScales={isLoadingScales}
        updateScales={updateScales}
        deleteScales={deleteScales}
        handleClose={handleCloseModalRegisterPeopleInWorkplace}
      />
      {
        selectPeopleInWorkplaces.length === 1 &&
        <EditPeople
          person={people.find(person => person.id === selectPeopleInWorkplaces[0])}
          isLoadingPerson={isLoadingPeople}
          updatePeople={updatePeople}
          addresses={addresses}
          isLoadingAddresses={isLoadingAddresses}
          createService={createService}
          services={services}
          isLoadingServices={isLoadingServices}
          updateServices={updateServices}
          assignPeopleService={handleAssignPeopleService}
          unassignPeopleService={handleUnassignPeopleService}
          deleteServices={deleteServices}
          cards={cards}
          isLoadingCards={isLoadingCards}
          assignPeopleCard={handleAssignPeopleCard}
          unassignPeopleCard={handleUnassignPeopleCard}
          createScale={createScale}
          scale={people.find(person => person.id === selectPeopleInWorkplaces[0])?.scale}
          isLoadingScale={false}
          scales={scales}
          isLoadingScales={isLoadingScales}
          updateScales={updateScales}
          deleteScales={deleteScales}
          show={showModalEditPeopleInWorkplace}
          handleClose={handleCloseModalEditPeopleInWorkplace}
        />
      }
      <AssistantCoverageDefine
        createPosting={createPosting}
        createUpload={createUpload}
        updateUploads={updateUploads}
        uploads={uploads}
        isLoadingUploads={isLoadingUploads}
        createPersonCovering={createPersonCovering}
        createPersonCoverage={createPersonCoverage}
        costCenters={costCenters}
        isLoadingCostCenters={isLoadingCostCenters}
        people={people}
        isLoadingPeople={isLoadingPeople}
        workplaces={workplaces}
        isLoadingWorkplaces={isLoadingWorkplaces}
        createReasonForAbsence={createReasonForAbsence}
        reasonForAbsence={reasonForAbsence}
        handleChangeIdReasonForAbsence={handleChangeIdReasonForAbsence}
        isLoadingReasonForAbsence={isLoadingReasonForAbsence}
        reasonForAbsences={reasonForAbsences}
        isLoadingReasonForAbsences={isLoadingReasonForAbsences}
        updateReasonForAbsences={updateReasonForAbsences}
        deleteReasonForAbsences={deleteReasonForAbsences}
        auth={auth}
        availableWorkplaces={appliedWorkplaces.map(place => place.id)}
        availablePeopleInWorkplace={appliedPeopleInWorkplaces.map(person => person.id)}
        postingCostCenterId={costCenter}
        periodStart={periodStart}
        periodEnd={periodEnd}
        handleFinish={(postings: PostingType[]) => {
          if (postings.length > 0) {
            Alerting.create('success', 'Cobertura(s) aplicada(s) com sucesso!');
            setTimeout(() => searchPostingsDefined(), 1000);
          }
        }}
        show={showModalAssistantCoverageDefine}
        handleClose={() => {
          handleRemoveAppliedPeopleInWorkplaces(appliedPeopleInWorkplaces);
          handleCloseModalAssistantCoverageDefine();
        }}
      />
      <div className="row g-2">
        <div className="col-12">
          <div className="p-3 bg-primary bg-gradient rounded">
            <p className="text-center text-secondary fw-bold fs-5 my-2">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'money-bill-wave')}
                className="me-2 fs-3 flex-shrink-1 text-secondary my-auto"
              />
              Registrar Lançamento
            </p>
          </div>
          <button
            type="button"
            className="btn btn-link"
            onClick={handleClickBackPage}
          >
            Voltar
          </button>
          <div className='d-flex flex-column flex-md-row'>
            <AssistantPostingsRegister
              step={assistantStep}
              onChangeStep={handleChangeAssistantStep}
              finish={assistantFinish}
              prevStepEnabled={!assistantFinish && assistantStep > 0}
              nextStepEnabled={hasCompletedAssistantStep(assistantStep)}
              onPrevStep={() => handleDefineSelectWorkplaces([])}
              onNextStep={() => handleDefineSelectWorkplaces([])}
              handleFinish={handleFinishAssistant}
              steps={[
                {
                  label: 'Locais de Trabalho',
                  completed: assistantStep > 0,
                  component: (
                    <div className='d-flex flex-column p-2 m-2'>
                      <p className="fw-bold border-bottom text-center my-2">
                        Informações Básicas
                      </p>
                      <div className='d-flex flex-column flex-md-row my-2'>
                        <div className="input-group my-2 m-md-2">
                          <span className="input-group-text" id="date-addon">
                            <FontAwesomeIcon
                              icon={Icon.render('fas', 'calendar-day')}
                              className="m-auto fs-3 flex-shrink-1 text-primary"
                            />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Data de Registro"
                            aria-label="Data de Registro"
                            aria-describedby="date-addon"
                            value={StringEx.createdAt()}
                            disabled={true}
                          />
                        </div>
                      </div>
                      <FormControl variant="standard" className='col-12'>
                        <InputLabel id="select-costCenter-label">
                          Centro de Custo
                        </InputLabel>
                        <Select
                          labelId="select-costCenter-label"
                          id="select-costCenter"
                          value={costCenter}
                          disabled={postingsDefined.length > 0}
                          onChange={(e) => handleChangeCostCenter(e.target.value)}
                          label="Centro de Custo"
                        >
                          <MenuItem value="">
                            <em>Selecionar</em>
                          </MenuItem>
                          {
                            costCenters
                              .map(costCenter => (
                                <MenuItem
                                  key={costCenter.id}
                                  value={costCenter.id}>
                                  {costCenter.value}
                                </MenuItem>
                              ))
                          }
                        </Select>
                      </FormControl>
                      <div className='d-flex flex-column flex-md-row my-2'>
                        <DatePicker
                          className="col px-2 my-2"
                          label="Período de Apuração (Inicial)"
                          value={periodStart}
                          maxDate={periodEnd}
                          minDate={DateEx.subDays(new Date(), 7)}
                          disabled={postingsDefined.length > 0}
                          handleChangeValue={(value) => {
                            if (
                              DateEx.isEqual(value, periodEnd) ||
                              DateEx.isBefore(value, periodEnd)
                            ) {
                              setPeriodStart(value);
                            } else {
                              Alerting.create('warning', `A data inicial não pode ser maior que a data final.`, 3600);
                            }
                          }}
                        />
                        <DatePicker
                          className="col px-2 my-2"
                          label="Período de Apuração (Final)"
                          value={periodEnd}
                          maxDate={DateEx.addYears(new Date(), 1)}
                          minDate={periodStart}
                          disabled={postingsDefined.length > 0}
                          handleChangeValue={(value) => {
                            if (
                              DateEx.isEqual(value, periodStart) ||
                              DateEx.isAfter(value, periodStart)
                            ) {
                              setPeriodEnd(value);
                            } else {
                              Alerting.create('warning', `A data final não pode ser menor que a data inicial.`, 3600);
                            }
                          }}
                        />
                      </div>
                      <p className="fw-bold border-bottom text-center my-2">
                        Gerenciamento dos Endereços
                      </p>
                      <div className='d-flex flex-column'>
                        <SelectAddress
                          addresses={addresses}
                          isLoadingAddresses={isLoadingAddresses}
                          disabledButtonAppend={false}
                          disabledButtonUpdate={selectAddressId.length <= 0}
                          disabledButtonRemove={selectAddressId.length <= 0}
                          handleButtonAppend={handleShowModalRegisterAddress}
                          handleButtonUpdate={handleShowModalEditAddress}
                          handleButtonRemove={() => handleDeleteAddress(selectAddressId)}
                          handleChangeId={handleChangeIdAddress}
                        />
                      </div>
                      <p className="fw-bold border-bottom text-center my-2">
                        Postos de Trabalho
                      </p>
                      <ListWorkplacesSelected
                        workplaces={appliedWorkplaces}
                      />
                      <p className="text-center text-muted">
                        Voce deve selecionar no minimo 2 postos de trabalho para
                        definir as coberturas.
                      </p>
                      <p className="fw-bold border-bottom text-center my-2">
                        Disponíveis
                      </p>
                      <ListWithCheckboxMUI
                        columns={workPlaceColumns}
                        rows={workPlaceRows}
                        pageSize={pageSizeTableWorkplaces}
                        pageSizeOptions={pageSizeOptionsTableWorkplaces}
                        onChangeSelection={handleDefineSelectWorkplaces}
                        onPageSizeChange={handleChangePageSizeTableWorkplaces}
                      />
                      <div className='d-flex flex-column flex-md-row'>
                        <button
                          type="button"
                          className="btn btn-link"
                          disabled={selectWorkplaces.length <= 0}
                          onClick={() => {
                            const filtered = selectWorkplaces.filter(id => {
                              if (appliedWorkplaces.find(applied => applied.id === id))
                                return false;

                              return true;
                            });

                            if (filtered.length > 0)
                              handleAppendAppliedWorkplaces(workplaces.filter(workplace => filtered.includes(workplace.id)));
                          }}
                        >
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'check')}
                            className="me-1 flex-shrink-1 my-auto"
                          /> Aplicar
                        </button>
                        <button
                          type="button"
                          className="btn btn-link"
                          disabled={selectWorkplaces.length <= 0}
                          onClick={() => handleRemoveAppliedWorkplaces(workplaces.filter(workplace => selectWorkplaces.includes(workplace.id)))}
                        >
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'times')}
                            className="me-1 flex-shrink-1 my-auto"
                          /> Desaplicar
                        </button>
                        <button
                          type="button"
                          className="btn btn-link"
                          disabled={selectWorkplaces.length <= 0 || selectWorkplaces.length > 1}
                          onClick={handleShowModalEditWorkplace}
                        >
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'edit')}
                            className="me-1 flex-shrink-1 my-auto"
                          /> Atualizar
                        </button>
                        <button
                          type="button"
                          className="btn btn-link"
                          disabled={selectWorkplaces.length <= 0}
                          onClick={() => handleDeleteWorkplaces(selectWorkplaces)}
                        >
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'minus-square')}
                            className="me-1 flex-shrink-1 my-auto"
                          /> Remover
                        </button>
                        <button
                          type="button"
                          className="btn btn-link"
                          onClick={handleShowModalRegisterWorkplace}
                        >
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'plus-square')}
                            className="me-1 flex-shrink-1 my-auto"
                          /> Adicionar
                        </button>
                      </div>
                    </div>
                  )
                },
                {
                  label: 'Coberturas',
                  completed: assistantFinish,
                  component: (
                    <div className='d-flex flex-column p-2 m-2'>
                      <ListCoverageDefined
                        postings={postingsDefined}
                        disabledPostingRemove={assistantFinish}
                        handlePostingRemove={handleRemovePostingDefined}
                      />
                      <Button
                        variant="outlined"
                        disabled={assistantFinish}
                        onClick={() => searchPostingsDefined()}
                        className='col-12 m-2'
                      >
                        <FontAwesomeIcon
                          icon={Icon.render('fas', 'search')}
                          className="me-2 flex-shrink-1 my-auto"
                        />
                        Procurar Coberturas registradas
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => handleResetPostingDefined()}
                        disabled={assistantFinish || postingsDefined.length <= 0}
                        className='col-12 m-2'
                        color={'error'}
                      >
                        <FontAwesomeIcon
                          icon={Icon.render('fas', 'history')}
                          className="me-2 flex-shrink-1 my-auto"
                        />
                        Limpar Coberturas Aplicadas
                      </Button>
                      <p className="fw-bold border-bottom text-center my-2">
                        Funcionários
                      </p>
                      <ListWithCheckboxMUI
                        columns={peopleColumns}
                        rows={peopleRows}
                        pageSize={pageSizeTablePeopleInWorkplaces}
                        pageSizeOptions={pageSizeOptionsTablePeopleInWorkplaces}
                        onChangeSelection={handleDefineSelectPeopleInWorkplaces}
                        onPageSizeChange={handleChangePageSizeTablePeopleInWorkplaces}
                      />
                      <div className='d-flex flex-column flex-md-row'>
                        <button
                          type="button"
                          className="btn btn-link"
                          disabled={assistantFinish || selectPeopleInWorkplaces.length <= 0 || selectPeopleInWorkplaces.length % 2 !== 0}
                          onClick={() => {
                            const filtered = selectPeopleInWorkplaces.filter(id => {
                              if (appliedPeopleInWorkplaces.find(applied => applied.id === id))
                                return false;

                              return true;
                            });

                            if (filtered.length > 0) {
                              handleAppendAppliedPeopleInWorkplaces(people.filter(person => filtered.includes(person.id)));
                              handleOpenModalAssistantCoverageDefine();
                            }
                          }}
                        >
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'check')}
                            className="me-1 flex-shrink-1 my-auto"
                          /> Aplicar
                        </button>
                        <button
                          type="button"
                          className="btn btn-link"
                          disabled={assistantFinish || selectPeopleInWorkplaces.length <= 0 || selectPeopleInWorkplaces.length > 1}
                          onClick={handleShowModalEditPeopleInWorkplace}
                        >
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'edit')}
                            className="me-1 flex-shrink-1 my-auto"
                          /> Atualizar
                        </button>
                        <button
                          type="button"
                          className="btn btn-link"
                          disabled={
                            assistantFinish ||
                            selectPeopleInWorkplaces.length <= 0
                          }
                          onClick={() => handleDeletePeopleInWorkplaces(selectPeopleInWorkplaces)}
                        >
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'minus-square')}
                            className="me-1 flex-shrink-1 my-auto"
                          /> Remover
                        </button>
                        <button
                          type="button"
                          className="btn btn-link"
                          disabled={assistantFinish}
                          onClick={handleShowModalRegisterPeopleInWorkplace}
                        >
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'plus-square')}
                            className="me-1 flex-shrink-1 my-auto"
                          /> Adicionar
                        </button>
                      </div>
                      <p className="text-start text-muted">
                        Voce deve selecionar sempre pares de funcionários para
                        aplicar as coberturas.
                      </p>
                    </div>
                  )
                }
              ]}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default function Register(
  {
    privileges,
    auth,
    getUserInfoAuthorization,
  }: {
    privileges: PrivilegesSystem[],
    auth: string,
    getUserInfoAuthorization: string
  }
) {
  const [syncData, setSyncData] = useState<boolean>(false)

  const [isReady, setReady] = useState<boolean>(false)
  const [notPrivilege, setNotPrivilege] = useState<boolean>(false)
  const [notAuth, setNotAuth] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const [showModalRegisterWorkplace, setShowModalRegisterWorkplace] = useState<boolean>(false)
  const [showModalEditWorkplace, setShowModalEditWorkplace] = useState<boolean>(false)

  const [showModalRegisterAddress, setShowModalRegisterAddress] = useState<boolean>(false)
  const [showModalEditAddress, setShowModalEditAddress] = useState<boolean>(false)

  const [showModalRegisterPeopleInWorkplace, setShowModalRegisterPeopleInWorkplace] = useState<boolean>(false)
  const [showModalEditPeopleInWorkplace, setShowModalEditPeopleInWorkplace] = useState<boolean>(false)

  const [assistantStep, setAssistantStep] = useState<number>(0)
  const [assistantFinish, setAssistantFinish] = useState<boolean>(false)

  const [costCenter, setCostCenter] = useState<string>('')
  const [periodStart, setPeriodStart] = useState<Date>(new Date())
  const [periodEnd, setPeriodEnd] = useState<Date>(new Date())

  const [selectWorkplaces, setSelectWorkplaces] = useState<string[]>([])
  const [appliedWorkplaces, setAppliedWorkplaces] = useState<WorkplaceType[]>([])

  const [pageSizeTableWorkplaces, setPageSizeTableWorkplaces] = useState<number>(10)
  const pageSizeOptionsTableWorkplaces = [10, 25, 50, 100];

  const [selectAddressId, setSelectAddressId] = useState<string>('')
  const [selectReasonForAbsenceId, setSelectReasonForAbsenceId] = useState<string>('')

  const [selectPeopleInWorkplaces, setSelectPeopleInWorkplaces] = useState<string[]>([])
  const [appliedPeopleInWorkplaces, setAppliedPeopleInWorkplaces] = useState<PersonType[]>([])

  const [pageSizeTablePeopleInWorkplaces, setPageSizeTablePeopleInWorkplaces] = useState<number>(10)
  const pageSizeOptionsTablePeopleInWorkplaces = [10, 25, 50, 100];

  const [showModalAssistantCoverageDefine, setShowModalAssistantCoverageDefine] = useState<boolean>(false)

  const [postingsDefined, setPostingsDefined] = useState<PostingType[]>([])

  const { success, data, error } = useGetUserInfoService(
    {
      auth: compressToEncodedURIComponent(auth),
    },
    {
      authorization: getUserInfoAuthorization,
      encodeuri: 'true'
    }
  );

  const
    { create: CreatePosting } = usePostingService(),
    { data: postings, isLoading: isLoadingPostings, delete: DeletePostings } = usePostingsService(),
    { data: peopleCovering, isLoading: isLoadingPeopleCovering, delete: DeletePeopleCovering } = usePeopleCoveringService(),
    { data: peopleCoverage, isLoading: isLoadingPeopleCoverage, delete: DeletePeopleCoverage } = usePeopleCoverageService(),
    { data: costCenters, isLoading: isLoadingCostCenters } = useCostCentersService(),
    { create: CreateWorkplace } = useWorkplaceService(),
    { data: workplaces, isLoading: isLoadingWorkplaces, update: UpdateWorkplaces, delete: DeleteWorkplaces } = useWorkplacesService(),
    { create: CreateAddress } = useAddressService(),
    { data: addresses, isLoading: isLoadingAddresses, update: UpdateAddresses, delete: DeleteAddresses } = useAddressesService(),
    { create: CreatePerson } = usePersonService(),
    { create: CreatePersonCovering } = usePersonCoveringService(),
    { create: CreatePersonCoverage } = usePersonCoverageService(),
    { data: people, isLoading: isLoadingPeople, update: UpdatePeople, delete: DeletePeople } = usePeopleService(),
    { create: CreateReasonForAbsence } = useReasonForAbsenceService(),
    { data: reasonForAbsences, isLoading: isLoadingReasonForAbsences, update: UpdateReasonForAbsence, delete: DeleteReasonForAbsence } = useReasonForAbsencesService(),
    { create: CreateService } = useServiceService(),
    { data: reasonForAbsence, isLoading: isLoadingReasonForAbsence } = useReasonForAbsenceWithIdService(selectReasonForAbsenceId),
    { data: services, isLoading: isLoadingServices, update: UpdateServices, assignPerson: AssignPeopleService, assignWorkplace: AssignWorkplacesService, unassignPerson: UnassignPeopleService, unassignWorkplace: unassignWorkplacesService, delete: DeleteServices } = useServicesService(),
    { data: cards, isLoading: isLoadingCards, assignPerson: AssignPeopleCard, unassignPerson: UnassignPeopleCard } = useCardsService(),
    { create: CreateUpload } = useUploadService(),
    { data: uploads, isLoading: isLoadingUploads, update: UpdateUploads, delete: DeleteUploads } = useUploadsService(),
    { create: CreateScale } = useScaleService(),
    { data: scales, isLoading: isLoadingScales, update: UpdateScales, delete: DeleteScales } = useScalesService(),
    { create: CreateStreet } = useStreetService(),
    { data: streets, isLoading: isLoadingStreets, update: UpdateStreets, delete: DeleteStreets } = useStreetsService(),
    { create: CreateCity } = useCityService(),
    { data: cities, isLoading: isLoadingCities, update: UpdateCities, delete: DeleteCities } = useCitiesService(),
    { create: CreateNeighborhood } = useNeighborhoodService(),
    { data: neighborhoods, isLoading: isLoadingNeighborhoods, update: UpdateNeighborhoods, delete: DeleteNeighborhoods } = useNeighborhoodsService(),
    { create: CreateDistrict } = useDistrictService(),
    { data: districts, isLoading: isLoadingDistricts, update: UpdateDistricts, delete: DeleteDistricts } = useDistrictsService();

  const router = useRouter()

  const
    handleClickNoAuth: handleClickFunction = async (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      path: string
    ) => {
      event.preventDefault();
      if (path === '/auth/login')
        router.push(path);
    },
    handleClickNoPrivilege: handleClickFunction = async (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      path: string
    ) => {
      event.preventDefault()
      router.push(path)
    },
    handleClickBackPage = () => router.push('/payback/postings'),
    handleChangeAssistantStep = (step: number) => setAssistantStep(step),
    handleFinishAssistant = () => {
      Alerting.create('success', 'Muito Bem!, Você já pode tomar um café.');
      Alerting.create('warning', 'Não esqueça de avisar o coordenador que os lançamentos foram registrados, e ele já pode apura-los.');
      setAssistantFinish(true);
    },
    hasCompletedAssistantStep = (step: number) => {
      switch (step) {
        case 0:
          return appliedWorkplaces.length > 0 &&
            appliedWorkplaces.length % 2 == 0 &&
            costCenter.length > 0 &&
            periodStart !== null &&
            periodEnd !== null
        case 1:
          return postingsDefined.length > 0;
        default:
          return false
      }
    },
    handleChangePageSizeTableWorkplaces = (pageSize: number) => setPageSizeTableWorkplaces(pageSize),
    handleChangePageSizeTablePeopleInWorkplaces = (pageSize: number) => setPageSizeTablePeopleInWorkplaces(pageSize),
    handleChangeCostCenter = (id: string) => setCostCenter(id),
    handleShowModalRegisterWorkplace = () => setShowModalRegisterWorkplace(true),
    handleShowModalRegisterAddress = () => setShowModalRegisterAddress(true),
    handleShowModalRegisterPeopleInWorkplace = () => setShowModalRegisterPeopleInWorkplace(true),
    handleCloseModalRegisterWorkplace = () => setShowModalRegisterWorkplace(false),
    handleCloseModalRegisterAddress = () => setShowModalRegisterAddress(false),
    handleCloseModalRegisterPeopleInWorkplace = () => setShowModalRegisterPeopleInWorkplace(false),
    handleShowModalEditWorkplace = () => setShowModalEditWorkplace(true),
    handleShowModalEditAddress = () => setShowModalEditAddress(true),
    handleShowModalEditPeopleInWorkplace = () => setShowModalEditPeopleInWorkplace(true),
    handleCloseModalEditWorkplace = () => setShowModalEditWorkplace(false),
    handleCloseModalEditAddress = () => setShowModalEditAddress(false),
    handleCloseModalEditPeopleInWorkplace = () => setShowModalEditPeopleInWorkplace(false),
    handleDefineSelectWorkplaces = (itens: string[]) => setSelectWorkplaces(itens),
    handleDefineSelectPeopleInWorkplaces = (itens: string[]) => setSelectPeopleInWorkplaces(itens),
    handleDeleteWorkplaces = async (workplacesId: string[]) => {
      if (!DeleteWorkplaces)
        return Alerting.create('error', 'Não foi possível deletar o(s) registro(s) selecionado(s). Tente novamente, mais tarde.');

      const newAppliedWorkplaces: WorkplaceType[] = [];

      for (const workplaceId of workplacesId) {
        const place = workplaces.find(place => place.id === workplaceId);

        if (!place)
          return Alerting.create('error', `Não foi possível deletar o local de trabalho, ele não foi encontrado.`);

        const services = place.workplaceService;

        if (services && services.length > 0)
          await handleUnassignWorkplacesService(services.map(service => service.id));

        const deleted = await DeleteWorkplaces(workplaceId);

        if (!deleted)
          return Alerting.create('error', `Não foi possível deletar o local de trabalho (${place.name}). Verifique se ele não está sendo utilizado em outro registro.`);

        newAppliedWorkplaces.push(place);

        Alerting.create('success', `Local de trabalho (${place.name}) deletado com sucesso.`);
      }

      if (newAppliedWorkplaces.length > 0)
        handleRemoveAppliedWorkplaces(newAppliedWorkplaces);
    },
    handleDeleteAddress = async (addressId: string) => {
      if (!DeleteAddresses)
        return Alerting.create('error', 'Não foi possível deletar o registro. Tente novamente, mais tarde.');

      const deleted = await DeleteAddresses(addressId);

      if (!deleted)
        return Alerting.create('error', 'Não foi possível deletar o endereço. Verifique se ele não está sendo utilizado em outro registro.');

      Alerting.create('success', 'Endereço deletado com sucesso.');
    },
    handleDeletePeopleInWorkplaces = async (peopleId: string[]) => {
      if (!DeletePeople)
        return Alerting.create('error', 'Não foi possível deletar o(s) registro(s) selecionado(s). Tente novamente, mais tarde.');

      const newPeopleInWorkplaces: PersonType[] = [];

      for (const personId of peopleId) {
        if (postings.filter(posting => posting.coveringId === personId || posting.coverageId === personId).length > 0)
          return Alerting.create('error', `Não foi possível deletar o(a) funcionario(a) ${people.find(person => person.id === personId)?.name || '???'}. Verifique se ele não está sendo utilizado em outro registro.`);

        const person = people.find(person => person.id === personId);

        if (!person)
          return Alerting.create('error', `Não foi possível deletar o(a) funcionario(a), ele(a) não foi encontrado(a).`);

        const
          cards = person.cards,
          services = person.personService;

        if (cards && cards.length > 0)
          await handleUnassignPeopleCard(cards.map(card => card.id));

        if (services && services.length > 0)
          await handleUnassignPeopleService(services.map(service => service.id));

        const deleted = await DeletePeople(personId);

        if (!deleted)
          return Alerting.create('error', `Não foi possível deletar o(a) funcionario(a) ${person.name}. Verifique se ele(a) não está sendo utilizado(a) em outro registro.`);

          newPeopleInWorkplaces.push(person);

        Alerting.create('success', `Funcionario(a) ${person.name} deletado(a) com sucesso.`);
      }

      if (newPeopleInWorkplaces.length > 0)
        handleRemoveAppliedPeopleInWorkplaces(newPeopleInWorkplaces);
    },
    handleAppendAppliedWorkplaces = (itens: WorkplaceType[]) => setAppliedWorkplaces([...appliedWorkplaces, ...itens]),
    handleAppendAppliedPeopleInWorkplaces = (itens: PersonType[]) => setAppliedPeopleInWorkplaces([...appliedPeopleInWorkplaces, ...itens]),
    handleRemoveAppliedWorkplaces = (itens: WorkplaceType[]) => {
      setAppliedWorkplaces(appliedWorkplaces.filter(item => !itens.some(item2 => item2.id === item.id)))
    },
    handleRemoveAppliedPeopleInWorkplaces = (itens: PersonType[]) => {
      setAppliedPeopleInWorkplaces(appliedPeopleInWorkplaces.filter(item => !itens.some(item2 => item2.id === item.id)))
    },
    handleChangeIdAddress = (id: string) => setSelectAddressId(id),
    handleChangeIdReasonForAbsence = (id: string) => setSelectReasonForAbsenceId(id),
    handleOpenModalAssistantCoverageDefine = () => setShowModalAssistantCoverageDefine(true),
    handleCloseModalAssistantCoverageDefine = () => setShowModalAssistantCoverageDefine(false),
    handleDefinePostingDefined = (postings: PostingType[]) => setPostingsDefined(postings),
    handleResetPostingDefined = () => setPostingsDefined([]),
    handleRemovePostingDefined = async (id: string) => {
      if (!DeletePostings || !DeletePeopleCovering || !DeletePeopleCoverage)
        return Alerting.create('error', 'Não foi possível deletar o(s) registro(s) selecionado(s). Tente novamente, mais tarde.');

      const
        posting = postings.find(item => item.id === id),
        deleteFiles = [],
        deleteMirrors = [];

      if (posting) {
        if (posting.covering && posting.covering.mirror) {
          deleteFiles.push(posting.covering.mirror.fileId);
          deleteMirrors.push(posting.covering.mirror.id);
        }

        if (posting.coverage && posting.coverage.mirror) {
          deleteFiles.push(posting.coverage.mirror.fileId);
          deleteMirrors.push(posting.coverage.mirror.id);
        }

        if (deleteFiles.length > 0 && deleteMirrors.length)
          handleRemoveUploadedFile(deleteFiles, deleteMirrors);

        const deleted = await DeletePostings(id);

        if (deleted) {
          setPostingsDefined(postingsDefined.filter(item => item.id !== id));

          if (posting.coveringId)
            await DeletePeopleCovering(posting.coveringId);
          if (posting.coverageId.length > 0)
            await DeletePeopleCoverage(posting.coverageId);

          Alerting.create('success', `Lançamento ${posting.description || ""} deletado com sucesso.`);
        } else {
          Alerting.create('error', `Não foi possível deletar o lançamento ${posting.description || ""}. Tente novamente, mais tarde.`);
        }
      } else {
        Alerting.create('warning', 'Lançamento financeiro não encontrado.');
      }
    },
    handleRemoveUploadedFile = (filesId: string[], mirrorsId: string[]) =>
      window.socket.emit(
        PaybackSocketEvents.PAYBACK_DELETE_MIRROR,
        window.socket.compress<TYPEOF_EMITTER_PAYBACK_DELETE_MIRROR>({
          filesId,
          mirrorsId
        })
      ),
    handleDeleteUpload = async (mirrorId: string) => {
      if (!DeleteUploads)
        return Alerting.create('error', 'Não foi possível deletar o(s) registro(s) selecionado(s). Tente novamente, mais tarde.');

      const deleted = await DeleteUploads(mirrorId);

      if (deleted) {
        Alerting.create('success', `Arquivo deletado com sucesso.`);
      } else {
        Alerting.create('error', `Não foi possível deletar o arquivo. Tente novamente, mais tarde.`);
      }
    },
    handleAssignPeopleService = async (dataAssign: Required<DataAssignPerson>[]) => {
      if (!AssignPeopleService)
        return Alerting.create('error', 'Ocorreu um erro inesperado. Tente novamente, mais tarde.');

      for (const assign of dataAssign) {
        await AssignPeopleService(assign.serviceId, assign);
      }
    },
    handleAssignWorkplacesService = async (dataAssign: Required<DataAssignWorkplace>[]) => {
      if (!AssignWorkplacesService)
        return Alerting.create('error', 'Ocorreu um erro inesperado. Tente novamente, mais tarde.');

      for (const assign of dataAssign) {
        await AssignWorkplacesService(assign.serviceId, assign);
      }
    },
    handleUnassignPeopleService = async (peopleServiceId: string[]) => {
      if (!UnassignPeopleService)
        return Alerting.create('error', 'Não foi possível deletar o(s) registro(s) selecionado(s). Tente novamente, mais tarde.');

      for (const personServiceId of peopleServiceId) {
        await UnassignPeopleService(personServiceId);
      }
    },
    handleUnassignWorkplacesService = async (workplacesServiceId: string[]) => {
      if (!unassignWorkplacesService)
        return Alerting.create('error', 'Não foi possível deletar o(s) registro(s) selecionado(s). Tente novamente, mais tarde.');

      for (const personServiceId of workplacesServiceId) {
        await unassignWorkplacesService(personServiceId);
      }
    },
    handleAssignPeopleCard = async (id: string, dataPersonId: DataPersonId[]) => {
      if (!AssignPeopleCard)
        return Alerting.create('error', 'Não foi possível deletar o(s) registro(s) selecionado(s). Tente novamente, mais tarde.');

      for (const personId of dataPersonId) {
        await AssignPeopleCard(id, personId);
      }
    },
    handleUnassignPeopleCard = async (ids: string[]) => {
      if (!UnassignPeopleCard)
        return Alerting.create('error', 'Não foi possível deletar o(s) registro(s) selecionado(s). Tente novamente, mais tarde.');

      for (const id of ids) {
        await UnassignPeopleCard(id);
      }
    }

  if (error && !notAuth) {
    setNotAuth(true);
    setLoading(false);
  }

  if (success && data && !isReady) {
    if (
      privileges
        .filter(privilege => data.privileges.indexOf(privilege) !== -1)
        .length <= 0
    )
      setNotPrivilege(true);

    setReady(true);
    setLoading(false);
  }

  if (
    isLoadingPostings && !syncData
    || isLoadingPeopleCovering && !syncData
    || isLoadingPeopleCoverage && !syncData
    || isLoadingCostCenters && !syncData
    || isLoadingWorkplaces && !syncData
    || isLoadingAddresses && !syncData
    || isLoadingPeople && !syncData
    || isLoadingReasonForAbsences && !syncData
    || isLoadingServices && !syncData
    || isLoadingCards && !syncData
    || isLoadingUploads && !syncData
    || isLoadingScales && !syncData
    || isLoadingStreets && !syncData
    || isLoadingCities && !syncData
    || isLoadingNeighborhoods && !syncData
    || isLoadingDistricts && !syncData
  )
    return compose_load();

  if (
    !syncData
    && postings
    && peopleCovering
    && peopleCoverage
    && costCenters
    && workplaces
    && addresses
    && people
    && reasonForAbsences
    && services
    && cards
    && uploads
    && scales
    && streets
    && cities
    && neighborhoods
    && districts
  ) {
    setSyncData(true);
  } else if (
    !syncData && !CreatePosting
    || !syncData && !postings
    || !syncData && !DeletePostings
    || !syncData && !DeletePeopleCovering
    || !syncData && !DeletePeopleCoverage
    || !syncData && !costCenters
    || !syncData && !workplaces
    || !syncData && !UpdateWorkplaces
    || !syncData && !DeleteWorkplaces
    || !syncData && !addresses
    || !syncData && !people
    || !syncData && !UpdatePeople
    || !syncData && !CreatePersonCovering
    || !syncData && !CreatePersonCoverage
    || !syncData && !DeletePeople
    || !syncData && !reasonForAbsences
    || !syncData && !UpdateReasonForAbsence
    || !syncData && !DeleteReasonForAbsence
    || !syncData && !services
    || !syncData && !AssignPeopleService
    || !syncData && !AssignWorkplacesService
    || !syncData && !UnassignPeopleService
    || !syncData && !unassignWorkplacesService
    || !syncData && !cards
    || !syncData && !AssignPeopleCard
    || !syncData && !UnassignPeopleCard
    || !syncData && !uploads
    || !syncData && !CreateUpload
    || !syncData && !UpdateUploads
    || !syncData && !DeleteUploads
    || !syncData && !scales
    || !syncData && !UpdateScales
    || !syncData && !DeleteScales
    || !syncData && !streets
    || !syncData && !UpdateStreets
    || !syncData && !DeleteStreets
    || !syncData && !cities
    || !syncData && !UpdateCities
    || !syncData && !DeleteCities
    || !syncData && !neighborhoods
    || !syncData && !UpdateNeighborhoods
    || !syncData && !DeleteNeighborhoods
    || !syncData && !districts
    || !syncData && !UpdateDistricts
    || !syncData && !DeleteDistricts
  ) {
    return <BoxError />
  }

  if (loading) return compose_load()

  if (notPrivilege) return compose_noPrivilege(handleClickNoPrivilege)

  if (notAuth) return compose_noAuth(handleClickNoAuth)

  if (isReady) {
    onSocketEvents(handleDeleteUpload);

    return compose_ready(
      handleClickBackPage,
      auth,
      assistantStep,
      assistantFinish,
      handleChangeAssistantStep,
      handleFinishAssistant,
      hasCompletedAssistantStep,
      pageSizeTableWorkplaces,
      pageSizeTablePeopleInWorkplaces,
      pageSizeOptionsTableWorkplaces,
      pageSizeOptionsTablePeopleInWorkplaces,
      handleChangePageSizeTableWorkplaces,
      handleChangePageSizeTablePeopleInWorkplaces,
      costCenters,
      costCenter,
      isLoadingCostCenters,
      handleChangeCostCenter,
      periodStart,
      setPeriodStart,
      periodEnd,
      setPeriodEnd,
      workplaces,
      isLoadingWorkplaces,
      CreateWorkplace,
      UpdateWorkplaces,
      isLoadingAddresses,
      addresses,
      CreateAddress,
      UpdateAddresses,
      isLoadingStreets,
      CreateStreet,
      streets,
      UpdateStreets,
      DeleteStreets,
      isLoadingCities,
      CreateCity,
      cities,
      UpdateCities,
      DeleteCities,
      isLoadingNeighborhoods,
      CreateNeighborhood,
      neighborhoods,
      UpdateNeighborhoods,
      DeleteNeighborhoods,
      isLoadingDistricts,
      CreateDistrict,
      districts,
      UpdateDistricts,
      DeleteDistricts,
      showModalRegisterWorkplace,
      showModalRegisterAddress,
      showModalRegisterPeopleInWorkplace,
      showModalEditWorkplace,
      showModalEditAddress,
      showModalEditPeopleInWorkplace,
      handleShowModalRegisterWorkplace,
      handleShowModalRegisterAddress,
      handleShowModalRegisterPeopleInWorkplace,
      handleCloseModalRegisterWorkplace,
      handleCloseModalRegisterAddress,
      handleCloseModalRegisterPeopleInWorkplace,
      handleShowModalEditWorkplace,
      handleShowModalEditAddress,
      handleShowModalEditPeopleInWorkplace,
      handleCloseModalEditWorkplace,
      handleCloseModalEditAddress,
      handleCloseModalEditPeopleInWorkplace,
      selectWorkplaces,
      selectAddressId,
      selectPeopleInWorkplaces,
      handleDefineSelectWorkplaces,
      handleDefineSelectPeopleInWorkplaces,
      handleDeleteWorkplaces,
      handleDeleteAddress,
      handleDeletePeopleInWorkplaces,
      isLoadingPeople,
      people,
      CreatePerson,
      CreatePersonCovering,
      CreatePersonCoverage,
      UpdatePeople,
      CreateReasonForAbsence,
      reasonForAbsence,
      handleChangeIdReasonForAbsence,
      isLoadingReasonForAbsence,
      reasonForAbsences,
      isLoadingReasonForAbsences,
      UpdateReasonForAbsence,
      DeleteReasonForAbsence,
      appliedWorkplaces,
      appliedPeopleInWorkplaces,
      handleAppendAppliedWorkplaces,
      handleAppendAppliedPeopleInWorkplaces,
      handleRemoveAppliedWorkplaces,
      handleRemoveAppliedPeopleInWorkplaces,
      handleChangeIdAddress,
      isLoadingServices,
      services,
      CreateService,
      UpdateServices,
      DeleteServices,
      handleAssignPeopleService,
      handleAssignWorkplacesService,
      handleUnassignPeopleService,
      handleUnassignWorkplacesService,
      isLoadingCards,
      cards,
      handleAssignPeopleCard,
      handleUnassignPeopleCard,
      isLoadingScales,
      scales,
      CreateScale,
      UpdateScales,
      DeleteScales,
      postings,
      CreatePosting,
      CreateUpload,
      uploads,
      isLoadingUploads,
      UpdateUploads,
      showModalAssistantCoverageDefine,
      handleOpenModalAssistantCoverageDefine,
      handleCloseModalAssistantCoverageDefine,
      postingsDefined,
      handleDefinePostingDefined,
      handleResetPostingDefined,
      handleRemovePostingDefined,
    )
  }
}

/**
 * @description Adiciona os ouvintes dos eventos do socket.io
 */
function onSocketEvents(
  handleDeleteUpload: (fileId: string) => void
) {
  const socket = window.socket;

  if (socket) {
    const
      events = [
        `${PaybackSocketEvents.PAYBACK_DELETE_MIRROR}-SUCCESS`,
        `${PaybackSocketEvents.PAYBACK_DELETE_MIRROR}-FAILURE`,
      ]

    events
      .forEach(event => {
        if (socket.hasListeners(event))
          socket.off(event);
      })

    socket
      .on(
        events[0], // * PAYBACK-DELETE-MIRROR-SUCCESS
        (
          data: string
        ) => {
          const {
            mirrorsId
          } = socket.decompress<TYPEOF_LISTENER_PAYBACK_DELETE_MIRROR>(data);
          mirrorsId.forEach(mirrorId => handleDeleteUpload(mirrorId));
        }
      )

    socket
      .on(
        events[1], // * PAYBACK-DELETE-MIRROR-FAILURE
        (error: string) => console.error(error)
      )
  }
}