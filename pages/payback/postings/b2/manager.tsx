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
import { ListWithCheckboxMUI } from '@/components/lists/ListWithCheckboxMUI'

import { BoxError } from '@/components/utils/BoxError'

import { RegisterB2 } from '@/components/modals/RegisterB2'
import { EditB2 } from '@/components/modals/EditB2'

import { PageProps } from '@/pages/_app'
import { GetMenuMain } from '@/bin/GetMenuMain'
import { PrivilegesSystem } from '@/types/UserType'

import StringEx from '@/src/utils/stringEx'
import DateEx from '@/src/utils/dateEx'
import Alerting from '@/src/utils/alerting'

import getB2ForTable from '@/src/functions/getB2ForTable'

import { CostCenterType } from '@/types/CostCenterType'
import { B2Type } from '@/types/B2Type'
import { PersonB2Type } from '@/types/PersonB2Type'
import { PersonType } from '@/types/PersonType'
import { WorkplaceType } from '@/types/WorkplaceType'

import { useCostCentersService } from '@/services/useCostCentersService'
import { useB2Service } from '@/services/useB2Service'
import { useB2AllService } from '@/services/useB2AllService'
import { usePersonB2Service } from '@/services/usePersonB2Service'
import { usePeopleB2Service } from '@/services/usePeopleB2Service'
import { usePeopleService } from '@/services/usePeopleService'
import { useWorkplacesService } from '@/services/useWorkplacesService'

import {
  FunctionCreateB2Typeof,
  FunctionUpdateB2AllTypeof,
  FunctionDeleteB2AllTypeof,
} from '@/types/B2ServiceType'

import {
  FunctionCreatePersonB2Typeof,
  FunctionDeletePeopleB2Typeof
} from '@/types/PersonB2ServiceType'


const serverSideProps: PageProps = {
  title: 'Pagamentos/Lançamentos Operacionais',
  description: 'Lançamentos Operacionais',
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
  pageSize: number,
  pageSizeOptions: number[],
  handleChangePageSize: (size: number) => void,
  costCenter: string,
  costCenters: CostCenterType[],
  periodStart: Date,
  periodEnd: Date,
  handleChangeCostCenter: (id: string) => void,
  handleChangePeriodStart: (value: Date) => void,
  handleChangePeriodEnd: (value: Date) => void,
  postings: B2Type[],
  peopleB2: PersonB2Type[],
  createPosting: FunctionCreateB2Typeof,
  createPersonB2: FunctionCreatePersonB2Typeof,
  updatePostings: FunctionUpdateB2AllTypeof,
  deletePostings: FunctionDeleteB2AllTypeof,
  deletePeopleB2: FunctionDeletePeopleB2Typeof,
  postingsSelected: string[],
  handleChangePostingsSelected: (postings: string[]) => void,
  openModalRegisterB2: boolean,
  openModalEditB2: boolean,
  handleOpenModalRegisterB2: () => void,
  handleCloseModalRegisterB2: () => void,
  handleOpenModalEditB2: () => void,
  handleCloseModalEditB2: () => void,
  people: PersonType[],
  workplaces: WorkplaceType[],
) {
  const
    { columns: postingsColumns, rows: postingsRows } =
      getB2ForTable(
        postings
          .filter(posting => posting.costCenterId === costCenter)
      );

  const postingSelected = postingsSelected.length > 0 ? postings.find(posting => posting.id === postingsSelected[0]) : null;

  return (
    <>
      <RegisterB2
        author={auth}
        periodStart={periodStart}
        periodEnd={periodEnd}
        costCenterId={costCenter}
        people={people.filter(person => !postings.find(posting => posting.personB2.person.id === person.id))}
        workplaces={workplaces}
        createPosting={createPosting}
        createPersonB2={createPersonB2}
        open={openModalRegisterB2}
        onClose={handleCloseModalRegisterB2}
      />
      {
        postingSelected &&
        <EditB2
          id={postingSelected.id}
          author={postingSelected.author}
          periodStart={periodStart}
          periodEnd={periodEnd}
          costCenterId={postingSelected.costCenterId}
          personB2Id={postingSelected.personId}
          personId={postingSelected.personB2.person.id}
          roleGratification={postingSelected.roleGratification}
          workplaceOriginId={postingSelected.workplaceOriginId}
          workplaceDestinationId={postingSelected.workplaceDestinationId}
          coverageStartedAt={new Date(postingSelected.coverageStartedAt)}
          entryTime={new Date(postingSelected.entryTime)}
          exitTime={new Date(postingSelected.exitTime)}
          valueClosed={postingSelected.valueClosed}
          absences={postingSelected.absences}
          lawdays={postingSelected.lawdays}
          level={postingSelected.level}
          paymentMethod={postingSelected.paymentMethod}
          paymentDatePayable={new Date(postingSelected.paymentDatePayable)}
          postingDescription={postingSelected.description || ""}
          people={people}
          workplaces={workplaces}
          updatePosting={updatePostings}
          open={openModalEditB2}
          onClose={handleCloseModalEditB2}
        />
      }
      <div className="row g-2">
        <div className="col-12">
          <div className="p-3 bg-primary bg-gradient rounded">
            <p className="text-center text-secondary fw-bold fs-5 my-2">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'gear')}
                className="me-2 fs-3 flex-shrink-1 text-secondary my-auto"
              /> Controle dos B2
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
          <p className="fw-bold border-bottom text-center my-2">
            Lançamentos
          </p>
          <ListWithCheckboxMUI
            columns={postingsColumns}
            rows={postingsRows}
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            deepCompare={true}
            onChangeSelection={handleChangePostingsSelected}
            onPageSizeChange={handleChangePageSize}
          />
          <div className='d-flex flex-column flex-md-row'>
            <button
              type="button"
              className="btn btn-link"
              disabled={costCenter.length <= 0}
              onClick={handleOpenModalRegisterB2}
            >
              <FontAwesomeIcon
                icon={Icon.render('fas', 'plus-square')}
                className="me-1 flex-shrink-1 my-auto"
              /> Adicionar
            </button>
            <button
              type="button"
              className="btn btn-link"
              disabled={postingsSelected.length <= 0 || postingsSelected.length > 1}
              onClick={handleOpenModalEditB2}
            >
              <FontAwesomeIcon
                icon={Icon.render('fas', 'edit')}
                className="me-1 flex-shrink-1 my-auto"
              /> Atualizar
            </button>
            <button
              type="button"
              className="btn btn-link"
              disabled={postingsSelected.length <= 0}
              onClick={async () => {
                postingsSelected.forEach(async (postingId) => {
                  if (!deletePostings || !deletePeopleB2)
                    return Alerting.create('error', 'Não é possível remover o B2. Tente novamente, mais tarde!');

                  const
                    person = postings.find(posting => posting.id === postingId)?.personB2.person,
                    personId = postings.find(posting => posting.id === postingId)?.personId,
                    deleted = await deletePostings(postingId);

                  if (!personId || !person)
                    return Alerting.create('error', 'Não é possível remover a pessoa do B2. Tente novamente, mais tarde!');

                  if (!deleted)
                    return Alerting.create('error', 'Não é possível remover o B2. Tente novamente, mais tarde!');

                  const deletedPerson = await deletePeopleB2(personId);

                  if (!deletedPerson)
                    return Alerting.create('error', 'Não é possível remover a pessoa do B2. Tente novamente, mais tarde!');

                  Alerting.create('success', `B2 do(a) ${person.name} removido com sucesso!`);
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

  const [pageSize, setPageSize] = useState<number>(10)

  const pageSizeOptions = [10, 20, 50, 100];

  const [postingsSelected, setPostingsSelected] = useState<string[]>([]);

  const [openModalRegisterB2, setOpenModalRegisterB2] = useState<boolean>(false)
  const [openModalEditB2, setOpenModalEditB2] = useState<boolean>(false)

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
    { create: CreateB2 } = useB2Service(),
    { create: CreatePersonB2 } = usePersonB2Service(),
    { data: postings, isLoading: isLoadingB2, update: UpdateB2, delete: DeleteB2 } = useB2AllService(),
    { data: peopleB2, isLoading: isLoadingPeopleB2, delete: DeletePeopleB2 } = usePeopleB2Service(),
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
    handleChangePageSize = (size: number) => setPageSize(size),
    handleChangePostingsSelected = (postings: string[]) => setPostingsSelected(postings),
    handleOpenModalRegisterB2 = () => setOpenModalRegisterB2(true),
    handleCloseModalRegisterB2 = () => setOpenModalRegisterB2(false),
    handleOpenModalEditB2 = () => setOpenModalEditB2(true),
    handleCloseModalEditB2 = () => setOpenModalEditB2(false);

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
    || isLoadingB2 && !syncData
    || isLoadingPeopleB2 && !syncData
    || isLoadingPeople && !syncData
    || isLoadingWorkplaces && !syncData
  )
    return compose_load();

  if (
    !syncData
    && costCenters
    && postings
    && peopleB2
    && people
    && workplaces
  ) {
    setSyncData(true);
  } else if (
    !syncData && !costCenters
    || !syncData && !postings
    || !syncData && !UpdateB2
    || !syncData && !DeleteB2
    || !syncData && !peopleB2
    || !syncData && !DeletePeopleB2
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
    pageSize,
    pageSizeOptions,
    handleChangePageSize,
    costCenter,
    costCenters,
    periodStart,
    periodEnd,
    handleChangeCostCenter,
    handleChangePeriodStart,
    handleChangePeriodEnd,
    postings,
    peopleB2,
    CreateB2,
    CreatePersonB2,
    UpdateB2,
    DeleteB2,
    DeletePeopleB2,
    postingsSelected,
    handleChangePostingsSelected,
    openModalRegisterB2,
    openModalEditB2,
    handleOpenModalRegisterB2,
    handleCloseModalRegisterB2,
    handleOpenModalEditB2,
    handleCloseModalEditB2,
    people,
    workplaces,
  )
}