/**
 * @description Payback -> Lançamentos Financeiros -> Cadastro
 * @author @GuilhermeSantos001
 * @update 31/12/2021
 */

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import Button from '@mui/material/Button'

import RenderPageError from '@/components/renderPageError'
import NoPrivilege from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'
import SelectCostCenter from '@/components/inputs/selectCostCenter'
import ModalRegisterCostCenter from '@/components/modals/registerCostCenter'
import ModalEditCostCenter from '@/components/modals/editCostCenter'
import MobileDatePicker from '@/components/inputs/mobileDatePicker'
import AssistantPostingsRegister from '@/components/assistants/assistantPostingsRegister'
import ListWithCheckboxMUI from '@/components/lists/listWithCheckboxMUI'
import ListWithIconsMUI from '@/components/lists/listWithIconsMUI'
import RegisterWorkplace from '@/components/modals/registerWorkplace'
import EditWorkplace from '@/components/modals/editWorkplace'

import { PageProps } from '@/pages/_app'
import PageMenu from '@/bin/main_menu'

import Fetch from '@/src/utils/fetch'
import Variables from '@/src/db/variables'
import { tokenValidate } from '@/src/functions/tokenValidate'
import hasPrivilege from '@/src/functions/hasPrivilege'
import Alerting from '@/src/utils/alerting'
import StringEx from '@/src/utils/stringEx'
import DateEx from '@/src/utils/dateEx'

import getWorkPlaceForTable from '@/src/functions/getWorkPlaceForTable'

import { useAppSelector, useAppDispatch } from '@/app/hooks'

import type {
  CostCenter,
  Workplace,
  Person,
  Scale,
  Street,
  Neighborhood,
  City,
  District,
} from '@/app/features/system/system.slice'

import {
  appendScale,
  editScale,
  removeScale,
  appendStreet,
  editStreet,
  removeStreet,
  appendNeighborhood,
  editNeighborhood,
  removeNeighborhood,
  appendCity,
  editCity,
  removeCity,
  appendDistrict,
  editDistrict,
  removeDistrict,
  removeWorkplace,
} from '@/app/features/system/system.slice'


import type {
  Posting
} from '@/app/features/payback/payback.slice'

import {
  appendPosting
} from '@/app/features/payback/payback.slice'

const serverSideProps: PageProps = {
  title: 'Pagamentos/Lançamentos/Cadastro',
  description: 'Cadastro de lançamentos financeiros',
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

//  TODO: Implementar o esqueleto de loading da página
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
  showModalRegisterCostCenter: boolean,
  showModalEditCostCenter: boolean,
  handleShowModalRegisterCostCenter: () => void,
  handleCloseModalRegisterCostCenter: () => void,
  handleShowModalEditCostCenter: () => void,
  handleCloseModalEditCostCenter: () => void,
  assistantStep: number,
  assistantFinish: boolean,
  handleChangeAssistantStep: (step: number) => void,
  handleFinishAssistant: () => void,
  pageSizeTableWorkplaces: number,
  pageSizeOptionsTableWorkplaces: number[],
  handleChangePageSizeTableWorkplaces: (pageSize: number) => void,
  costCenter: string,
  handleDefineCostCenter: (e: any) => void,
  handleResetCostCenter: () => void,
  costCenters: CostCenter[],
  periodStart: Date,
  setPeriodStart: React.Dispatch<React.SetStateAction<Date>>,
  periodEnd: Date,
  setPeriodEnd: React.Dispatch<React.SetStateAction<Date>>,
  workplaces: Workplace[],
  showModalRegisterWorkplace: boolean,
  showModalEditWorkplace: boolean,
  handleShowModalRegisterWorkplace: () => void,
  handleCloseModalRegisterWorkplace: () => void,
  handleShowModalEditWorkplace: () => void,
  handleCloseModalEditWorkplace: () => void,
  scale: string,
  street: string,
  neighborhood: string,
  city: string,
  district: string,
  scales: Scale[],
  streets: Street[],
  neighborhoods: Neighborhood[],
  cities: City[],
  districts: District[],
  handleDefineScale: (value: string) => void,
  handleAppendScale: (scale: Scale) => void,
  handleUpdateScale: (scale: Scale) => void,
  handleRemoveScale: (id: string) => void,
  handleDefineStreet: (value: string) => void,
  handleAppendStreet: (street: Street) => void,
  handleUpdateStreet: (street: Street) => void,
  handleRemoveStreet: (id: string) => void,
  handleDefineNeighborhood: (value: string) => void,
  handleAppendNeighborhood: (neighborhood: Neighborhood) => void,
  handleUpdateNeighborhood: (neighborhood: Neighborhood) => void,
  handleRemoveNeighborhood: (id: string) => void,
  handleDefineCity: (value: string) => void,
  handleAppendCity: (city: City) => void,
  handleUpdateCity: (city: City) => void,
  handleRemoveCity: (id: string) => void,
  handleDefineDistrict: (value: string) => void,
  handleAppendDistrict: (district: District) => void,
  handleUpdateDistrict: (district: District) => void,
  handleRemoveDistrict: (id: string) => void,
  selectWorkplaces: string[],
  handleDefineSelectWorkplaces: (itens: string[]) => void,
  handleDeleteWorkplaces: (itens: string[]) => void,
  people: Person[],
  appliedWorkplaces: Workplace[],
  handleAppendAppliedWorkplaces: (itens: Workplace[]) => void,
  handleRemoveAppliedWorkplaces: (itens: Workplace[]) => void,
) {
  const { columns: workPlaceColumns, rows: workPlaceRows } = getWorkPlaceForTable(workplaces);

  return (
    <>
      <ModalRegisterCostCenter show={showModalRegisterCostCenter} handleClose={handleCloseModalRegisterCostCenter} />
      <ModalEditCostCenter show={showModalEditCostCenter} costCenter={costCenter} handleResetCostCenter={handleResetCostCenter} handleClose={handleCloseModalEditCostCenter} />
      <div className="row g-2">
        <div className="col-12">
          <div className="p-3 bg-primary bg-gradient rounded">
            <p className="text-center text-secondary fw-bold fs-5 my-2">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'money-bill-wave')}
                className="me-2 fs-3 flex-shrink-1 text-secondary my-auto"
              />
              Registrar Lançamento
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
            <SelectCostCenter
              costCenter={costCenter}
              costCenters={costCenters}
              handleDefineCostCenter={handleDefineCostCenter}
              handleShowModalEditCostCenter={handleShowModalEditCostCenter}
              handleShowModalRegisterCostCenter={handleShowModalRegisterCostCenter}
            />
          </div>
          <div className='d-flex flex-column flex-md-row'>
            <MobileDatePicker
              className="col px-2 my-2"
              label="Período de Apuração (Inicial)"
              value={periodStart}
              handleChangeValue={(value) => setPeriodStart(value)}
            />
            <MobileDatePicker
              className="col px-2 my-2"
              label="Período de Apuração (Final)"
              value={periodEnd}
              handleChangeValue={(value) => setPeriodEnd(value)}
            />
          </div>
          <div className='d-flex flex-column flex-md-row'>
            <AssistantPostingsRegister
              step={assistantStep}
              onChangeStep={handleChangeAssistantStep}
              prevStepEnabled={!assistantFinish && assistantStep > 0}
              nextStepEnabled={!assistantFinish}
              onPrevStep={() => handleDefineSelectWorkplaces([])}
              onNextStep={() => handleDefineSelectWorkplaces([])}
              handleFinish={handleFinishAssistant}
              steps={[
                {
                  label: 'Locais de Trabalho',
                  completed: assistantStep > 0,
                  component: (
                    <div className='d-flex flex-column p-2 m-2'>
                      <RegisterWorkplace
                        show={showModalRegisterWorkplace}
                        scale={scale}
                        street={street}
                        neighborhood={neighborhood}
                        city={city}
                        district={district}
                        scales={scales}
                        workplaces={workplaces}
                        streets={streets}
                        neighborhoods={neighborhoods}
                        cities={cities}
                        districts={districts}
                        handleChangeScale={handleDefineScale}
                        handleAppendScale={handleAppendScale}
                        handleUpdateScale={handleUpdateScale}
                        handleRemoveScale={handleRemoveScale}
                        handleChangeStreet={handleDefineStreet}
                        handleAppendStreet={handleAppendStreet}
                        handleUpdateStreet={handleUpdateStreet}
                        handleRemoveStreet={handleRemoveStreet}
                        handleChangeNeighborhood={handleDefineNeighborhood}
                        handleAppendNeighborhood={handleAppendNeighborhood}
                        handleUpdateNeighborhood={handleUpdateNeighborhood}
                        handleRemoveNeighborhood={handleRemoveNeighborhood}
                        handleChangeCity={handleDefineCity}
                        handleAppendCity={handleAppendCity}
                        handleUpdateCity={handleUpdateCity}
                        handleRemoveCity={handleRemoveCity}
                        handleChangeDistrict={handleDefineDistrict}
                        handleAppendDistrict={handleAppendDistrict}
                        handleUpdateDistrict={handleUpdateDistrict}
                        handleRemoveDistrict={handleRemoveDistrict}
                        handleClose={handleCloseModalRegisterWorkplace}
                      />
                      {
                        selectWorkplaces.length === 1 &&
                        <EditWorkplace
                          show={showModalEditWorkplace}
                          id={workplaces.find(place => place.id === selectWorkplaces[0]).id}
                          name={workplaces.find(place => place.id === selectWorkplaces[0]).name}
                          entryTime={workplaces.find(place => place.id === selectWorkplaces[0]).entryTime}
                          exitTime={workplaces.find(place => place.id === selectWorkplaces[0]).exitTime}
                          services={workplaces.find(place => place.id === selectWorkplaces[0]).services}
                          scale={workplaces.find(place => place.id === selectWorkplaces[0]).scale.id}
                          street={workplaces.find(place => place.id === selectWorkplaces[0]).address.street.id}
                          numberHome={workplaces.find(place => place.id === selectWorkplaces[0]).address.number}
                          complement={workplaces.find(place => place.id === selectWorkplaces[0]).address.complement}
                          zipCode={workplaces.find(place => place.id === selectWorkplaces[0]).address.zipCode}
                          neighborhood={workplaces.find(place => place.id === selectWorkplaces[0]).address.neighborhood.id}
                          city={workplaces.find(place => place.id === selectWorkplaces[0]).address.city.id}
                          district={workplaces.find(place => place.id === selectWorkplaces[0]).address.district.id}
                          scales={scales}
                          workplaces={workplaces}
                          streets={streets}
                          neighborhoods={neighborhoods}
                          cities={cities}
                          districts={districts}
                          handleAppendScale={handleAppendScale}
                          handleUpdateScale={handleUpdateScale}
                          handleRemoveScale={handleRemoveScale}
                          handleAppendStreet={handleAppendStreet}
                          handleUpdateStreet={handleUpdateStreet}
                          handleRemoveStreet={handleRemoveStreet}
                          handleAppendNeighborhood={handleAppendNeighborhood}
                          handleUpdateNeighborhood={handleUpdateNeighborhood}
                          handleRemoveNeighborhood={handleRemoveNeighborhood}
                          handleAppendCity={handleAppendCity}
                          handleUpdateCity={handleUpdateCity}
                          handleRemoveCity={handleRemoveCity}
                          handleAppendDistrict={handleAppendDistrict}
                          handleUpdateDistrict={handleUpdateDistrict}
                          handleRemoveDistrict={handleRemoveDistrict}
                          handleClose={handleCloseModalEditWorkplace}
                        />
                      }
                      <p className="fw-bold border-bottom text-center my-2">
                        Aplicados
                      </p>
                      <ListWithIconsMUI
                        workplaces={appliedWorkplaces}
                      />
                      <p className="fw-bold border-bottom text-center my-2">
                        Disponíveis
                      </p>
                      <ListWithCheckboxMUI
                        columns={workPlaceColumns}
                        rows={workPlaceRows}
                        pageSize={pageSizeTableWorkplaces}
                        pageSizeOptions={pageSizeOptionsTableWorkplaces}
                        onChangeSelection={handleDefineSelectWorkplaces}
                        onPageSizeChange={handleChangePageSizeTableWorkplaces}
                      />
                      <div className='d-flex flex-row'>
                        <button
                          type="button"
                          className="btn btn-link"
                          disabled={selectWorkplaces.length <= 0}
                          onClick={() => {
                            const filtered = selectWorkplaces.filter(id => {
                              if (appliedWorkplaces.find(applied => applied.id === id))
                                return false;

                              return true;
                            });

                            if (filtered.length > 0)
                              handleAppendAppliedWorkplaces(workplaces.filter(workplace => filtered.includes(workplace.id)));
                          }}
                        >
                          ✔Aplicar
                        </button>
                        <button
                          type="button"
                          className="btn btn-link"
                          disabled={selectWorkplaces.length <= 0}
                          onClick={() => handleRemoveAppliedWorkplaces(workplaces.filter(workplace => selectWorkplaces.includes(workplace.id)))}
                        >
                          ❌Desaplicar
                        </button>
                        <button
                          type="button"
                          className="btn btn-link"
                          disabled={selectWorkplaces.length <= 0 || selectWorkplaces.length > 1}
                          onClick={handleShowModalEditWorkplace}
                        >
                          💫 Atualizar
                        </button>
                        <button
                          type="button"
                          className="btn btn-link"
                          disabled={selectWorkplaces.length <= 0 || people.filter(person => selectWorkplaces.includes(person.workplace.id)).length > 0}
                          onClick={() => handleDeleteWorkplaces(selectWorkplaces)}
                        >
                          ➖ Remover
                        </button>
                        <button
                          type="button"
                          className="btn btn-link"
                          onClick={handleShowModalRegisterWorkplace}
                        >
                          ➕ Adicionar
                        </button>
                      </div>
                    </div>
                  )
                },
                {
                  label: 'Testing 2',
                  completed: assistantFinish,
                  component: <p>Hello World 2</p>
                }
              ]}
            />
          </div>
        </div>
      </div>
    </>
  )
}

const Register = (): JSX.Element => {
  const [isReady, setReady] = useState<boolean>(false)
  const [isError, setError] = useState<boolean>(false)
  const [notPrivilege, setNotPrivilege] = useState<boolean>(false)
  const [notAuth, setNotAuth] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const [showModalRegisterCostCenter, setShowModalRegisterCostCenter] = useState<boolean>(false)
  const [showModalEditCostCenter, setShowModalEditCostCenter] = useState<boolean>(false)
  const [showModalRegisterWorkplace, setShowModalRegisterWorkplace] = useState<boolean>(false)
  const [showModalEditWorkplace, setShowModalEditWorkplace] = useState<boolean>(false)

  const [assistantStep, setAssistantStep] = useState<number>(0)
  const [assistantFinish, setAssistantFinish] = useState<boolean>(false)
  const [costCenter, setCostCenter] = useState<string>('')
  const [periodStart, setPeriodStart] = useState<Date>(new Date())
  const [periodEnd, setPeriodEnd] = useState<Date>(new Date())
  const [scale, setScale] = useState<string>('')
  const [street, setStreet] = useState<string>('')
  const [neighborhood, setNeighborhood] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [district, setDistrict] = useState<string>('')

  const [selectWorkplaces, setSelectWorkplaces] = useState<string[]>([])
  const [appliedWorkplaces, setAppliedWorkplaces] = useState<Workplace[]>([])

  const [pageSizeTableWorkplaces, setPageSizeTableWorkplaces] = useState<number>(10)
  const pageSizeOptionsTableWorkplaces = [10, 25, 50, 100];

  const
    dispatch = useAppDispatch(),
    costCenters = useAppSelector((state) => state.system.costCenters || []),
    workplaces = useAppSelector((state) => state.system.workplaces || []),
    people = useAppSelector((state) => state.system.people || []),
    scales = useAppSelector((state) => state.system.scales || []),
    streets = useAppSelector((state) => state.system.streets || []),
    neighborhoods = useAppSelector((state) => state.system.neighborhoods || []),
    cities = useAppSelector((state) => state.system.cities || []),
    districts = useAppSelector((state) => state.system.districts || [])

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
    handleClickBackPage = () => router.push('/payback/postings'),
    handleShowModalRegisterCostCenter = () => setShowModalRegisterCostCenter(true),
    handleCloseModalRegisterCostCenter = () => setShowModalRegisterCostCenter(false),
    handleShowModalEditCostCenter = () => setShowModalEditCostCenter(true),
    handleCloseModalEditCostCenter = () => setShowModalEditCostCenter(false),
    handleChangeAssistantStep = (step: number) => setAssistantStep(step),
    handleFinishAssistant = () => setAssistantFinish(true),
    handleChangePageSizeTableWorkplaces = (pageSize: number) => setPageSizeTableWorkplaces(pageSize),
    handleDefineCostCenter = (title: string) => {
      if (title === 'Centro de Custo')
        setCostCenter('');
      else
        setCostCenter(title);
    },
    handleDefineScale = (value: string) => setScale(value),
    handleDefineStreet = (value: string) => setStreet(value),
    handleDefineNeighborhood = (value: string) => setNeighborhood(value),
    handleDefineCity = (value: string) => setCity(value),
    handleDefineDistrict = (value: string) => setDistrict(value),
    handleResetCostCenter = () => setCostCenter(''),
    handleShowModalRegisterWorkplace = () => setShowModalRegisterWorkplace(true),
    handleCloseModalRegisterWorkplace = () => setShowModalRegisterWorkplace(false),
    handleShowModalEditWorkplace = () => setShowModalEditWorkplace(true),
    handleCloseModalEditWorkplace = () => setShowModalEditWorkplace(false),
    handleAppendScale = (scale: Scale) => dispatch(appendScale(scale)),
    handleUpdateScale = (scale: Scale) => dispatch(editScale(scale)),
    handleRemoveScale = (id: string) => dispatch(removeScale(id)),
    handleAppendStreet = (street: Street) => dispatch(appendStreet(street)),
    handleUpdateStreet = (street: Street) => dispatch(editStreet(street)),
    handleRemoveStreet = (id: string) => dispatch(removeStreet(id)),
    handleAppendNeighborhood = (neighborhood: Neighborhood) => dispatch(appendNeighborhood(neighborhood)),
    handleUpdateNeighborhood = (neighborhood: Neighborhood) => dispatch(editNeighborhood(neighborhood)),
    handleRemoveNeighborhood = (id: string) => dispatch(removeNeighborhood(id)),
    handleAppendCity = (city: City) => dispatch(appendCity(city)),
    handleUpdateCity = (city: City) => dispatch(editCity(city)),
    handleRemoveCity = (id: string) => dispatch(removeCity(id)),
    handleAppendDistrict = (district: District) => dispatch(appendDistrict(district)),
    handleUpdateDistrict = (district: District) => dispatch(editDistrict(district)),
    handleRemoveDistrict = (id: string) => dispatch(removeDistrict(id)),
    handleDefineSelectWorkplaces = (itens: string[]) => setSelectWorkplaces(itens),
    handleDeleteWorkplaces = (itens: string[]) => itens.forEach(id => dispatch(removeWorkplace(id))),
    handleAppendAppliedWorkplaces = (itens: Workplace[]) => setAppliedWorkplaces([...appliedWorkplaces, ...itens]),
    handleRemoveAppliedWorkplaces = (itens: Workplace[]) => {
      setAppliedWorkplaces(appliedWorkplaces.filter(item => !itens.some(item2 => item2.id === item.id)))
    };

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
    showModalRegisterCostCenter,
    showModalEditCostCenter,
    handleShowModalRegisterCostCenter,
    handleCloseModalRegisterCostCenter,
    handleShowModalEditCostCenter,
    handleCloseModalEditCostCenter,
    assistantStep,
    assistantFinish,
    handleChangeAssistantStep,
    handleFinishAssistant,
    pageSizeTableWorkplaces,
    pageSizeOptionsTableWorkplaces,
    handleChangePageSizeTableWorkplaces,
    costCenter,
    handleDefineCostCenter,
    handleResetCostCenter,
    costCenters,
    periodStart,
    setPeriodStart,
    periodEnd,
    setPeriodEnd,
    workplaces,
    showModalRegisterWorkplace,
    showModalEditWorkplace,
    handleShowModalRegisterWorkplace,
    handleCloseModalRegisterWorkplace,
    handleShowModalEditWorkplace,
    handleCloseModalEditWorkplace,
    scale,
    street,
    neighborhood,
    city,
    district,
    scales,
    streets,
    neighborhoods,
    cities,
    districts,
    handleDefineScale,
    handleAppendScale,
    handleUpdateScale,
    handleRemoveScale,
    handleDefineStreet,
    handleAppendStreet,
    handleUpdateStreet,
    handleRemoveStreet,
    handleDefineNeighborhood,
    handleAppendNeighborhood,
    handleUpdateNeighborhood,
    handleRemoveNeighborhood,
    handleDefineCity,
    handleAppendCity,
    handleUpdateCity,
    handleRemoveCity,
    handleDefineDistrict,
    handleAppendDistrict,
    handleUpdateDistrict,
    handleRemoveDistrict,
    selectWorkplaces,
    handleDefineSelectWorkplaces,
    handleDeleteWorkplaces,
    people,
    appliedWorkplaces,
    handleAppendAppliedWorkplaces,
    handleRemoveAppliedWorkplaces,
  )
}

export default Register
