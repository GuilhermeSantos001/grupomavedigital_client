/**
 * @description Payback -> Lançamentos Financeiros -> Cadastro
 * @author GuilhermeSantos001
 * @update 10/02/2022
 */

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import Button from '@mui/material/Button'

import NoPrivilege, { handleClickFunction } from '@/components/noPrivilege'
import NoAuth from '@/components/noAuth'

import SelectCostCenter from '@/components/selects/selectCostCenter'
import MobileDatePicker from '@/components/selects/mobileDatePicker'
import AssistantPostingsRegister from '@/components/assistants/assistantPostingsRegister'
import AssistantCoverageDefine from '@/components/assistants/assistantCoverageDefine'
import ListWithCheckboxMUI from '@/components/lists/listWithCheckboxMUI'
import ListWorkplacesSelected from '@/components/lists/listWorkplacesSelected'
import RegisterWorkplace from '@/components/modals/registerWorkplace'
import RegisterPeople from '@/components/modals/registerPeople'
import EditWorkplace from '@/components/modals/editWorkplace'
import EditPeople from '@/components/modals/editPeople'
import ListCoverageDefined from '@/components/lists/listCoverageDefined'

import { PageProps } from '@/pages/_app'
import PageMenu from '@/bin/main_menu'

import SocketIO from '@/components/socket-io'
import {
  PaybackSocketEvents
} from '@/constants/socketEvents'
import {
  TYPEOF_EMITTER_PAYBACK_DELETE_MIRROR,
  TYPEOF_LISTENER_PAYBACK_DELETE_MIRROR,
} from '@/constants/SocketTypes'

import Variables from '@/src/db/variables'
import hasPrivilege from '@/src/functions/hasPrivilege'
import Alerting from '@/src/utils/alerting'
import StringEx from '@/src/utils/stringEx'
import DateEx from '@/src/utils/dateEx'

import getWorkPlaceForTable from '@/src/functions/getWorkPlaceForTable'
import getPeopleForTable from '@/src/functions/getPeopleForTable'

import { useAppSelector, useAppDispatch } from '@/app/hooks'

import type {
  CostCenter,
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
  SystemActions
} from '@/app/features/system/system.slice'

import {
  LotItem,
  Posting,
  PaybackActions,
} from '@/app/features/payback/payback.slice'

const serverSideProps: PageProps = {
  title: 'Lançamentos/Cadastro',
  description: 'Cadastro de lançamentos operacionais',
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

function compose_noPrivilege(handleClick: handleClickFunction) {
  return <NoPrivilege handleClick={handleClick} />
}

function compose_noAuth(handleClick: handleClickFunction) {
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
  costCenters: CostCenter[],
  costCenter: string,
  handleChangeCostCenter: (id: string) => void,
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
  handleDeleteWorkplaces: (ids: string[]) => void,
  handleDeletePeopleInWorkplaces: (ids: string[]) => void,
  people: Person[],
  appliedWorkplaces: Workplace[],
  appliedPeopleInWorkplaces: Person[],
  handleAppendAppliedWorkplaces: (itens: Workplace[]) => void,
  handleAppendAppliedPeopleInWorkplaces: (itens: Person[]) => void,
  handleRemoveAppliedWorkplaces: (itens: Workplace[]) => void,
  handleRemoveAppliedPeopleInWorkplaces: (itens: Person[]) => void,
  lotItems: LotItem[],
  postings: Posting[],
  showModalAssistantCoverageDefine: boolean,
  handleOpenModalAssistantCoverageDefine: () => void,
  handleCloseModalAssistantCoverageDefine: () => void,
  postingsDefined: Posting[],
  handleAppendPostingDefined: (postings: Posting[]) => void,
  handleDefinePostingDefined: (postings: Posting[]) => void,
  handleResetPostingDefined: () => void,
  handleRemovePostingDefined: (id: string) => void,
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
      ),
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

  return (
    <>
      <SocketIO />
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
                          id={workplaces.find(place => place.id === selectWorkplaces[0])?.id || ""}
                          name={workplaces.find(place => place.id === selectWorkplaces[0])?.name || ""}
                          entryTime={workplaces.find(place => place.id === selectWorkplaces[0])?.entryTime || ""}
                          exitTime={workplaces.find(place => place.id === selectWorkplaces[0])?.exitTime || ""}
                          services={workplaces.find(place => place.id === selectWorkplaces[0])?.services || []}
                          scale={workplaces.find(place => place.id === selectWorkplaces[0])?.scale || ""}
                          street={workplaces.find(place => place.id === selectWorkplaces[0])?.address.street || ""}
                          numberHome={workplaces.find(place => place.id === selectWorkplaces[0])?.address.number || 0}
                          complement={workplaces.find(place => place.id === selectWorkplaces[0])?.address.complement || ""}
                          zipCode={workplaces.find(place => place.id === selectWorkplaces[0])?.address.zipCode || 0}
                          neighborhood={workplaces.find(place => place.id === selectWorkplaces[0])?.address.neighborhood || ""}
                          city={workplaces.find(place => place.id === selectWorkplaces[0])?.address.city || ""}
                          district={workplaces.find(place => place.id === selectWorkplaces[0])?.address.district || ""}
                          handleClose={handleCloseModalEditWorkplace}
                        />
                      }
                      <p className="fw-bold border-bottom text-center my-2">
                        Informações Básicas
                      </p>
                      <div className='d-flex flex-column flex-md-row my-2'>
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
                      </div>
                      <SelectCostCenter
                        costCenter={costCenters.find(_costCenter => _costCenter.id === costCenter)}
                        disabled={postingsDefined.length > 0}
                        handleChangeCostCenter={handleChangeCostCenter}
                      />
                      <div className='d-flex flex-column flex-md-row my-2'>
                        <MobileDatePicker
                          className="col px-2 my-2"
                          label="Período de Apuração (Inicial)"
                          value={periodStart}
                          maxDate={periodEnd}
                          minDate={DateEx.subDays(new Date(), 7)}
                          disabled={postingsDefined.length > 0}
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
                          disabled={postingsDefined.length > 0}
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
                        selectPeopleInWorkplaces.length === 1 &&
                        <EditPeople
                          show={showModalEditPeopleInWorkplace}
                          id={people.find(person => person.id === selectPeopleInWorkplaces[0])?.id || ""}
                          matricule={people.find(person => person.id === selectPeopleInWorkplaces[0])?.matricule || 0}
                          name={people.find(person => person.id === selectPeopleInWorkplaces[0])?.name || ""}
                          cpf={people.find(person => person.id === selectPeopleInWorkplaces[0])?.cpf || ""}
                          rg={people.find(person => person.id === selectPeopleInWorkplaces[0])?.rg || ""}
                          motherName={people.find(person => person.id === selectPeopleInWorkplaces[0])?.motherName || ""}
                          birthDate={people.find(person => person.id === selectPeopleInWorkplaces[0])?.birthDate || ""}
                          phone={people.find(person => person.id === selectPeopleInWorkplaces[0])?.phone || ""}
                          mail={people.find(person => person.id === selectPeopleInWorkplaces[0])?.mail || ""}
                          scale={people.find(person => person.id === selectPeopleInWorkplaces[0])?.scale || ""}
                          cards={people.find(person => person.id === selectPeopleInWorkplaces[0])?.cards || []}
                          services={people.find(person => person.id === selectPeopleInWorkplaces[0])?.services || []}
                          street={people.find(person => person.id === selectPeopleInWorkplaces[0])?.address.street || ""}
                          numberHome={people.find(person => person.id === selectPeopleInWorkplaces[0])?.address.number || 0}
                          complement={people.find(person => person.id === selectPeopleInWorkplaces[0])?.address.complement || ""}
                          neighborhood={people.find(person => person.id === selectPeopleInWorkplaces[0])?.address.neighborhood || ""}
                          city={people.find(person => person.id === selectPeopleInWorkplaces[0])?.address.city || ""}
                          district={people.find(person => person.id === selectPeopleInWorkplaces[0])?.address.district || ""}
                          zipCode={people.find(person => person.id === selectPeopleInWorkplaces[0])?.address.zipCode || 0}
                          handleClose={handleCloseModalEditPeopleInWorkplace}
                        />
                      }
                      <ListCoverageDefined
                        postings={postingsDefined}
                        disabledPostingRemove={assistantFinish}
                        handlePostingRemove={handleRemovePostingDefined}
                      />
                      <Button
                        variant="outlined"
                        disabled={assistantFinish}
                        onClick={() => searchPostingsDefined()}
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
                        disabled={assistantFinish || postingsDefined.length <= 0}
                        className='col-12 m-2'
                        color={'error'}
                      >
                        <FontAwesomeIcon
                          icon={Icon.render('fas', 'history')}
                          className="me-2 flex-shrink-1 my-auto"
                        />
                        Limpar Coberturas Aplicadas
                      </Button>
                      <AssistantCoverageDefine
                        show={showModalAssistantCoverageDefine}
                        availableWorkplaces={appliedWorkplaces.map(place => place.id)}
                        availablePeopleInWorkplace={appliedPeopleInWorkplaces.map(person => person.id)}
                        postingCostCenter={costCenter}
                        periodStart={periodStart}
                        periodEnd={periodEnd}
                        handleFinish={(postings: Posting[]) => {
                          if (postings.length > 0) {
                            Alerting.create('success', 'Cobertura(s) aplicada(s) com sucesso!');
                            handleAppendPostingDefined(postings);
                          }
                        }}
                        handleClose={() => {
                          handleRemoveAppliedPeopleInWorkplaces(appliedPeopleInWorkplaces);
                          handleCloseModalAssistantCoverageDefine();
                        }}
                      />
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
                          disabled={assistantFinish || selectPeopleInWorkplaces.length <= 0 || selectPeopleInWorkplaces.length % 2 !== 0}
                          onClick={() => {
                            const filtered = selectPeopleInWorkplaces.filter(id => {
                              if (appliedPeopleInWorkplaces.find(applied => applied.id === id))
                                return false;

                              return true;
                            });

                            if (filtered.length > 0) {
                              handleAppendAppliedPeopleInWorkplaces(people.filter(person => filtered.includes(person.id)));
                              handleOpenModalAssistantCoverageDefine();
                            }
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
                          disabled={assistantFinish || selectPeopleInWorkplaces.length <= 0 || selectPeopleInWorkplaces.length > 1}
                          onClick={handleShowModalEditPeopleInWorkplace}
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
                            assistantFinish ||
                            selectPeopleInWorkplaces.length <= 0 ||
                            lotItems.filter(item =>
                              item.person &&
                              selectPeopleInWorkplaces.includes(item.person)
                            ).length > 0 ||
                            postings.filter(posting =>
                              selectPeopleInWorkplaces.includes(posting.coverage.id) ||
                              posting.covering &&
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
                          disabled={assistantFinish}
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

export default function Register() {
  const
    dispatch = useAppDispatch(),
    costCenters = useAppSelector(state => state.system.costCenters || []),
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

  const [isReady, setReady] = useState<boolean>(false)
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

  const [showModalAssistantCoverageDefine, setShowModalAssistantCoverageDefine] = useState<boolean>(false)

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
    handleChangeAssistantStep = (step: number) => setAssistantStep(step),
    handleFinishAssistant = () => {
      Alerting.create('success', 'Muito Bem!, Você já pode tomar um café.');
      Alerting.create('warning', 'Não esqueça de avisar o coordenador que os lançamentos foram registrados, e ele já pode apura-los.');
      setAssistantFinish(true);
    },
    hasCompletedAssistantStep = (step: number) => {
      switch (step) {
        case 0:
          return appliedWorkplaces.length > 0 &&
            appliedWorkplaces.length % 2 == 0 &&
            costCenter.length > 0 &&
            periodStart !== null &&
            periodEnd !== null
        case 1:
          return postingsDefined.length > 0;
        default:
          return false
      }
    },
    handleChangePageSizeTableWorkplaces = (pageSize: number) => setPageSizeTableWorkplaces(pageSize),
    handleChangePageSizeTablePeopleInWorkplaces = (pageSize: number) => setPageSizeTablePeopleInWorkplaces(pageSize),
    handleChangeCostCenter = (id: string) => setCostCenter(id),
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
    handleDeleteWorkplaces = (ids: string[]) => ids.forEach(id => {
      try {
        dispatch(SystemActions.DELETE_WORKPLACE(id))
      } catch (error) {
        Alerting.create('error', error instanceof Error ? error.message : JSON.stringify(error));
      }
    }),
    handleDeletePeopleInWorkplaces = (ids: string[]) => ids.forEach(id => {
      try {
        dispatch(SystemActions.DELETE_PERSON(id))
      } catch (error) {
        Alerting.create('error', error instanceof Error ? error.message : JSON.stringify(error));
      }
    }),
    handleAppendAppliedWorkplaces = (itens: Workplace[]) => setAppliedWorkplaces([...appliedWorkplaces, ...itens]),
    handleAppendAppliedPeopleInWorkplaces = (itens: Person[]) => setAppliedPeopleInWorkplaces([...appliedPeopleInWorkplaces, ...itens]),
    handleRemoveAppliedWorkplaces = (itens: Workplace[]) => {
      setAppliedWorkplaces(appliedWorkplaces.filter(item => !itens.some(item2 => item2.id === item.id)))
    },
    handleRemoveAppliedPeopleInWorkplaces = (itens: Person[]) => {
      setAppliedPeopleInWorkplaces(appliedPeopleInWorkplaces.filter(item => !itens.some(item2 => item2.id === item.id)))
    },
    handleOpenModalAssistantCoverageDefine = () => setShowModalAssistantCoverageDefine(true),
    handleCloseModalAssistantCoverageDefine = () => setShowModalAssistantCoverageDefine(false),
    handleAppendPostingDefined = (postings: Posting[]) => setPostingsDefined([...postingsDefined, ...postings]),
    handleDefinePostingDefined = (postings: Posting[]) => setPostingsDefined(postings),
    handleResetPostingDefined = () => setPostingsDefined([]),
    handleRemovePostingDefined = (id: string) => {
      try {
        const
          posting = postings.find(item => item.id === id),
          deleteMirrors = [];

        if (posting) {
          if (posting.covering && posting.covering.mirror)
            deleteMirrors.push(posting.covering.mirror.fileId);

          if (posting.coverage && posting.coverage.mirror)
            deleteMirrors.push(posting.coverage.mirror.fileId);

          if (deleteMirrors.length > 0)
            handleRemoveUploadedFile(deleteMirrors);

          dispatch(PaybackActions.DELETE_POSTING(id));
          setPostingsDefined(postingsDefined.filter(item => item.id !== id));
        } else {
          throw new Error('Lançamento financeiro não encontrado.');
        }
      } catch (error) {
        Alerting.create('error', error instanceof Error ? error.message : JSON.stringify(error));
      }
    },
    handleRemoveUploadedFile = (filesId: string[]) =>
      window.socket.emit(
        PaybackSocketEvents.PAYBACK_DELETE_MIRROR,
        window.socket.compress<TYPEOF_EMITTER_PAYBACK_DELETE_MIRROR>({
          filesId
        })
      ),
    handleDeleteUpload = (fileId: string) => dispatch(SystemActions.DELETE_UPLOAD(fileId));

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

  if (isReady) {
    onSocketEvents(handleDeleteUpload);

    return compose_ready(
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
      costCenters,
      costCenter,
      handleChangeCostCenter,
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
      showModalAssistantCoverageDefine,
      handleOpenModalAssistantCoverageDefine,
      handleCloseModalAssistantCoverageDefine,
      postingsDefined,
      handleAppendPostingDefined,
      handleDefinePostingDefined,
      handleResetPostingDefined,
      handleRemovePostingDefined,
    )
  }
}

/**
 * @description Adiciona os ouvintes dos eventos do socket.io
 */
function onSocketEvents(
  handleDeleteUpload: (fileId: string) => void
) {
  const socket = window.socket;

  if (socket) {
    const
      events = [
        `${PaybackSocketEvents.PAYBACK_DELETE_MIRROR}-SUCCESS`,
        `${PaybackSocketEvents.PAYBACK_DELETE_MIRROR}-FAILURE`,
      ]

    events
      .forEach(event => {
        if (socket.hasListeners(event))
          socket.off(event);
      })

    socket
      .on(
        events[0], // * PAYBACK-DELETE-MIRROR-SUCCESS
        (
          data: string
        ) => {
          const {
            filesId
          } = window.socket.decompress<TYPEOF_LISTENER_PAYBACK_DELETE_MIRROR>(data);
          filesId.forEach(fileId => handleDeleteUpload(fileId));
        }
      )

    socket
      .on(
        events[1], // * PAYBACK-DELETE-MIRROR-FAILURE
        (error: string) => console.error(error)
      )
  }
}