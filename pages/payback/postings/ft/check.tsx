/**
 * @description Payback -> Lançamentos Financeiros -> Apuração
 * @author GuilhermeSantos001
 * @update 14/02/2022
 */

import React, { useEffect, useState } from 'react'

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

import { BoxLoadingMagicSpinner } from '@/components/utils/BoxLoadingMagicSpinner'
import { BoxError } from '@/components/utils/BoxError'

import { PageProps } from '@/pages/_app'
import {GetMenuMain} from '@/bin/GetMenuMain'

import { Variables } from '@/src/db/variables'
import hasPrivilege from '@/src/functions/hasPrivilege'

import DateEx from '@/src/utils/dateEx'
import Alerting from '@/src/utils/alerting'

import Button from '@mui/material/Button'

import { DatePicker } from '@/components/selects/DatePicker'
import { ListCoverageDefined } from '@/components/lists/ListCoverageDefined'

import { PostingType } from '@/types/PostingType'
import { CostCenterType } from '@/types/CostCenterType'

import { usePostingsService } from '@/services/usePostingsService'
import { useCostCentersService } from '@/services/useCostCentersService'


const serverSideProps: PageProps = {
  title: 'Lançamentos/Apuração',
  description: 'Apuração dos lançamentos operacionais',
  themeColor: '#004a6e',
  menu: GetMenuMain('mn-payback')
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
  postings: PostingType[],
  costCenters: CostCenterType[],
  costCenter: string,
  handleChangeCostCenter: (id: string) => void,
  periodStart: Date,
  setPeriodStart: (date: Date) => void,
  periodEnd: Date,
  setPeriodEnd: (date: Date) => void,
  postingsDefined: PostingType[],
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
  const [syncData, setSyncData] = useState<boolean>(false)

  const [isReady, setReady] = useState<boolean>(false)
  const [notPrivilege, setNotPrivilege] = useState<boolean>(false)
  const [notAuth, setNotAuth] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const [costCenter, setCostCenter] = useState<string>('')
  const [periodStart, setPeriodStart] = useState<Date>(new Date())
  const [periodEnd, setPeriodEnd] = useState<Date>(new Date())
  const [postingsDefined, setPostingsDefined] = useState<PostingType[]>([])

  const router = useRouter()

  const { data: postings, isLoading: isLoadingPostings } = usePostingsService();
  const { data: costCenters, isLoading: isLoadingCostCenters } = useCostCentersService();

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
    handleDefinePostingDefined = (postings: PostingType[]) => setPostingsDefined(postings),
    handleResetPostingDefined = () => setPostingsDefined([]),
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

        if (postings.filter(posting => costCenters.map(costCenter => costCenter.value).includes(posting.costCenter.value) && posting.paymentStatus === 'pending').length > 0)
          Alerting.create('info', `Existem ${postings.filter(posting => posting.paymentStatus === 'pending').length} lançamento(s) a pagar.`);
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

  if (
    isLoadingPostings && !syncData
    || isLoadingCostCenters && !syncData
  )
    return <BoxLoadingMagicSpinner />

  if (
    !syncData
    && postings
    && costCenters
  ) {
    setSyncData(true);
  } else if (
    !syncData && !postings
    || !syncData && !costCenters
  ) {
    return <BoxError />
  }

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