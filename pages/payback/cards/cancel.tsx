import { useState } from 'react';

import { GetServerSidePropsContext } from 'next/types'

import { useGetUserInfoService } from '@/services/graphql/useGetUserInfoService'

import { compressToEncodedURIComponent } from 'lz-string'

import { Offcanvas } from 'react-bootstrap';

import { useRouter } from 'next/router';

import SkeletonLoader from 'tiny-skeleton-loader-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Icon from '@/src/utils/fontAwesomeIcons';

import NoPrivilege, { handleClickFunction } from '@/components/noPrivilege';
import NoAuth from '@/components/noAuth';

import { SelectCostCenter } from '@/components/selects/SelectCostCenter'
import { ListWithFiveColumns } from '@/components/lists/ListWithFiveColumns';

import { BoxError } from '@/components/utils/BoxError';

import { PageProps } from '@/pages/_app';
import { GetMenuMain } from '@/bin/GetMenuMain';
import { PrivilegesSystem } from '@/types/UserType'

import Alerting from '@/src/utils/alerting';
import StringEx from '@/src/utils/stringEx';

import { CardType } from '@/types/CardType';
import { CostCenterType } from '@/types/CostCenterType';
import { PostingType } from '@/types/PostingType'

import { FunctionCreateCostCenterTypeof, FunctionDeleteCostCentersTypeof, FunctionUpdateCostCentersTypeof } from '@/types/CostCenterServiceType'

import { useCostCenterService } from '@/services/useCostCenterService'
import { useCardsService } from '@/services/useCardsService';
import { useCostCentersService } from '@/services/useCostCentersService';
import { usePostingsService } from '@/services/usePostingsService';

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
  postings: PostingType[],
  createCostCenter: FunctionCreateCostCenterTypeof,
  costCenters: CostCenterType[],
  isLoadingCostCenters: boolean,
  updateCostCenters: FunctionUpdateCostCentersTypeof,
  deleteCostCenters: FunctionDeleteCostCentersTypeof,
  costCenterId: string,
  handleChangeCostCenter: (id: string) => void,
  updateMultipleLotItems: (items: string[]) => void,
  updateLotItem: (id: string) => void,
  showCanvasDateInfo: boolean,
  showCanvasUserInfo: boolean,
  openCanvasDateInfo: () => void,
  closeCanvasDateInfo: () => void,
  openCanvasUserInfo: () => void,
  closeCanvasUserInfo: () => void,
  textTitleCanvasDateInfo: string,
  textCreatedAtCanvasDateInfo: string,
  textNameCanvasUserInfo: string,
  textMatriculeCanvasUserInfo: string,
  handleChangeTextTitleCanvasDateInfo: (text: string) => void,
  handleChangeTextCreatedAtCanvasDateInfo: (text: string) => void,
  handleChangeTextNameCanvasUserInfo: (text: string) => void,
  handleChangeTextMatriculeCanvasUserInfo: (text: string) => void,
) {
  const
    cardsFiltered = cards.filter(card =>
      card.costCenterId === costCenterId && card.person
      && postings.filter(posting =>
        posting.paymentStatus === 'pending'
        && posting.coverage.person.cards.map(_ => _.id).includes(card.id)
      ).length <= 0
    );

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
              Cancelamento dos Cartões Alelo
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
          <p className="fw-bold border-bottom text-center my-2">
            Cartões Disponíveis
          </p>
          {canvas_dateInfo(
            showCanvasDateInfo,
            closeCanvasDateInfo,
            textTitleCanvasDateInfo,
            textCreatedAtCanvasDateInfo
          )}
          {canvas_userInfo(
            showCanvasUserInfo,
            closeCanvasUserInfo,
            textNameCanvasUserInfo,
            textMatriculeCanvasUserInfo
          )}
          <ListWithFiveColumns
            noItemsMessage='Nenhum cartão disponível.'
            pagination={{
              page: 1,
              limit: 10,
              paginationLimit: 10
            }}
            columns={[
              {
                title: 'Código do Lote',
                size: '2'
              },
              {
                title: 'Número de Série',
                size: '3'
              },
              {
                title: 'Centro de Custo',
                size: '2'
              },
              {
                title: '4 Últimos Dígitos do Cartão',
                size: ''
              }
            ]}
            actionMenu={{
              actions: [
                {
                  title: 'Cancelar',
                  icon: {
                    prefix: 'fas',
                    name: 'cancel'
                  },
                  enabled: true,
                  handleClick: (items) => {
                    if (!items) return;

                    const filter = items.filter(item => {
                      const card = cardsFiltered.find(card => `${card.serialNumber} - ${card.lastCardNumber}` === item);

                      if (card && card.unlocked && card.status === 'available')
                        return true;

                      return false;
                    });

                    if (filter.length > 0)
                      updateMultipleLotItems(filter)
                    else
                      Alerting.create('warning', 'Nenhum cartão pode ser cancelado.')
                  }
                },
              ]
            }}
            lines={[...cardsFiltered]
              // ? Classifica os itens disponíveis
              .filter(item => item.status === 'available')
              // ? Classifica por data de criação
              .sort((a, b) => {
                if (new Date(a.createdAt) < new Date(b.createdAt))
                  return 1;
                else if (new Date(a.createdAt) === new Date(b.createdAt))
                  return 0;
                else
                  return -1;
              })
              // ? Classifica por Centro de Custo
              .sort((a, b) => {
                const
                  costCenterA = costCenters.find(c => c.id === a.costCenterId)?.value || "???",
                  costCenterB = costCenters.find(c => c.id === b.costCenterId)?.value || "???";

                return costCenterA.localeCompare(costCenterB);
              })
              .map((item: CardType) => {
                return {
                  id: `${item.serialNumber} - ${item.lastCardNumber}`,
                  values: [
                    {
                      data: item.lotNum,
                      size: '2'
                    },
                    {
                      data: item.serialNumber,
                      size: '3'
                    },
                    {
                      data: item.costCenter.value,
                      size: '2'
                    },
                    {
                      data: item.lastCardNumber,
                      size: '2'
                    }
                  ],
                  actions: [
                    {
                      icon: {
                        prefix: 'fas',
                        name: 'calendar-day'
                      },
                      enabled: true,
                      handleClick: () => {
                        handleChangeTextTitleCanvasDateInfo(`Número de Série: ${item.serialNumber}`);
                        handleChangeTextCreatedAtCanvasDateInfo(StringEx.createdAt(item.createdAt));
                        openCanvasDateInfo();
                      },
                      popover: {
                        title: 'Data de Criação',
                      }
                    },
                    {
                      icon: {
                        prefix: 'fas',
                        name: 'user-tag'
                      },
                      enabled: item.person ? true : false,
                      handleClick: () => {
                        if (item.person) {
                          handleChangeTextNameCanvasUserInfo(`${item.person.name}`);
                          handleChangeTextMatriculeCanvasUserInfo(`Matrícula: ${item.person.matricule}`);
                          openCanvasUserInfo();
                        }
                      },
                      popover: {
                        title: 'Usuário Atribuído',
                      }
                    },
                    {
                      icon: {
                        prefix: 'fas',
                        name: 'cancel'
                      },
                      enabled: item.status === 'available',
                      handleClick: () => {
                        if (item.status === 'unavailable')
                          return Alerting.create('info', 'O cartão já está cancelado.');

                        if (!item.unlocked || item.status !== 'available')
                          return Alerting.create('error', 'O cartão não pode ser cancelado.');

                        updateLotItem(item.id);
                      },
                      popover: {
                        title: 'Cancele o cartão',
                      }
                    }
                  ]
                }
              })}
          />
        </div>
      </div>
    </>
  )
}

function canvas_dateInfo(
  show: boolean,
  handleClose: () => void,
  textTitle: string,
  createdAt: string
) {
  return (
    <Offcanvas show={show} onHide={handleClose} placement='end'>
      <Offcanvas.Header className='bg-primary bg-gradient fw-bold text-secondary' closeButton closeVariant='white'>
        <Offcanvas.Title className='text-truncate'>{textTitle}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="input-group my-3">
          <span className="input-group-text" id="createdAt-addon1">
            <FontAwesomeIcon
              icon={Icon.render('fas', 'calendar-day')}
              className="me-2 fs-3 flex-shrink-1 text-primary my-auto"
            />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Data de Criação"
            aria-label="Data de Criação"
            aria-describedby="createdAt-addon1"
            value={createdAt}
            readOnly={true}
          />
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

function canvas_userInfo(
  show: boolean,
  handleClose: () => void,
  name: string,
  matricule: string
) {
  return (
    <Offcanvas show={show} onHide={handleClose} placement='end'>
      <Offcanvas.Header className='bg-primary bg-gradient fw-bold text-secondary' closeButton closeVariant='white'>
        <Offcanvas.Title className='text-truncate'>{name}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="input-group my-3">
          <span className="input-group-text" id="createdAt-addon1">
            <FontAwesomeIcon
              icon={Icon.render('fas', 'id-card')}
              className="me-2 fs-3 flex-shrink-1 text-primary my-auto"
            />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Matrícula"
            aria-label="Matrícula"
            aria-describedby="matricule-addon"
            value={matricule}
            readOnly={true}
          />
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default function Cancel(
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

  const [showCanvasDateInfo, setShowModalDateInfo] = useState<boolean>(false)
  const [textTitleCanvasDateInfo, setTextTitleCanvasDateInfo] = useState<string>('')
  const [textCreatedAtCanvasDateInfo, setTextCreatedAt] = useState<string>('')

  const [showCanvasUserInfo, setShowModalUserInfo] = useState<boolean>(false)
  const [textNameCanvasUserInfo, setTextNameCanvasUserInfo] = useState<string>('')
  const [textMatriculeCanvasUserInfo, setTextMatriculeCanvasUserInfo] = useState<string>('')

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
    { data: costCenters, isLoading: isLoadingCostCenters, update: UpdateCostCenters, delete: DeleteCostCenters } = useCostCentersService(),
    { data: postings, isLoading: isLoadingPostings } = usePostingsService();

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
    updateMultipleLotItems = async (cardIds: string[]) => cardIds.forEach(async (id) => await updateLotItem(id)),
    updateLotItem = async (id: string) => {
      if (UpdateCards) {
        const card = cards.find(card => card.id === id);

        if (card) {
          const
            update = await UpdateCards(id, {
              ...card,
              personId: null,
              status: 'unavailable'
            });

          if (update)
            return Alerting.create('success', 'Cartão cancelado com sucesso!');
        }
      }
    },
    openCanvasDateInfo = () => setShowModalDateInfo(true),
    closeCanvasDateInfo = () => setShowModalDateInfo(false),
    openCanvasUserInfo = () => setShowModalUserInfo(true),
    closeCanvasUserInfo = () => setShowModalUserInfo(false),
    handleChangeTextTitleCanvasDateInfo = (text: string) => setTextTitleCanvasDateInfo(text),
    handleChangeTextCreatedAtCanvasDateInfo = (text: string) => setTextCreatedAt(text),
    handleChangeTextNameCanvasUserInfo = (text: string) => setTextNameCanvasUserInfo(text),
    handleChangeTextMatriculeUserInfo = (text: string) => setTextMatriculeCanvasUserInfo(text);

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
    isLoadingCostCenters && !syncData ||
    isLoadingPostings && !syncData
  )
    return compose_load();

  if (
    !syncData
    && cards
    && costCenters
    && postings
  ) {
    setSyncData(true);
  } else if (
    !syncData && !cards
    || !syncData && !UpdateCards
    || !syncData && !costCenters
    || !syncData && !UpdateCostCenters
    || !syncData && !DeleteCostCenters
    || !syncData && !postings
  ) {
    return <BoxError />;
  }

  if (loading) return compose_load()

  if (notPrivilege) return compose_noPrivilege(handleClickNoPrivilege)

  if (notAuth) return compose_noAuth(handleClickNoAuth)

  if (isReady) return compose_ready(
    handleClickBackPage,
    cards,
    postings,
    CreateCostCenter,
    costCenters,
    isLoadingCostCenters,
    UpdateCostCenters,
    DeleteCostCenters,
    costCenterId,
    handleChangeCostCenter,
    updateMultipleLotItems,
    updateLotItem,
    showCanvasDateInfo,
    showCanvasUserInfo,
    openCanvasDateInfo,
    closeCanvasDateInfo,
    openCanvasUserInfo,
    closeCanvasUserInfo,
    textTitleCanvasDateInfo,
    textCreatedAtCanvasDateInfo,
    textNameCanvasUserInfo,
    textMatriculeCanvasUserInfo,
    handleChangeTextTitleCanvasDateInfo,
    handleChangeTextCreatedAtCanvasDateInfo,
    handleChangeTextNameCanvasUserInfo,
    handleChangeTextMatriculeUserInfo,
  )
}