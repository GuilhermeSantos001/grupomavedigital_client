/**
 * @description Payback -> Cartões Beneficio (Alelo) -> Cadastro
 * @author GuilhermeSantos001
 * @update 18/01/2022
 */

import { useEffect, useState } from 'react'

import { Offcanvas } from 'react-bootstrap'

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import RenderPageError from '@/components/renderPageError'
import NoPrivilege from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'
import ListWithFiveColumns from '@/components/lists/listwithFiveColumns'

import { PageProps } from '@/pages/_app'
import PageMenu from '@/bin/main_menu'

import Fetch from '@/src/utils/fetch'
import Variables from '@/src/db/variables'
import { tokenValidate } from '@/src/functions/tokenValidate'
import hasPrivilege from '@/src/functions/hasPrivilege'
import Alerting from '@/src/utils/alerting'
import StringEx from '@/src/utils/stringEx'
import canDeleteLotItems from '@/src/functions/canDeleteLotItems'

import { useAppSelector, useAppDispatch } from '@/app/hooks'

import {
  LotItem,
  Posting,
  PaybackActions
} from '@/app/features/payback/payback.slice'

import {
  CostCenter,
  Person,
  SystemActions,
} from '@/app/features/system/system.slice'

const serverSideProps: PageProps = {
  title: 'Pagamentos/Cartões Benefício/Remoção',
  description: 'Remoção de cartões beneficio',
  themeColor: '#004a6e',
  menu: PageMenu('mn-payback')
}

export const getServerSideProps = async () => {
  return {
    props: {
      ...serverSideProps,
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

function compose_error(handleClick) {
  return <RenderPageError handleClick={handleClick} />
}

function compose_noPrivilege(handleClick) {
  return <NoPrivilege handleClick={handleClick} />
}

function compose_noAuth(handleClick) {
  return <NoAuth handleClick={handleClick} />
}

function compose_ready(
  handleClickBackPage: () => void,
  lotItems: LotItem[],
  postings: Posting[],
  costCenters: CostCenter[],
  people: Person[],
  updatePerson: (person: Person) => void,
  removeMultipleLotItems: (items: string[]) => void,
  removeLotItem: (id: string) => void,
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
  return (
    <>
      <div className="row g-2">
        <div className="col-12">
          <div className="p-3 bg-primary bg-gradient rounded">
            <p className="text-center text-secondary fw-bold fs-5 my-2">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'registered')}
                className="me-2 fs-3 flex-shrink-1 text-secondary my-auto"
              />
              Remover Lote
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
            Lotes Disponíveis
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
            noItemsMessage='Nenhum lote disponível.'
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
                  title: 'Deletar',
                  icon: {
                    prefix: 'fas',
                    name: 'trash'
                  },
                  enabled: true,
                  handleClick: (items) => {
                    const filter = items.filter(item => {
                      const lot = lotItems.find(lot => `${lot.id} - ${lot.lastCardNumber}` === item);

                      if (lot.status === 'available') {
                        const itemId = `${lot.id} - ${lot.lastCardNumber}`;

                        if (canDeleteLotItems(people, postings, itemId)) {
                          const person = people.find(person => person.id == lot.person);

                          updatePerson({
                            ...person,
                            cards: person.cards.filter(card => card != itemId)
                          });

                          return true;
                        }
                      }

                      return false;
                    });

                    if (filter.length > 0)
                      removeMultipleLotItems(filter)
                    else
                      Alerting.create('warning', 'Nenhum lote pode ser removido.')
                  }
                },
              ]
            }}
            lines={[...lotItems]
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
                  costCenterA = costCenters.find(c => c.id === a.costCenter).title,
                  costCenterB = costCenters.find(c => c.id === b.costCenter).title;

                return costCenterA.localeCompare(costCenterB);
              })
              .map(item => {
                return {
                  id: `${item.id} - ${item.lastCardNumber}`,
                  values: [
                    {
                      data: item.id,
                      size: '2'
                    },
                    {
                      data: item.serialNumber,
                      size: '3'
                    },
                    {
                      data: costCenters.find(costCenter => costCenter.id === item.costCenter).title,
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
                        description: 'Informações sobre a data de criação do lote.'
                      }
                    },
                    {
                      icon: {
                        prefix: 'fas',
                        name: 'user-tag'
                      },
                      enabled: item.person?.length > 0 ? true : false,
                      handleClick: () => {
                        handleChangeTextNameCanvasUserInfo(`${people.find(person => person.id === item.person).name}`);
                        handleChangeTextMatriculeCanvasUserInfo(`Matrícula: ${people.find(person => person.id === item.person).matricule}`);
                        openCanvasUserInfo();
                      },
                      popover: {
                        title: 'Usuário Atribuído',
                        description: 'Informações sobre o usuário atribuído ao lote.'
                      }
                    },
                    {
                      icon: {
                        prefix: 'fas',
                        name: 'trash'
                      },
                      enabled: item.status === 'available',
                      handleClick: () => {
                        if (item.status !== 'available')
                          return Alerting.create('error', 'O lote não pode ser removido.');

                        const itemId = `${item.id} - ${item.lastCardNumber}`;

                        if (canDeleteLotItems(people, postings, itemId)) {
                          if (item.person) {
                            const person = people.find(person => person.id == item.person);

                            updatePerson({
                              ...person,
                              cards: person.cards.filter(card => card != itemId)
                            });
                          }

                          removeLotItem(itemId);
                        } else {
                          Alerting.create('warning', 'Não é possível excluir o cartão. Existem pessoas usando esse cartão.')
                        }
                      },
                      popover: {
                        title: 'Remova o lote',
                        description: 'Você pode remover lotes que ainda estão disponíveis.'
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

export default function CardsRemove() {
  const [isReady, setReady] = useState<boolean>(false)
  const [isError, setError] = useState<boolean>(false)
  const [notPrivilege, setNotPrivilege] = useState<boolean>(false)
  const [notAuth, setNotAuth] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const [showCanvasDateInfo, setShowModalDateInfo] = useState<boolean>(false)
  const [textTitleCanvasDateInfo, setTextTitleCanvasDateInfo] = useState<string>('')
  const [textCreatedAtCanvasDateInfo, setTextCreatedAt] = useState<string>('')

  const [showCanvasUserInfo, setShowModalUserInfo] = useState<boolean>(false)
  const [textNameCanvasUserInfo, setTextNameCanvasUserInfo] = useState<string>('')
  const [textMatriculeCanvasUserInfo, setTextMatriculeCanvasUserInfo] = useState<string>('')

  const
    dispatch = useAppDispatch(),
    costCenters = useAppSelector((state) => state.system.costCenters || []),
    lotItems = useAppSelector((state) => state.payback.lotItems || []),
    postings = useAppSelector((state) => state.payback.postings || []),
    people = useAppSelector((state) => state.system.people || []);

  const router = useRouter()
  const _fetch = new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST)

  const
    handleClickNoAuth = async (e, path) => {
      e.preventDefault()

      if (path === '/auth/login') {
        const variables = new Variables(1, 'IndexedDB')
        await Promise.all([await variables.clear()]).then(() => {
          router.push(path)
        })
      }
    },
    handleClickNoPrivilege = async (e, path) => {
      e.preventDefault()
      router.push(path)
    },
    handleClickBackPage = () => router.push('/payback/cards'),
    updatePerson = (person: Person) => {
      try {
        dispatch(SystemActions.UPDATE_PERSON(person));
      } catch (error) {
        Alerting.create('error', error.message);
      }
    },
    removeMultipleLotItems = (ids: string[]) => ids.forEach(id => {
      try {
        dispatch(PaybackActions.DELETE_LOT(id));
      } catch (error) {
        Alerting.create('error', error.message);
      }
    }),
    removeLotItem = (id: string) => {
      try {
        dispatch(PaybackActions.DELETE_LOT(id));
      } catch (error) {
        Alerting.create('error', error.message);
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

  useEffect(() => {
    const timer = setTimeout(async () => {
      const isAllowViewPage = await tokenValidate(_fetch)

      if (!isAllowViewPage) {
        setNotAuth(true)
        setLoading(false)
      } else {
        try {
          if (!(await hasPrivilege('administrador', 'fin_gerente', 'fin_assistente'))) setNotPrivilege(true)

          setReady(true)
          return setLoading(false)
        } catch {
          setError(true)
          return setLoading(false)
        }
      }
    })

    return () => clearTimeout(timer)
  }, [])

  if (loading) return compose_load()

  if (isError) return compose_error(handleClickNoAuth)

  if (notPrivilege) return compose_noPrivilege(handleClickNoPrivilege)

  if (notAuth) return compose_noAuth(handleClickNoAuth)

  if (isReady) return compose_ready(
    handleClickBackPage,
    lotItems,
    postings,
    costCenters,
    people,
    updatePerson,
    removeMultipleLotItems,
    removeLotItem,
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