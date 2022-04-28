import { useState } from 'react'

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { GetServerSidePropsContext } from 'next/types'

import { useGetUserInfoService } from '@/services/graphql/useGetUserInfoService'

import { compressToEncodedURIComponent } from 'lz-string'

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import { BoxError } from '@/components/utils/BoxError'

import NoPrivilege, { handleClickFunction } from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'

import { PageProps } from '@/pages/_app'
import { GetMenuMain } from '@/bin/GetMenuMain'
import { PrivilegesSystem } from '@/types/UserType'

import { CostCenterType } from '@/types/CostCenterType'
import { B2Type } from '@/types/B2Type'

import { FunctionCreateCostCenterTypeof, FunctionDeleteCostCentersTypeof, FunctionUpdateCostCentersTypeof } from '@/types/CostCenterServiceType'
import { DataB2, FunctionCreateB2Typeof, FunctionUpdateB2AllTypeof } from '@/types/B2ServiceType'

import { useB2Service } from '@/services/useB2Service'
import { useB2AllService } from '@/services/useB2AllService'
import { useCostCenterService } from '@/services/useCostCenterService'
import { useCostCentersService } from '@/services/useCostCentersService'

import { SelectCostCenter } from '@/components/selects/SelectCostCenter'
import { ListWithCheckbox } from '@/components/lists/ListWithCheckbox'

import { DatePicker } from '@/components/selects/DatePicker'

import DateEx from '@/src/utils/dateEx'
import Alerting from '@/src/utils/alerting'

import getB2ForTable from '@/src/functions/getB2ForTable'
import { LayoutPayAlelo } from "@/src/utils/SheetEx"

const serverSideProps: PageProps = {
  title: 'Pagamentos/Cartões Benefício',
  description: 'Administração dos pagamentos de B2',
  themeColor: '#004a6e',
  menu: GetMenuMain('mn-payback')
}

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const privileges: PrivilegesSystem[] = [
    'administrador',
    'fin_gerente',
    'fin_faturamento',
    'fin_assistente'
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
  createCostCenter: FunctionCreateCostCenterTypeof,
  costCenters: CostCenterType[],
  isLoadingCostCenters: boolean,
  updateCostCenters: FunctionUpdateCostCentersTypeof,
  deleteCostCenters: FunctionDeleteCostCentersTypeof,
  costCenterId: string,
  handleChangeCostCenter: (id: string) => void,
  periodStart: Date,
  periodEnd: Date,
  handleChangePeriodStart: (date: Date) => void,
  handleChangePeriodEnd: (date: Date) => void,
  postings: B2Type[],
  createPosting: FunctionCreateB2Typeof,
  updatePostings: FunctionUpdateB2AllTypeof,
  selectedPostings: string[],
  handleChangeSelectedPostings: (selectedPostings: string[]) => void,
  showOnlyPaidPostings: boolean,
  showOnlyPendingPostings: boolean,
  handleChangeShowOnlyPaidPostings: (value: boolean) => void,
  handleChangeShowOnlyPendingPostings: (value: boolean) => void,
) {
  const
    postingsFiltered = postings.filter(posting => posting.paymentMethod === 'card'),
    { columns: postingsColumns, rows: postingsRows } =
      getB2ForTable(
        postingsFiltered.filter(
          posting => {
            if (
              posting.costCenterId === costCenterId &&
              !posting.onlyHistory &&
              DateEx.isWithinInterval(new Date(posting.periodStart), {
                start: periodStart,
                end: periodEnd
              }) &&
              DateEx.isWithinInterval(new Date(posting.periodEnd), {
                start: periodStart,
                end: periodEnd
              })
            ) {
              if (showOnlyPaidPostings && posting.paymentStatus === 'paid')
                return true
              else if (showOnlyPendingPostings && posting.paymentStatus === 'pending')
                return true
              else if (!showOnlyPaidPostings && !showOnlyPendingPostings)
                return true
              else
                return false
            }
          }
        )
      );

  return (
    <div className="row g-2">
      <div className="col-12">
        <div className="p-3 bg-primary bg-gradient rounded">
          <p className="text-center text-secondary fw-bold fs-5 my-2">
            <FontAwesomeIcon
              icon={Icon.render('fas', 'gear')}
              className="me-2 fs-3 flex-shrink-1 text-secondary my-auto"
            /> Pagar B2 (Cartões Alelo)
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
          Centro de Custo
        </p>
        <SelectCostCenter
          createCostCenter={createCostCenter}
          costCenter={undefined}
          isLoadingCostCenter={false}
          costCenters={costCenters}
          isLoadingCostCenters={isLoadingCostCenters}
          updateCostCenters={updateCostCenters}
          deleteCostCenters={deleteCostCenters}
          handleChangeId={handleChangeCostCenter}
        />
        <div className='d-flex flex-column flex-md-row my-2'>
          <DatePicker
            className="col px-2 my-2"
            label="Período de Apuração (Inicial)"
            value={periodStart}
            maxDate={periodEnd}
            minDate={DateEx.subDays(new Date(), 7)}
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
        <div className='d-flex flex-column p-2 border-top'>
          <p className="fw-bold border-bottom text-center my-2">
            Filtros
          </p>
          <FormGroup className='d-flex flex-row p-2'>
            <FormControlLabel
              control={<Checkbox defaultChecked={false} onChange={(e) => handleChangeShowOnlyPendingPostings(e.target.checked)} />}
              label="Exibir somente os pagamentos pendentes"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked={false} onChange={(e) => handleChangeShowOnlyPaidPostings(e.target.checked)} />}
              label="Exibir somente os pagamentos efetuados"
            />
          </FormGroup>
        </div>
        <ListWithCheckbox
          title='Pagamentos no Cartão Alelo (B2)'
          messages={{
            emptyDataSourceMessage: 'Nenhum lançamento para pagamento encontrado.',
          }}
          columns={postingsColumns}
          data={postingsRows}
          onChangeSelection={handleChangeSelectedPostings}
        />
        <button
          type="button"
          className="btn btn-link ms-3"
          disabled={selectedPostings.length <= 0 || selectedPostings.filter(id => postings.some(posting => posting.id === id && posting.paymentStatus === 'paid')).length > 0}
          onClick={() => {
            if (postingsFiltered.length > 0) {
              const
                rows: LayoutPayAlelo[] = [],
                errors: string[] = [];

              for (const posting of postingsFiltered) {
                if (posting.personB2.person.cards[0].unlocked && posting.personB2.person.cards[0].status === 'available') {
                  rows.push({
                    serialNumber: posting.personB2.person.cards[0].serialNumber,
                    cpf: posting.personB2.person.cpf,
                    value: posting.paymentValue.toString().replace('.', ','),
                    description: posting.description || `Crédito referente ao pagamento de B2 do periodo ${periodStart.toLocaleDateString()} a ${periodEnd.toLocaleDateString()}`,
                  })
                } else {
                  errors.push(`O cartão do(a) ${posting.personB2.person.name} não está desbloqueado ou está cancelado.`);
                }
              }

              if (errors.length > 0)
                errors.forEach(error => Alerting.create('warning', error, 3600));

              if (rows.length <= 0)
                return Alerting.create('warning', 'Nenhum pagamento foi gerado, verifique o desbloqueio dos cartões.', 3600);

              const
                costCenterName = costCenters.find(_ => _.id === costCenterId)?.value || '???',
                filename = `Pagamentos Alelo B2 - ${costCenterName} (${periodStart.toLocaleDateString()} - ${periodEnd.toLocaleDateString()})`;

              window.open(`/api/alelo/pay?periodStart=${periodStart.toLocaleDateString()}&periodEnd=${periodEnd.toLocaleDateString()}&filename=${filename}&rows=${JSON.stringify(rows)}`);
            }
          }}
        >
          <FontAwesomeIcon
            icon={Icon.render('fas', 'gear')}
            className="me-1 flex-shrink-1 my-auto"
          /> Gerar arquivo de pagamento
        </button>
        <button
          type="button"
          className="btn btn-link ms-3"
          disabled={selectedPostings.length <= 0 || selectedPostings.filter(id => postings.some(posting => posting.id === id && posting.paymentStatus === 'paid')).length > 0}
          onClick={async () => {
            if (!updatePostings || !createPosting)
              return Alerting.create('error', 'Não foi possível confirmar o(s) pagamento(s). Tente novamente, mais tarde!');

            for (const postingId of selectedPostings) {
              const posting = postings.find(_ => _.id === postingId);

              if (!posting)
                return Alerting.create('error', 'Não foi possível confirmar o(s) pagamento(s). Tente novamente, mais tarde!');

              if (
                posting.personB2.person.cards[0].status !== 'available' ||
                !posting.personB2.person.cards[0].unlocked
              )
                return Alerting.create('error', 'Não foi possível confirmar o(s) pagamento(s). Existens cartões cancelados e/ou bloqueados!');

              const
                newPosting: DataB2 = {
                  ...posting,
                  paymentStatus: 'paid',
                  paymentDatePaid: new Date().toISOString()
                },
                create = await createPosting({ ...newPosting, onlyHistory: true }),
                paid = await updatePostings(postingId, newPosting);

              if (!paid || !create)
                return Alerting.create('error', `Ocorreu um erro com o pagamento do B2 do(a) ${posting.personB2.person.name}, ele não foi confirmado. Fale com o administrador do sistema.`);

              Alerting.create('success', `Pagamento do B2 do(a) ${posting.personB2.person.name} confirmado com sucesso!`);
            }
          }}
        >
          <FontAwesomeIcon
            icon={Icon.render('fas', 'circle-check')}
            className="me-1 flex-shrink-1 my-auto"
          /> Confirmar Pagamento(s)
        </button>
      </div>
    </div>
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

  const [costCenterId, setCostCenterId] = useState<string>('')
  const [periodStart, setPeriodStart] = useState<Date>(new Date())
  const [periodEnd, setPeriodEnd] = useState<Date>(new Date())

  const [selectedPostings, setSelectedPostings] = useState<string[]>([]);
  const [showOnlyPaidPostings, setShowOnlyPaidPostings] = useState<boolean>(false);
  const [showOnlyPendingPostings, setShowOnlyPendingPostings] = useState<boolean>(false);

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
    { create: CreateB2 } = useB2Service(),
    { data: postings, isLoading: isLoadingPostings, update: UpdatePostings } = useB2AllService(),
    { create: CreateCostCenter } = useCostCenterService(),
    { data: costCenters, isLoading: isLoadingCostCenters, update: UpdateCostCenters, delete: DeleteCostCenters } = useCostCentersService();

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
    handleClickBackPage = () => router.push('/payback/cards'),
    handleChangeCostCenter = (id: string) => setCostCenterId(id),
    handleChangePeriodStart = (date: Date) => setPeriodStart(date),
    handleChangePeriodEnd = (date: Date) => setPeriodEnd(date),
    handleChangePostingsSelected = (postings: string[]) => setSelectedPostings(postings),
    handleChangeShowOnlyPaidPostings = (value: boolean) => setShowOnlyPaidPostings(value),
    handleChangeShowOnlyPendingPostings = (value: boolean) => setShowOnlyPendingPostings(value);

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
    || isLoadingCostCenters && !syncData
  )
    return compose_load();

  if (
    !syncData
    && postings
    && costCenters
  ) {
    setSyncData(true);
  } else if (
    !syncData && !UpdatePostings
    || !syncData && !postings
    || !syncData && !costCenters
    || !syncData && !UpdateCostCenters
    || !syncData && !DeleteCostCenters
  ) {
    return <BoxError />
  }

  if (loading) return compose_load()

  if (notPrivilege) return compose_noPrivilege(handleClickNoPrivilege)

  if (notAuth) return compose_noAuth(handleClickNoAuth)

  if (isReady) return compose_ready(
    handleClickBackPage,
    CreateCostCenter,
    costCenters,
    isLoadingCostCenters,
    UpdateCostCenters,
    DeleteCostCenters,
    costCenterId,
    handleChangeCostCenter,
    periodStart,
    periodEnd,
    handleChangePeriodStart,
    handleChangePeriodEnd,
    postings,
    CreateB2,
    UpdatePostings,
    selectedPostings,
    handleChangePostingsSelected,
    showOnlyPaidPostings,
    showOnlyPendingPostings,
    handleChangeShowOnlyPaidPostings,
    handleChangeShowOnlyPendingPostings,
  )
}