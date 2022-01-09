/**
 * @description Payback -> Lançamentos Financeiros -> Cadastro
 * @author GuilhermeSantos001
 * @update 07/01/2022
 */

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import RenderPageError from '@/components/renderPageError'
import NoPrivilege from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'
import SelectCostCenter from '@/components/inputs/selectCostCenter'
import MobileDatePicker from '@/components/inputs/mobileDatePicker'
import AssistantPostingsRegister from '@/components/assistants/assistantPostingsRegister'
import ListWithCheckboxMUI from '@/components/lists/listWithCheckboxMUI'
import ListWorkplacesSelected from '@/components/lists/listWorkplacesSelected'
import RegisterWorkplace from '@/components/modals/registerWorkplace'
import RegisterPeople from '@/components/modals/registerPeople'
import EditWorkplace from '@/components/modals/editWorkplace'

import { PageProps } from '@/pages/_app'
import PageMenu from '@/bin/main_menu'

import Fetch from '@/src/utils/fetch'
import Variables from '@/src/db/variables'
import { tokenValidate } from '@/src/functions/tokenValidate'
import hasPrivilege from '@/src/functions/hasPrivilege'
import StringEx from '@/src/utils/stringEx'

import getWorkPlaceForTable from '@/src/functions/getWorkPlaceForTable'
import getPeopleForTable from '@/src/functions/getPeopleForTable'

import { useAppSelector, useAppDispatch } from '@/app/hooks'

import type {
  Workplace,
  Person,
  Scale,
  Service,
  Street,
  Neighborhood,
  City,
  District,
} from '@/app/features/system/system.slice'

import {
  removeWorkplace,
  removePerson,
} from '@/app/features/system/system.slice'

import type {
  LotItem,
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
  assistantStep: number,
  assistantFinish: boolean,
  handleChangeAssistantStep: (step: number) => void,
  handleFinishAssistant: () => void,
  hasCompletedAssistantStep: (step: number) => boolean,
  pageSizeTableWorkplaces: number,
  pageSizeTablePeopleInWorkplaces: number,
  pageSizeOptionsTableWorkplaces: number[],
  pageSizeOptionsTablePeopleInWorkplaces: number[],
  handleChangePageSizeTableWorkplaces: (pageSize: number) => void,
  handleChangePageSizeTablePeopleInWorkplaces: (pageSize: number) => void,
  costCenter: string,
  handleDefineCostCenter: (e: any) => void,
  handleResetCostCenter: () => void,
  periodStart: Date,
  setPeriodStart: React.Dispatch<React.SetStateAction<Date>>,
  periodEnd: Date,
  setPeriodEnd: React.Dispatch<React.SetStateAction<Date>>,
  workplaces: Workplace[],
  showModalRegisterWorkplace: boolean,
  showModalRegisterPeopleInWorkplace: boolean,
  showModalEditWorkplace: boolean,
  showModalEditPeopleInWorkplace: boolean,
  handleShowModalRegisterWorkplace: () => void,
  handleShowModalRegisterPeopleInWorkplace: () => void,
  handleCloseModalRegisterWorkplace: () => void,
  handleCloseModalRegisterPeopleInWorkplace: () => void,
  handleShowModalEditWorkplace: () => void,
  handleShowModalEditPeopleInWorkplace: () => void,
  handleCloseModalEditWorkplace: () => void,
  handleCloseModalEditPeopleInWorkplace: () => void,
  scales: Scale[],
  services: Service[],
  streets: Street[],
  neighborhoods: Neighborhood[],
  cities: City[],
  districts: District[],
  selectWorkplaces: string[],
  selectPeopleInWorkplaces: string[],
  handleDefineSelectWorkplaces: (itens: string[]) => void,
  handleDefineSelectPeopleInWorkplaces: (itens: string[]) => void,
  handleDeleteWorkplaces: (itens: string[]) => void,
  handleDeletePeopleInWorkplaces: (itens: string[]) => void,
  people: Person[],
  appliedWorkplaces: Workplace[],
  appliedPeopleInWorkplaces: Person[],
  handleAppendAppliedWorkplaces: (itens: Workplace[]) => void,
  handleAppendAppliedPeopleInWorkplaces: (itens: Person[]) => void,
  handleRemoveAppliedWorkplaces: (itens: Workplace[]) => void,
  handleRemoveAppliedPeopleInWorkplaces: (itens: Person[]) => void,
  lotItems: LotItem[],
  postings: Posting[],
) {
  const
    { columns: workPlaceColumns, rows: workPlaceRows } =
      getWorkPlaceForTable(
        workplaces,
        scales,
        services,
        streets,
        neighborhoods,
        cities,
        districts
      ),
    { columns: peopleColumns, rows: peopleRows } =
      getPeopleForTable(
        people,
        scales,
        services,
        streets,
        neighborhoods,
        cities,
        districts
      )

  return (
    <>
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
          <div className='d-flex flex-column flex-md-row'>
            <AssistantPostingsRegister
              step={assistantStep}
              onChangeStep={handleChangeAssistantStep}
              finish={assistantFinish}
              prevStepEnabled={!assistantFinish && assistantStep > 0}
              nextStepEnabled={hasCompletedAssistantStep(assistantStep)}
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
                          scale={workplaces.find(place => place.id === selectWorkplaces[0]).scale}
                          street={workplaces.find(place => place.id === selectWorkplaces[0]).address.street}
                          numberHome={workplaces.find(place => place.id === selectWorkplaces[0]).address.number}
                          complement={workplaces.find(place => place.id === selectWorkplaces[0]).address.complement}
                          zipCode={workplaces.find(place => place.id === selectWorkplaces[0]).address.zipCode}
                          neighborhood={workplaces.find(place => place.id === selectWorkplaces[0]).address.neighborhood}
                          city={workplaces.find(place => place.id === selectWorkplaces[0]).address.city}
                          district={workplaces.find(place => place.id === selectWorkplaces[0]).address.district}
                          handleClose={handleCloseModalEditWorkplace}
                        />
                      }
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
                          handleDefineCostCenter={handleDefineCostCenter}
                          handleResetCostCenter={handleResetCostCenter}
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
                      <p className="fw-bold border-bottom text-center my-2">
                        Aplicados
                      </p>
                      <ListWorkplacesSelected
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
                      <div className='d-flex flex-column flex-md-row'>
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
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'check')}
                            className="me-1 flex-shrink-1 my-auto"
                          /> Aplicar
                        </button>
                        <button
                          type="button"
                          className="btn btn-link"
                          disabled={selectWorkplaces.length <= 0}
                          onClick={() => handleRemoveAppliedWorkplaces(workplaces.filter(workplace => selectWorkplaces.includes(workplace.id)))}
                        >
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'times')}
                            className="me-1 flex-shrink-1 my-auto"
                          /> Desaplicar
                        </button>
                        <button
                          type="button"
                          className="btn btn-link"
                          disabled={selectWorkplaces.length <= 0 || selectWorkplaces.length > 1}
                          onClick={handleShowModalEditWorkplace}
                        >
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'edit')}
                            className="me-1 flex-shrink-1 my-auto"
                          /> Atualizar
                        </button>
                        <button
                          type="button"
                          className="btn btn-link"
                          disabled={selectWorkplaces.length <= 0}
                          onClick={() => handleDeleteWorkplaces(selectWorkplaces)}
                        >
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'minus-square')}
                            className="me-1 flex-shrink-1 my-auto"
                          /> Remover
                        </button>
                        <button
                          type="button"
                          className="btn btn-link"
                          onClick={handleShowModalRegisterWorkplace}
                        >
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'plus-square')}
                            className="me-1 flex-shrink-1 my-auto"
                          /> Adicionar
                        </button>
                      </div>
                    </div>
                  )
                },
                {
                  label: 'Coberturas',
                  completed: assistantFinish,
                  component: (
                    <div className='d-flex flex-column p-2 m-2'>
                      <RegisterPeople
                        show={showModalRegisterPeopleInWorkplace}
                        handleClose={handleCloseModalRegisterPeopleInWorkplace}
                      />
                      {
                        selectWorkplaces.length === 1 &&
                        <EditWorkplace
                          show={showModalEditPeopleInWorkplace}
                          id={workplaces.find(place => place.id === selectWorkplaces[0]).id}
                          name={workplaces.find(place => place.id === selectWorkplaces[0]).name}
                          entryTime={workplaces.find(place => place.id === selectWorkplaces[0]).entryTime}
                          exitTime={workplaces.find(place => place.id === selectWorkplaces[0]).exitTime}
                          services={workplaces.find(place => place.id === selectWorkplaces[0]).services}
                          scale={workplaces.find(place => place.id === selectWorkplaces[0]).scale}
                          street={workplaces.find(place => place.id === selectWorkplaces[0]).address.street}
                          numberHome={workplaces.find(place => place.id === selectWorkplaces[0]).address.number}
                          complement={workplaces.find(place => place.id === selectWorkplaces[0]).address.complement}
                          zipCode={workplaces.find(place => place.id === selectWorkplaces[0]).address.zipCode}
                          neighborhood={workplaces.find(place => place.id === selectWorkplaces[0]).address.neighborhood}
                          city={workplaces.find(place => place.id === selectWorkplaces[0]).address.city}
                          district={workplaces.find(place => place.id === selectWorkplaces[0]).address.district}
                          handleClose={handleCloseModalEditPeopleInWorkplace}
                        />
                      }
                      <p className="fw-bold border-bottom text-center my-2">
                        Funcionários
                      </p>
                      <ListWithCheckboxMUI
                        columns={peopleColumns}
                        rows={peopleRows}
                        pageSize={pageSizeTablePeopleInWorkplaces}
                        pageSizeOptions={pageSizeOptionsTablePeopleInWorkplaces}
                        onChangeSelection={handleDefineSelectPeopleInWorkplaces}
                        onPageSizeChange={handleChangePageSizeTablePeopleInWorkplaces}
                      />
                      <div className='d-flex flex-column flex-md-row'>
                        <button
                          type="button"
                          className="btn btn-link"
                          disabled={selectPeopleInWorkplaces.length <= 0}
                          onClick={() => {
                            const filtered = selectPeopleInWorkplaces.filter(id => {
                              if (appliedPeopleInWorkplaces.find(applied => applied.id === id))
                                return false;

                              return true;
                            });

                            if (filtered.length > 0)
                              handleAppendAppliedPeopleInWorkplaces(people.filter(person => filtered.includes(person.id)));
                          }}
                        >
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'check')}
                            className="me-1 flex-shrink-1 my-auto"
                          /> Aplicar
                        </button>
                        <button
                          type="button"
                          className="btn btn-link"
                          disabled={selectPeopleInWorkplaces.length <= 0}
                          onClick={() => handleRemoveAppliedPeopleInWorkplaces(people.filter(person => selectPeopleInWorkplaces.includes(person.id)))}
                        >
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'times')}
                            className="me-1 flex-shrink-1 my-auto"
                          /> Desaplicar
                        </button>
                        <button
                          type="button"
                          className="btn btn-link"
                          disabled={selectPeopleInWorkplaces.length <= 0 || selectPeopleInWorkplaces.length > 1}
                          onClick={handleShowModalEditWorkplace}
                        >
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'edit')}
                            className="me-1 flex-shrink-1 my-auto"
                          /> Atualizar
                        </button>
                        <button
                          type="button"
                          className="btn btn-link"
                          disabled={
                            selectPeopleInWorkplaces.length <= 0 ||
                            lotItems.filter(item =>
                              selectPeopleInWorkplaces.includes(item.person)
                            ).length > 0 ||
                            postings.filter(posting =>
                              selectPeopleInWorkplaces.includes(posting.coverage.id) ||
                              selectPeopleInWorkplaces.includes(posting.covering.id)
                            ).length > 0
                          }
                          onClick={() => handleDeletePeopleInWorkplaces(selectPeopleInWorkplaces)}
                        >
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'minus-square')}
                            className="me-1 flex-shrink-1 my-auto"
                          /> Remover
                        </button>
                        <button
                          type="button"
                          className="btn btn-link"
                          onClick={handleShowModalRegisterPeopleInWorkplace}
                        >
                          <FontAwesomeIcon
                            icon={Icon.render('fas', 'plus-square')}
                            className="me-1 flex-shrink-1 my-auto"
                          /> Adicionar
                        </button>
                      </div>
                    </div>
                  )
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

  const [showModalRegisterWorkplace, setShowModalRegisterWorkplace] = useState<boolean>(false)
  const [showModalEditWorkplace, setShowModalEditWorkplace] = useState<boolean>(false)

  const [showModalRegisterPeopleInWorkplace, setShowModalRegisterPeopleInWorkplace] = useState<boolean>(false)
  const [showModalEditPeopleInWorkplace, setShowModalEditPeopleInWorkplace] = useState<boolean>(false)

  const [assistantStep, setAssistantStep] = useState<number>(0)
  const [assistantFinish, setAssistantFinish] = useState<boolean>(false)

  const [costCenter, setCostCenter] = useState<string>('')
  const [periodStart, setPeriodStart] = useState<Date>(new Date())
  const [periodEnd, setPeriodEnd] = useState<Date>(new Date())

  const [selectWorkplaces, setSelectWorkplaces] = useState<string[]>([])
  const [appliedWorkplaces, setAppliedWorkplaces] = useState<Workplace[]>([])

  const [pageSizeTableWorkplaces, setPageSizeTableWorkplaces] = useState<number>(10)
  const pageSizeOptionsTableWorkplaces = [10, 25, 50, 100];

  const [selectPeopleInWorkplaces, setSelectPeopleInWorkplaces] = useState<string[]>([])
  const [appliedPeopleInWorkplaces, setAppliedPeopleInWorkplaces] = useState<Person[]>([])

  const [pageSizeTablePeopleInWorkplaces, setPageSizeTablePeopleInWorkplaces] = useState<number>(10)
  const pageSizeOptionsTablePeopleInWorkplaces = [10, 25, 50, 100];

  const
    dispatch = useAppDispatch(),
    workplaces = useAppSelector((state) => state.system.workplaces || []),
    people = useAppSelector((state) => state.system.people || []),
    scales = useAppSelector((state) => state.system.scales || []),
    services = useAppSelector((state) => state.system.services || []),
    streets = useAppSelector((state) => state.system.streets || []),
    neighborhoods = useAppSelector((state) => state.system.neighborhoods || []),
    cities = useAppSelector((state) => state.system.cities || []),
    districts = useAppSelector((state) => state.system.districts || []),
    lotItems = useAppSelector((state) => state.payback.lotItems || []),
    postings = useAppSelector((state) => state.payback.postings || []);

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
    handleChangeAssistantStep = (step: number) => setAssistantStep(step),
    handleFinishAssistant = () => setAssistantFinish(true),
    hasCompletedAssistantStep = (step: number) => {
      switch (step) {
        case 0:
          return appliedWorkplaces.length > 0 &&
            costCenter.length > 0 &&
            periodStart !== null &&
            periodEnd !== null
        case 1:
          return true;
        default:
          return false
      }
    },
    handleChangePageSizeTableWorkplaces = (pageSize: number) => setPageSizeTableWorkplaces(pageSize),
    handleChangePageSizeTablePeopleInWorkplaces = (pageSize: number) => setPageSizeTablePeopleInWorkplaces(pageSize),
    handleDefineCostCenter = (title: string) => {
      if (title === 'Centro de Custo')
        setCostCenter('');
      else
        setCostCenter(title);
    },
    handleResetCostCenter = () => setCostCenter(''),
    handleShowModalRegisterWorkplace = () => setShowModalRegisterWorkplace(true),
    handleShowModalRegisterPeopleInWorkplace = () => setShowModalRegisterPeopleInWorkplace(true),
    handleCloseModalRegisterWorkplace = () => setShowModalRegisterWorkplace(false),
    handleCloseModalRegisterPeopleInWorkplace = () => setShowModalRegisterPeopleInWorkplace(false),
    handleShowModalEditWorkplace = () => setShowModalEditWorkplace(true),
    handleShowModalEditPeopleInWorkplace = () => setShowModalEditPeopleInWorkplace(true),
    handleCloseModalEditWorkplace = () => setShowModalEditWorkplace(false),
    handleCloseModalEditPeopleInWorkplace = () => setShowModalEditPeopleInWorkplace(false),
    handleDefineSelectWorkplaces = (itens: string[]) => setSelectWorkplaces(itens),
    handleDefineSelectPeopleInWorkplaces = (itens: string[]) => setSelectPeopleInWorkplaces(itens),
    handleDeleteWorkplaces = (itens: string[]) => itens.forEach(id => dispatch(removeWorkplace(id))),
    handleDeletePeopleInWorkplaces = (itens: string[]) => itens.forEach(id => dispatch(removePerson(id))),
    handleAppendAppliedWorkplaces = (itens: Workplace[]) => setAppliedWorkplaces([...appliedWorkplaces, ...itens]),
    handleAppendAppliedPeopleInWorkplaces = (itens: Person[]) => setAppliedPeopleInWorkplaces([...appliedPeopleInWorkplaces, ...itens]),
    handleRemoveAppliedWorkplaces = (itens: Workplace[]) => {
      setAppliedWorkplaces(appliedWorkplaces.filter(item => !itens.some(item2 => item2.id === item.id)))
    },
    handleRemoveAppliedPeopleInWorkplaces = (itens: Person[]) => {
      setAppliedPeopleInWorkplaces(appliedPeopleInWorkplaces.filter(item => !itens.some(item2 => item2.id === item.id)))
    }

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
    assistantStep,
    assistantFinish,
    handleChangeAssistantStep,
    handleFinishAssistant,
    hasCompletedAssistantStep,
    pageSizeTableWorkplaces,
    pageSizeTablePeopleInWorkplaces,
    pageSizeOptionsTableWorkplaces,
    pageSizeOptionsTablePeopleInWorkplaces,
    handleChangePageSizeTableWorkplaces,
    handleChangePageSizeTablePeopleInWorkplaces,
    costCenter,
    handleDefineCostCenter,
    handleResetCostCenter,
    periodStart,
    setPeriodStart,
    periodEnd,
    setPeriodEnd,
    workplaces,
    showModalRegisterWorkplace,
    showModalRegisterPeopleInWorkplace,
    showModalEditWorkplace,
    showModalEditPeopleInWorkplace,
    handleShowModalRegisterWorkplace,
    handleShowModalRegisterPeopleInWorkplace,
    handleCloseModalRegisterWorkplace,
    handleCloseModalRegisterPeopleInWorkplace,
    handleShowModalEditWorkplace,
    handleShowModalEditPeopleInWorkplace,
    handleCloseModalEditWorkplace,
    handleCloseModalEditPeopleInWorkplace,
    scales,
    services,
    streets,
    neighborhoods,
    cities,
    districts,
    selectWorkplaces,
    selectPeopleInWorkplaces,
    handleDefineSelectWorkplaces,
    handleDefineSelectPeopleInWorkplaces,
    handleDeleteWorkplaces,
    handleDeletePeopleInWorkplaces,
    people,
    appliedWorkplaces,
    appliedPeopleInWorkplaces,
    handleAppendAppliedWorkplaces,
    handleAppendAppliedPeopleInWorkplaces,
    handleRemoveAppliedWorkplaces,
    handleRemoveAppliedPeopleInWorkplaces,
    lotItems,
    postings,
  )
}

export default Register
