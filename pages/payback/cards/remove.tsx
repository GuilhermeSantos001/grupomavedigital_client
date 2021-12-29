/**
 * @description Payback -> Cartões Beneficio (Alelo) -> Cadastro
 * @author @GuilhermeSantos001
 * @update 29/12/2021
 */

import React, { useEffect, useState } from 'react'

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

import { useAppSelector, useAppDispatch } from '@/app/hooks'

import {
  removeItemLot
} from '@/app/features/payback/payback.slice'

import type {
  LotItem,
  CostCenter
} from '@/app/features/payback/payback.slice'

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
  costCenters: CostCenter[],
  removeMultipleLotItems: (items: string[]) => void,
  removeLotItem: (id: string) => {
    payload: string;
    type: string;
  },
  showCanvasDateInfo: boolean,
  openCanvasDateInfo: () => void,
  closeCanvasDateInfo: () => void,
  textTitleCanvasDateInfo: string,
  textCreatedAt: string,
  textUpdatedAt: string,
  handleChangeTextTitleCanvasDateInfo: (text: string) => void,
  handleChangeTextCreatedAt: (text: string) => void,
  handleChangeTextUpdatedAt: (text: string) => void,
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
            textCreatedAt,
            textUpdatedAt,
          )}
          <ListWithFiveColumns
            noItemsMessage='Nenhum lote disponível.'
            pagination={{
              page: 1,
              limit: 20,
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
                      const lot = lotItems.find(lot => lot.serialNumber === item);

                      return lot.status === 'available';
                    });

                    if (filter.length > 0)
                      removeMultipleLotItems(filter)
                    else
                      Alerting.create('Nenhum lote pode ser removido.')
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
                  id: item.serialNumber,
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
                        handleChangeTextCreatedAt(StringEx.createdAt(item.createdAt));
                        handleChangeTextUpdatedAt(StringEx.updatedAt(item.updatedAt));
                        openCanvasDateInfo();
                      },
                      popover: {
                        title: 'Data de Criação & Atualização',
                        description: 'Informações sobre a data de criação e atualização do lote.'
                      }
                    },
                    {
                      icon: {
                        prefix: 'fas',
                        name: 'user-tag'
                      },
                      enabled: item.userAssigned?.length <= 0 ? true : false,
                      handleClick: () => console.log('Hello World 2'),
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
                      handleClick: () => removeLotItem(item.serialNumber),
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
  createdAt: string,
  updatedAt: string,
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
        <div className="input-group my-3">
          <span className="input-group-text" id="updatedAt-addon1">
            <FontAwesomeIcon
              icon={Icon.render('fas', 'calendar-week')}
              className="me-2 fs-3 flex-shrink-1 text-primary my-auto"
            />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Data de Atualização"
            aria-label="Data de Atualização"
            aria-describedby="updatedAt-addon1"
            value={updatedAt}
            readOnly={true}
          />
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

const Remove = (): JSX.Element => {
  const [isReady, setReady] = useState<boolean>(false)
  const [isError, setError] = useState<boolean>(false)
  const [notPrivilege, setNotPrivilege] = useState<boolean>(false)
  const [notAuth, setNotAuth] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const [showCanvasDateInfo, setShowModalDateInfo] = useState<boolean>(false)
  const [textTitleCanvasDateInfo, setTextTitleCanvasDateInfo] = useState<string>('')
  const [textCreatedAt, setTextCreatedAt] = useState<string>('')
  const [textUpdatedAt, setTextUpdatedAt] = useState<string>('')

  const
    dispatch = useAppDispatch(),
    costCenters = useAppSelector((state) => state.payback.costCenters || []),
    lotItems = useAppSelector((state) => state.payback.lotItems || [])

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
    removeMultipleLotItems = (items: string[]) => items.forEach(item => dispatch(removeItemLot(item))),
    removeLotItem = (id: string) => dispatch(removeItemLot(id)),
    openCanvasDateInfo = () => setShowModalDateInfo(true),
    closeCanvasDateInfo = () => setShowModalDateInfo(false),
    handleChangeTextTitleCanvasDateInfo = (text: string) => setTextTitleCanvasDateInfo(text),
    handleChangeTextCreatedAt = (text: string) => setTextCreatedAt(text),
    handleChangeTextUpdatedAt = (text: string) => setTextUpdatedAt(text)

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
    costCenters,
    removeMultipleLotItems,
    removeLotItem,
    showCanvasDateInfo,
    openCanvasDateInfo,
    closeCanvasDateInfo,
    textTitleCanvasDateInfo,
    textCreatedAt,
    textUpdatedAt,
    handleChangeTextTitleCanvasDateInfo,
    handleChangeTextCreatedAt,
    handleChangeTextUpdatedAt,
  )
}

export default Remove
