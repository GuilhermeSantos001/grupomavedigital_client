/**
 * @description Payback -> Cartões Beneficio (Alelo) -> Cadastro
 * @author GuilhermeSantos001
 * @update 09/02/2022
 */

import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import NoPrivilege, { handleClickFunction } from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'
import { SelectCostCenter } from '@/components/selects/SelectCostCenter'

import { PageProps } from '@/pages/_app'
import PageMenu from '@/bin/main_menu'

import Variables from '@/src/db/variables'
import hasPrivilege from '@/src/functions/hasPrivilege'
import StringEx from '@/src/utils/stringEx'
import Alerting from '@/src/utils/alerting'

import {
  useCardService,
  FunctionCreateCardTypeof
} from '@/services/useCardService';

const serverSideProps: PageProps = {
  title: 'Pagamentos/Cartões Benefício/Cadastro',
  description: 'Adição de cartões de benefício',
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

function compose_noPrivilege(handleClick: handleClickFunction) {
  return <NoPrivilege handleClick={handleClick} />
}

function compose_noAuth(handleClick: handleClickFunction) {
  return <NoAuth handleClick={handleClick} />
}

function compose_ready(
  handleClickBackPage: () => void,
  handleCreateCard: FunctionCreateCardTypeof,
  costCenter: string,
  handleChangeCostCenter: (id: string) => void,
  lotNum: number,
  handleChangeNumLot: (val: number) => void,
  numSerialNumber: number,
  handleChangeNumSerialNumber: (val: number) => void,
  numLastCardNumber: number,
  handleChangeNumLastCardNumber: (val: number) => void
) {
  const
    enableCancel = () => {
      if (
        lotNum > 0 ||
        numSerialNumber > 0 ||
        numLastCardNumber > 0 ||
        costCenter !== ''
      ) {
        return true
      }

      return false
    },
    enableRegister = () => {
      if (
        lotNum === 0 ||
        numSerialNumber === 0 ||
        numLastCardNumber === 0 ||
        costCenter === ''
      ) {
        return false
      }

      return true
    },
    handleCancel = () => {
      handleChangeNumLot(0);
      handleChangeNumSerialNumber(0);
      handleChangeNumLastCardNumber(0);
    }

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
              Registrar Lote
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
            Data de Criação {'&'} Código do Lote
          </p>
          <div className='d-flex flex-column flex-md-row'>
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
            <div className="input-group my-2 m-md-2">
              <span className="input-group-text" id="code-addon">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'key')}
                  className="m-auto fs-3 flex-shrink-1 text-primary"
                />
              </span>
              <input
                type="number"
                className="form-control"
                placeholder="Código do lote"
                aria-label="Código do lote"
                aria-describedby="code-addon"
                min={0}
                value={String(lotNum).padStart(9, '0')}
                onChange={(e) => handleChangeNumLot(Number(e.target.value))}
              />
            </div>
          </div>
          <p className="fw-bold border-bottom text-center my-2">
            Centro de Custo {'&'} Número de Série
          </p>
          <SelectCostCenter handleChangeId={handleChangeCostCenter} />
          <div className='d-flex flex-column flex-md-row'>
            <div className="input-group my-2 m-md-2">
              <span className="input-group-text" id="serialNumber-addon">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'sort-numeric-up')}
                  className="m-auto fs-3 flex-shrink-1 text-primary"
                />
              </span>
              <input
                type="number"
                className="form-control"
                placeholder="Número de Série"
                aria-label="Número de Série"
                aria-describedby="serialNumber-addon"
                min={0}
                value={String(numSerialNumber).padStart(15, '0')}
                onChange={(e) => handleChangeNumSerialNumber(Number(e.target.value))}
              />
            </div>
          </div>
          <p className="fw-bold border-bottom text-center my-2">
            4 Últimos Dígitos do Número do Cartão
          </p>
          <div className='d-flex flex-column flex-md-row'>
            <div className="input-group my-2 m-md-2">
              <span className="input-group-text" id="lastCardNumber-addon">
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'credit-card')}
                  className="m-auto fs-3 flex-shrink-1 text-primary"
                />
              </span>
              <input
                type="number"
                className="form-control"
                placeholder="4 Últimos Dígitos do Número do Cartão"
                aria-label="4 Últimos Dígitos do Número do Cartão"
                aria-describedby="lastCardNumber-addon"
                min={0}
                value={String(numLastCardNumber).padStart(4, '0')}
                onChange={(e) => handleChangeNumLastCardNumber(Number(e.target.value))}
              />
            </div>
          </div>
          <div className='d-flex flex-column flex-md-row justify-content-end px-2 my-2'>
            <div className="btn-group" role="group" aria-label="Basic example">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleCancel}
                disabled={enableCancel() ? false : true}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={async () => {
                  const card = await handleCreateCard({
                    costCenterId: costCenter,
                    lotNum: String(lotNum).padStart(9, '0'),
                    serialNumber: String(numSerialNumber).padStart(15, '0'),
                    lastCardNumber: String(numLastCardNumber).padStart(4, '0'),
                    status: 'available'
                  })

                  if (!card)
                    return Alerting.create('error', 'Não foi possível criar o cartão. Tente novamente com outros dados.');

                  handleCancel();
                  Alerting.create('success', 'Cartão criado com sucesso.');
                }}
                disabled={enableRegister() ? false : true}
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function CardsRegister() {
  const [isReady, setReady] = useState<boolean>(false)
  const [notPrivilege, setNotPrivilege] = useState<boolean>(false)
  const [notAuth, setNotAuth] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const [costCenter, setCostCenter] = useState<string>('')
  const [lotNum, setLotNum] = useState<number>(0)
  const [numSerialNumber, setNumSerialNumber] = useState<number>(0)
  const [numLastCardNumber, setNumLastCardNumber] = useState<number>(0)

  const { create: handleCreateCard } = useCardService();

  const router = useRouter()

  const
    handleClickNoAuth: handleClickFunction = async (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      path: string
    ) => {
      event.preventDefault()

      if (path === '/auth/login') {
        const variables = new Variables(1, 'IndexedDB')
        await Promise.all([await variables.clear()]).then(() => {
          router.push(path)
        })
      }
    },
    handleClickNoPrivilege: handleClickFunction = async (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      path: string
    ) => {
      event.preventDefault()
      router.push(path)
    },
    handleClickBackPage = () => router.push('/payback/cards'),
    handleChangeCostCenter = (id: string) => setCostCenter(id),
    handleChangeNumLot = (val: number) => {
      if (String(val).length <= 9)
        setLotNum(val);
    },
    handleChangeSerialNumber = (val: number) => {
      if (String(val).length <= 15)
        setNumSerialNumber(val);
    },
    handleChangeLastCardNumber = (val: number) => {
      if (String(val).length <= 4)
        setNumLastCardNumber(val);
    };

  useEffect(() => {
    hasPrivilege('administrador', 'fin_gerente', 'fin_assistente')
      .then((isAllowViewPage) => {
        if (isAllowViewPage) {
          setReady(true);
        } else {
          setNotPrivilege(true);
        }

        return setLoading(false);
      })
      .catch(() => {
        setNotAuth(true);
        return setLoading(false)
      });
  }, [])

  if (loading) return compose_load()

  if (notPrivilege) return compose_noPrivilege(handleClickNoPrivilege)

  if (notAuth) return compose_noAuth(handleClickNoAuth)

  if (isReady) return compose_ready(
    handleClickBackPage,
    handleCreateCard,
    costCenter,
    handleChangeCostCenter,
    lotNum,
    handleChangeNumLot,
    numSerialNumber,
    handleChangeSerialNumber,
    numLastCardNumber,
    handleChangeLastCardNumber
  )
}