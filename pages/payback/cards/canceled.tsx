import { useState } from 'react';

import { GetServerSidePropsContext } from 'next/types'

import { useGetUserInfoService } from '@/services/graphql/useGetUserInfoService'

import { compressToEncodedURIComponent } from 'lz-string'

import { useRouter } from 'next/router';

import SkeletonLoader from 'tiny-skeleton-loader-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Icon from '@/src/utils/fontAwesomeIcons';

import NoPrivilege, { handleClickFunction } from '@/components/noPrivilege';
import NoAuth from '@/components/noAuth';

import { SelectCostCenter } from '@/components/selects/SelectCostCenter'
import { ListWithCheckbox } from '@/components/lists/ListWithCheckbox'

import getCardsForTable from '@/src/functions/getCardsForTable'

import { BoxError } from '@/components/utils/BoxError';

import { PageProps } from '@/pages/_app';
import { GetMenuMain } from '@/bin/GetMenuMain';
import { PrivilegesSystem } from '@/types/UserType'

import { CardType } from '@/types/CardType';
import { CostCenterType } from '@/types/CostCenterType';

import { FunctionCreateCostCenterTypeof, FunctionDeleteCostCentersTypeof, FunctionUpdateCostCentersTypeof } from '@/types/CostCenterServiceType'

import { useCostCenterService } from '@/services/useCostCenterService'
import { useCardsService } from '@/services/useCardsService'
import { useCostCentersService } from '@/services/useCostCentersService'

const serverSideProps: PageProps = {
  title: 'Pagamentos/Cartões Benefício/Cancelamento',
  description: 'Cancelar os cartões beneficio',
  themeColor: '#004a6e',
  menu: GetMenuMain('mn-payback')
}

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const privileges: PrivilegesSystem[] = [
    'administrador',
    'fin_gerente',
    'fin_faturamento',
    'fin_assistente',
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
            <div className="col-2 my-2">
              <SkeletonLoader
                width={'100%'}
                height={'1.5rem'}
                radius={10}
                circle={false}
              />
            </div>
            <div className="col-6 align-self-center my-2">
              <SkeletonLoader
                width={'100%'}
                height={'1.5rem'}
                radius={10}
                circle={false}
              />
            </div>
            <div className="col-12 align-self-center my-2">
              <SkeletonLoader
                width={'100%'}
                height={'0.1rem'}
                radius={10}
                circle={false}
              />
            </div>
            <div className="col-12 align-self-center my-2">
              <SkeletonLoader
                width={'100%'}
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
            <div className='d-flex flex-column'>
              <div className="col-2">
                <div className="p-1">
                  <SkeletonLoader
                    width={'100%'}
                    height={'1.5rem'}
                    radius={10}
                    circle={false}
                  />
                </div>
              </div>
              <div className="col-6 align-self-center">
                <div className="p-1">
                  <SkeletonLoader
                    width={'100%'}
                    height={'1.5rem'}
                    radius={10}
                    circle={false}
                  />
                </div>
              </div>
              <div className="col-12 align-self-center">
                <div className="p-1">
                  <SkeletonLoader
                    width={'100%'}
                    height={'0.1rem'}
                    radius={10}
                    circle={false}
                  />
                </div>
              </div>
              <div className="col-12 align-self-center">
                <div className="p-1">
                  <SkeletonLoader
                    width={'100%'}
                    height={'6rem'}
                    radius={10}
                    circle={false}
                  />
                </div>
                <div className="p-1">
                  <SkeletonLoader
                    width={'100%'}
                    height={'0.1rem'}
                    radius={10}
                    circle={false}
                  />
                </div>
              </div>
              <div className="col-6 align-self-center">
                <div className="p-1">
                  <SkeletonLoader
                    width={'100%'}
                    height={'1.5rem'}
                    radius={10}
                    circle={false}
                  />
                </div>
              </div>
            </div>
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
  cards: CardType[],
  createCostCenter: FunctionCreateCostCenterTypeof,
  costCenters: CostCenterType[],
  isLoadingCostCenters: boolean,
  updateCostCenters: FunctionUpdateCostCentersTypeof,
  deleteCostCenters: FunctionDeleteCostCentersTypeof,
  costCenterId: string,
  handleChangeCostCenter: (id: string) => void
) {
  const
    cardsFiltered = cards.filter(card =>
      card.costCenterId === costCenterId && card.status === 'unavailable'
    ),
    { columns: cardsColumns, rows: cardsRows } = getCardsForTable(cardsFiltered);

  return (
    <>
      <div className="row g-2">
        <div className="col-12">
          <div className="p-3 bg-primary bg-gradient rounded">
            <p className="text-center text-secondary fw-bold fs-5 my-2">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'cancel')}
                className="me-2 fs-3 flex-shrink-1 text-secondary my-auto"
              />
              Cartões Alelo Cancelados
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
          <ListWithCheckbox
            title='Cartões Cancelados'
            messages={{
              emptyDataSourceMessage: 'Nenhum cartão cancelado.'
            }}
            columns={cardsColumns}
            data={cardsRows}
          />
        </div>
      </div>
    </>
  )
}

export default function Canceled(
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
  const [syncData, setSyncData] = useState<boolean>(false);

  const [isReady, setReady] = useState<boolean>(false)
  const [notPrivilege, setNotPrivilege] = useState<boolean>(false)
  const [notAuth, setNotAuth] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const [costCenterId, setCostCenterId] = useState<string>('')

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
    { data: cards, isLoading: isLoadingCards, update: UpdateCards } = useCardsService(),
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
    handleChangeCostCenter = (id: string) => setCostCenterId(id);

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
    isLoadingCards && !syncData ||
    isLoadingCostCenters && !syncData
  )
    return compose_load();

  if (
    !syncData
    && cards
    && costCenters
  ) {
    setSyncData(true);
  } else if (
    !syncData && !cards
    || !syncData && !UpdateCards
    || !syncData && !costCenters
    || !syncData && !UpdateCostCenters
    || !syncData && !DeleteCostCenters
  ) {
    return <BoxError />;
  }

  if (loading) return compose_load()

  if (notPrivilege) return compose_noPrivilege(handleClickNoPrivilege)

  if (notAuth) return compose_noAuth(handleClickNoAuth)

  if (isReady) return compose_ready(
    handleClickBackPage,
    cards,
    CreateCostCenter,
    costCenters,
    isLoadingCostCenters,
    UpdateCostCenters,
    DeleteCostCenters,
    costCenterId,
    handleChangeCostCenter,
  )
}