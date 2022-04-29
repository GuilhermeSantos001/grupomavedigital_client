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

import NoPrivilege, { handleClickFunction } from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'

import { DatePicker } from '@/components/selects/DatePicker'
import { ListWithCheckbox } from '@/components/lists/ListWithCheckbox'

import { BoxError } from '@/components/utils/BoxError'

import { RegisterPackageHours } from '@/components/modals/RegisterPackageHours'
import { EditPackageHours } from '@/components/modals/EditPackageHours'

import { PageProps } from '@/pages/_app'
import { GetMenuMain } from '@/bin/GetMenuMain'
import { PrivilegesSystem } from '@/types/UserType'

import StringEx from '@/src/utils/stringEx'
import DateEx from '@/src/utils/dateEx'
import Alerting from '@/src/utils/alerting'

import getPackageHoursForTable from '@/src/functions/getPackageHoursForTable'

import { CostCenterType } from '@/types/CostCenterType'
import { PackageHoursType } from '@/types/PackageHoursType'
import { PersonPHType } from '@/types/PersonPHType'
import { PersonB2Type } from '@/types/PersonB2Type'
import { PersonType } from '@/types/PersonType'
import { WorkplaceType } from '@/types/WorkplaceType'

import { useCostCentersService } from '@/services/useCostCentersService'
import { usePackageHoursService } from '@/services/usePackageHoursService'
import { usePackageHoursAllService } from '@/services/usePackageHoursAllService'
import { usePersonPHService } from '@/services/usePersonPHService'
import { usePeoplePHService } from '@/services/usePeoplePHService'
import { usePeopleB2Service } from '@/services/usePeopleB2Service'
import { usePeopleService } from '@/services/usePeopleService'
import { useWorkplacesService } from '@/services/useWorkplacesService'

import {
  FunctionCreatePackageHoursTypeof,
  FunctionUpdatePackageHoursAllTypeof,
  FunctionDeletePackageHoursAllTypeof,
} from '@/types/PackageHoursServiceType'

import {
  FunctionCreatePersonPHTypeof,
  FunctionDeletePeoplePHTypeof,
} from '@/types/PersonPHServiceType'


const serverSideProps: PageProps = {
  title: 'Operacional/Pacote de Horas',
  description: 'Administração dos contratos de Pacote de Horas',
  themeColor: '#004a6e',
  menu: GetMenuMain('mn-payback')
}

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const privileges: PrivilegesSystem[] = [
    'administrador',
    'ope_gerente',
    'ope_coordenador'
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

// TODO: Implementar o esqueleto de loading da página
function compose_load() {
  return (
    <div>
      <div className="d-block d-md-none">
        <div className="col-12">
          <div className="d-flex flex-column p-2">
            <div className="col-12 px-2">
              <SkeletonLoader
                width={'100%'}
                height={'10rem'}
                radius={10}
                circle={false}
                style={{ marginTop: '0.1rem' }}
              />
              <SkeletonLoader
                width={'100%'}
                height={'10rem'}
                radius={10}
                circle={false}
                style={{ marginTop: '1rem' }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="d-none d-md-flex">
        <div className="col-12">
          <div className="row g-2">
            <div className="col-12 col-md-6">
              <div className="p-1">
                <SkeletonLoader
                  width={'100%'}
                  height={'10rem'}
                  radius={10}
                  circle={false}
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="p-1">
                <SkeletonLoader
                  width={'100%'}
                  height={'10rem'}
                  radius={10}
                  circle={false}
                />
              </div>
            </div>
          </div>
          <div className="col-12 p-2">
            <SkeletonLoader
              width={'100%'}
              height={'0.1rem'}
              radius={0}
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
  privileges: PrivilegesSystem[],
  auth: string,
  costCenter: string,
  costCenters: CostCenterType[],
  periodStart: Date,
  periodEnd: Date,
  handleChangeCostCenter: (id: string) => void,
  handleChangePeriodStart: (value: Date) => void,
  handleChangePeriodEnd: (value: Date) => void,
  postings: PackageHoursType[],
  peoplePH: PersonPHType[],
  peopleB2: PersonB2Type[],
  createPosting: FunctionCreatePackageHoursTypeof,
  createPersonPH: FunctionCreatePersonPHTypeof,
  updatePostings: FunctionUpdatePackageHoursAllTypeof,
  deletePostings: FunctionDeletePackageHoursAllTypeof,
  deletePeoplePH: FunctionDeletePeoplePHTypeof,
  postingsSelected: string[],
  handleChangePostingsSelected: (postings: string[]) => void,
  openModalRegisterPH: boolean,
  openModalEditPH: boolean,
  handleOpenModalRegisterPH: () => void,
  handleCloseModalRegisterPH: () => void,
  handleOpenModalEditPH: () => void,
  handleCloseModalEditPH: () => void,
  people: PersonType[],
  workplaces: WorkplaceType[],
) {
  const
    { columns: postingsColumns, rows: postingsRows } =
      getPackageHoursForTable(
        postings
          .filter(posting =>
            posting.costCenterId === costCenter &&
            !posting.onlyHistory
          )
      );

  const
    postingSelected = postingsSelected.length > 0 ? postings.find(posting => posting.id === postingsSelected[0]) : null,
    postingSelectedDeleted = postingsSelected.length > 0 ? postings.find(posting => posting.onlyHistory && posting.personId === postingSelected?.personId) : null,
    peopleFiltered = people.filter(person =>
      !peopleB2.find(peopleB2 => peopleB2.personId === person.id) &&
      !peoplePH.find(peoplePH => peoplePH.personId === person.id)
    )

  return (
    <>
      <RegisterPackageHours
        author={auth}
        periodStart={periodStart}
        periodEnd={periodEnd}
        costCenterId={costCenter}
        people={peopleFiltered}
        workplaces={workplaces}
        createPosting={createPosting}
        createPersonPH={createPersonPH}
        open={openModalRegisterPH}
        onClose={handleCloseModalRegisterPH}
      />
      {
        postingSelected &&
        <EditPackageHours
          id={postingSelected.id}
          author={postingSelected.author}
          periodStart={periodStart}
          periodEnd={periodEnd}
          costCenterId={postingSelected.costCenterId}
          personPHId={postingSelected.personId}
          personId={postingSelected.personPH.person.id}
          workplaceDestinationId={postingSelected.workplacePHDestinationId}
          contractStartedAt={new Date(postingSelected.contractStartedAt)}
          contractFinishAt={new Date(postingSelected.contractFinishAt)}
          entryTime={new Date(postingSelected.entryTime)}
          exitTime={new Date(postingSelected.exitTime)}
          valueClosed={postingSelected.valueClosed}
          jobTitle={postingSelected.jobTitle}
          lawdays={postingSelected.lawdays}
          paymentMethod={postingSelected.paymentMethod}
          paymentDatePayable={new Date(postingSelected.paymentDatePayable)}
          postingDescription={postingSelected.description || ""}
          people={people}
          workplaces={workplaces}
          updatePosting={updatePostings}
          deletePosting={deletePostings}
          isPossibleHandleDelete={postingSelectedDeleted ? true : false}
          open={openModalEditPH}
          onClose={handleCloseModalEditPH}
        />
      }
      <div className="row g-2">
        <div className="col-12">
          <div className="p-3 bg-primary bg-gradient rounded">
            <p className="text-center text-secondary fw-bold fs-5 my-2">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'gear')}
                className="me-2 fs-3 flex-shrink-1 text-secondary my-auto"
              /> Controle dos Pacote de Horas
            </p>
          </div>
          <button
            type="button"
            className="btn btn-link"
            onClick={handleClickBackPage}
          >
            Voltar
          </button>
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
              disabled={false}
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
              disabled={false}
              handleChangeValue={(value) => {
                if (
                  DateEx.isEqual(value, periodEnd) ||
                  DateEx.isBefore(value, periodEnd)
                ) {
                  handleChangePeriodStart(value);
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
              disabled={false}
              handleChangeValue={(value) => {
                if (
                  DateEx.isEqual(value, periodStart) ||
                  DateEx.isAfter(value, periodStart)
                ) {
                  handleChangePeriodEnd(value);
                } else {
                  Alerting.create('warning', `A data final não pode ser menor que a data inicial.`, 3600);
                }
              }}
            />
          </div>
          <ListWithCheckbox
            title='Pessoas no Pacote de Horas'
            messages={{
              emptyDataSourceMessage: 'Nenhuma pessoa encontrada.',
            }}
            columns={postingsColumns}
            data={postingsRows}
            deepCompare={true}
            onChangeSelection={handleChangePostingsSelected}
          />
          <div className='d-flex flex-column flex-md-row'>
            <button
              type="button"
              className="btn btn-link ms-3"
              disabled={costCenter.length <= 0 || peopleFiltered.length <= 0}
              onClick={handleOpenModalRegisterPH}
            >
              <FontAwesomeIcon
                icon={Icon.render('fas', 'plus-square')}
                className="me-1 flex-shrink-1 my-auto"
              /> Adicionar
            </button>
            <button
              type="button"
              className="btn btn-link ms-3"
              disabled={postingsSelected.length <= 0 || postingsSelected.length > 1}
              onClick={handleOpenModalEditPH}
            >
              <FontAwesomeIcon
                icon={Icon.render('fas', 'edit')}
                className="me-1 flex-shrink-1 my-auto"
              /> Atualizar
            </button>
            <button
              type="button"
              className="btn btn-link ms-3"
              disabled={postingsSelected.length <= 0}
              onClick={async () => {
                postingsSelected.forEach(async (postingId) => {
                  if (!deletePostings || !deletePeoplePH)
                    return Alerting.create('error', 'Não é possível remover o Pacote de Horas. Tente novamente, mais tarde!');

                  const
                    person = postings.find(posting => posting.id === postingId)?.personPH.person,
                    personId = postings.find(posting => posting.id === postingId)?.personId;

                  if (!personId || !person)
                    return Alerting.create('error', 'Não é possível remover a pessoa do Pacote de Horas. Tente novamente, mais tarde!');

                  if (postings.find(posting => posting.personId === personId && posting.onlyHistory))
                    return Alerting.create('error', 'Não é possível remover o Pacote de Horas que contém histórico de pagamento.');

                  const deleted = await deletePostings(postingId);

                  if (!deleted)
                    return Alerting.create('error', 'Não é possível remover o Pacote de Horas. Tente novamente, mais tarde!');

                  const deletedPerson = await deletePeoplePH(personId);

                  if (!deletedPerson)
                    return Alerting.create('error', 'Não é possível remover a pessoa do Pacote de Horas. Tente novamente, mais tarde!');

                  Alerting.create('success', `Pacote de Horas do(a) ${person.name} removido com sucesso!`);
                })
              }}
            >
              <FontAwesomeIcon
                icon={Icon.render('fas', 'minus-square')}
                className="me-1 flex-shrink-1 my-auto"
              /> Remover
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Manager(
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

  const [costCenter, setCostCenter] = useState<string>('')
  const [periodStart, setPeriodStart] = useState<Date>(new Date())
  const [periodEnd, setPeriodEnd] = useState<Date>(new Date())

  const [postingsSelected, setPostingsSelected] = useState<string[]>([]);

  const [openModalRegisterPH, setOpenModalRegisterPH] = useState<boolean>(false)
  const [openModalEditPH, setOpenModalEditPH] = useState<boolean>(false)

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
    { data: costCenters, isLoading: isLoadingCostCenters } = useCostCentersService(),
    { create: CreatePackageHours } = usePackageHoursService(),
    { create: CreatePersonPH } = usePersonPHService(),
    { data: postings, isLoading: isLoadingPH, update: UpdatePackageHours, delete: DeletePackageHours } = usePackageHoursAllService(),
    { data: peoplePH, isLoading: isLoadingPeoplePH, delete: DeletePeoplePH } = usePeoplePHService(),
    { data: peopleB2, isLoading: isLoadingPeopleB2 } = usePeopleB2Service(),
    { data: people, isLoading: isLoadingPeople } = usePeopleService(),
    { data: workplaces, isLoading: isLoadingWorkplaces } = useWorkplacesService()

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
      event.preventDefault();
      router.push(path);
    },
    handleClickBackPage = () => router.push('/payback/postings'),
    handleChangeCostCenter = (id: string) => setCostCenter(id),
    handleChangePeriodStart = (value: Date) => setPeriodStart(value),
    handleChangePeriodEnd = (value: Date) => setPeriodEnd(value),
    handleChangePostingsSelected = (postings: string[]) => setPostingsSelected(postings),
    handleOpenModalRegisterPH = () => setOpenModalRegisterPH(true),
    handleCloseModalRegisterPH = () => setOpenModalRegisterPH(false),
    handleOpenModalEditPH = () => setOpenModalEditPH(true),
    handleCloseModalEditPH = () => setOpenModalEditPH(false);

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
    isLoadingCostCenters && !syncData
    || isLoadingPH && !syncData
    || isLoadingPeoplePH && !syncData
    || isLoadingPeopleB2 && !syncData
    || isLoadingPeople && !syncData
    || isLoadingWorkplaces && !syncData
  )
    return compose_load();

  if (
    !syncData
    && costCenters
    && postings
    && peoplePH
    && peopleB2
    && people
    && workplaces
  ) {
    setSyncData(true);
  } else if (
    !syncData && !costCenters
    || !syncData && !postings
    || !syncData && !UpdatePackageHours
    || !syncData && !DeletePackageHours
    || !syncData && !peoplePH
    || !syncData && !DeletePeoplePH
    || !syncData && !peopleB2
    || !syncData && !people
    || !syncData && !workplaces
  ) {
    return <BoxError />
  }

  if (loading) return compose_load()

  if (notPrivilege) return compose_noPrivilege(handleClickNoPrivilege)

  if (notAuth) return compose_noAuth(handleClickNoAuth)

  if (isReady) return compose_ready(
    handleClickBackPage,
    data?.privileges as PrivilegesSystem[],
    auth,
    costCenter,
    costCenters,
    periodStart,
    periodEnd,
    handleChangeCostCenter,
    handleChangePeriodStart,
    handleChangePeriodEnd,
    postings,
    peoplePH,
    peopleB2,
    CreatePackageHours,
    CreatePersonPH,
    UpdatePackageHours,
    DeletePackageHours,
    DeletePeoplePH,
    postingsSelected,
    handleChangePostingsSelected,
    openModalRegisterPH,
    openModalEditPH,
    handleOpenModalRegisterPH,
    handleCloseModalRegisterPH,
    handleOpenModalEditPH,
    handleCloseModalEditPH,
    people,
    workplaces,
  )
}