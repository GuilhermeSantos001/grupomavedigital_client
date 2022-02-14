/**
 * @description Payback -> Lançamentos Financeiros -> Apuração
 * @author GuilhermeSantos001
 * @update 27/01/2022
 */

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import NoPrivilege, { handleClickFunction } from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'

import { PageProps } from '@/pages/_app'
import PageMenu from '@/bin/main_menu'

import Variables from '@/src/db/variables'
import hasPrivilege from '@/src/functions/hasPrivilege'

import DateEx from '@/src/utils/dateEx'
import Alerting from '@/src/utils/alerting'

import Button from '@mui/material/Button'

import SelectCostCenter from '@/components/selects/selectCostCenter'
import MobileDatePicker from '@/components/selects/mobileDatePicker'
import ListCoverageDefined from '@/components/lists/listCoverageDefined'

import {
  useAppSelector
} from '@/app/hooks'

import {
  CostCenter
} from '@/app/features/system/system.slice'

import {
  Posting,
} from '@/app/features/payback/payback.slice'

const serverSideProps: PageProps = {
  title: 'Lançamentos/Apuração',
  description: 'Apuração dos lançamentos operacionais',
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
  postings: Posting[],
  costCenters: CostCenter[],
  costCenter: string,
  handleChangeCostCenter: (id: string) => void,
  periodStart: string,
  setPeriodStart: (date: Date) => void,
  periodEnd: string,
  setPeriodEnd: (date: Date) => void,
  postingsDefined: Posting[],
  searchPostingsDefined: () => void,
  handleResetPostingDefined: () => void,
) {
  return (
    <div className="row g-2">
      <div className="col-12">
        <div className="p-3 bg-primary bg-gradient rounded">
          <p className="text-center text-secondary fw-bold fs-5 my-2">
            <FontAwesomeIcon
              icon={Icon.render('fas', 'money-check-alt')}
              className="me-2 fs-3 flex-shrink-1 text-secondary my-auto"
            /> Apurar Lançamentos
          </p>
        </div>
        <button
          type="button"
          className="btn btn-link"
          onClick={handleClickBackPage}
        >
          Voltar
        </button>
        <div className='d-flex flex-column my-2'>
          <SelectCostCenter
            costCenter={costCenters.find(_costCenter => _costCenter.id === costCenter)}
            handleChangeCostCenter={handleChangeCostCenter}
          />
          <div className='d-flex flex-column flex-md-row my-2'>
            <MobileDatePicker
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
                  setPeriodStart(value);
                } else {
                  Alerting.create('warning', `A data inicial não pode ser maior que a data final.`, 3600);
                }
              }}
            />
            <MobileDatePicker
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
                  setPeriodEnd(value);
                } else {
                  Alerting.create('warning', `A data final não pode ser menor que a data inicial.`, 3600);
                }
              }}
            />
          </div>
          <p className="fw-bold border-bottom text-center my-2">
            Disponíveis
          </p>
          <ListCoverageDefined
            postings={postingsDefined}
            disabledPostingRemove={postings.length <= 0}
            handlePostingRemove={() => { }}
          />
          <Button
            variant="outlined"
            onClick={() => searchPostingsDefined()}
            disabled={costCenter.length <= 0 || postings.length <= 0}
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
            disabled={costCenter.length <= 0 || postings.length <= 0}
            className='col-12 m-2'
            color={'error'}
          >
            <FontAwesomeIcon
              icon={Icon.render('fas', 'history')}
              className="me-2 flex-shrink-1 my-auto"
            />
            Limpar Coberturas Aplicadas
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function Postings() {
  const
    postings = useAppSelector(state => state.payback.postings || []),
    costCenters = useAppSelector(state => state.system.costCenters || []);

  const [isReady, setReady] = useState<boolean>(false)
  const [notPrivilege, setNotPrivilege] = useState<boolean>(false)
  const [notAuth, setNotAuth] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const [costCenter, setCostCenter] = useState<string>('')
  const [periodStart, setPeriodStart] = useState<Date>(new Date())
  const [periodEnd, setPeriodEnd] = useState<Date>(new Date())
  const [postingsDefined, setPostingsDefined] = useState<Posting[]>([])

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
    handleClickBackPage = () => router.push('/payback/postings'),
    handleChangeCostCenter = (id: string) => setCostCenter(id),
    handleDefinePostingDefined = (postings: Posting[]) => setPostingsDefined(postings),
    handleResetPostingDefined = () => setPostingsDefined([]),
    searchPostingsDefined = () => {
      const search = postings.filter(posting => {
        if (posting.costCenter === costCenter && posting.paymentStatus === 'payable') {
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

        if (postings.filter(posting => posting.costCenter === costCenter && posting.paymentStatus === 'payable').length > 0)
          Alerting.create('info', `Existem ${postings.filter(posting => posting.paymentStatus === 'payable').length} lançamento(s) a pagar.`);
        else
          Alerting.create('info', `Não existem lançamentos a pagar.`);
      }
    };

  useEffect(() => {
    hasPrivilege('administrador', 'ope_gerente', 'ope_coordenador', 'ope_mesa')
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
    postings,
    costCenters,
    costCenter,
    handleChangeCostCenter,
    periodStart,
    setPeriodStart,
    periodEnd,
    setPeriodEnd,
    postingsDefined,
    searchPostingsDefined,
    handleResetPostingDefined,
  )
}