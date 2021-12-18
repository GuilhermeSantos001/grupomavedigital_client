/**
 * @description Componente do painel de "Contas a Receber"
 * @author @GuilhermeSantos001
 * @update 13/10/2021
 */

import React from 'react'

import moment from 'moment'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import {
  RotateSpinner,
  CubeSpinner,
  GooSpinner,
  WaveSpinner,
} from 'react-spinners-kit'

import type * as Chart from 'chart.js'
import { Line } from 'react-chartjs-2'
import randomColor from 'randomcolor'

import Fetch from '@/src/utils/fetch'
import getFilial, { Filial } from '@/src/functions/getFilial'
import getClients, { Client } from '@/src/functions/getClients'
import getBillsType, { BillsType } from '@/src/functions/getBillsType'
import getBankingNatures, {
  BankingNatures,
} from '@/src/functions/getBankingNatures'
import dashboardReceive, { Receive } from '@/src/functions/dashboardReceive'
import getChartDataRevenuesByMonthly from '@/src/functions/getChartDataRevenuesByMonthly'

import Alerting from '@/src/utils/alerting'
import verifyPeriodIsValid from '@/src/functions/verifyPeriodIsValid'

type MyProps = {
  fetch: Fetch
}

type MyState = {
  loading: boolean
  loadingData: boolean
  loadingChart: boolean
  infoDataLoaded: boolean
  infoDataLoadedError: boolean
  receives: Receive[]
  branchs: Filial[]
  branchSelected: string
  branchsOptions: JSX.Element[]
  clients: Client[]
  clientSelected: string
  clientsOptions: JSX.Element[]
  billsType: BillsType[]
  billsTypeSelected: string
  billsTypeOptions: JSX.Element[]
  bankingNatures: BankingNatures[]
  bankingNaturesSelected: string
  bankingNaturesOptions: JSX.Element[]
  period: string[]
}

export default class ChartBillsReceive extends React.Component<
  MyProps,
  MyState
> {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      loadingData: true,
      loadingChart: false,
      infoDataLoaded: false,
      infoDataLoadedError: false,
      receives: undefined,
      branchs: undefined,
      branchSelected: 'Selecionar',
      branchsOptions: undefined,
      clients: undefined,
      clientSelected: 'Selecionar',
      clientsOptions: undefined,
      billsType: undefined,
      billsTypeSelected: 'Selecionar',
      billsTypeOptions: undefined,
      bankingNatures: undefined,
      bankingNaturesSelected: 'Selecionar',
      bankingNaturesOptions: undefined,
      period: ['', ''],
    }
  }

  componentDidMount() {
    const timer = setTimeout(async () => {
      const branchs = await getFilial(this.props.fetch, true),
        billsType = await getBillsType(this.props.fetch, true),
        bankingNatures = await getBankingNatures(this.props.fetch, true)

      this.setState({
        branchs,
        branchsOptions: branchs.map((branch) => {
          return (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          )
        }),
        billsType,
        billsTypeOptions: billsType.map((bills) => {
          return (
            <option key={`${bills.key}-${bills.filial}`} value={bills.key}>
              {`${bills.description} (${bills.key})`}
            </option>
          )
        }),
        bankingNatures,
        bankingNaturesOptions: bankingNatures.map((natures) => {
          return (
            <option key={`${natures.filial}-${natures.id}`} value={natures.id}>
              {`${natures.description} (${natures.id})`}
            </option>
          )
        }),
        loading: false,
        loadingData: false,
      })

      clearTimeout(timer)
    })
  }

  render() {
    if (this.state.loading) return this.render_loading()

    return this.render_ready()
  }

  render_loading() {
    return (
      <div className="d-flex justify-content-center p-2">
        <RotateSpinner size={42} color={'#004a6e'} loading={true} />
      </div>
    )
  }

  render_loading_chart() {
    return (
      <div className="d-flex justify-content-center p-2">
        <WaveSpinner size={42} color={'#004a6e'} loading={true} />
      </div>
    )
  }

  render_ready() {
    return (
      <>
        <div className="row g-2 border-bottom">
          <div className="d-flex flex-column flex-md-row">
            <div className="col-12 col-md-4">
              <div className="p-2">
                <div className="form-floating">
                  <select
                    className="form-select"
                    id="select-filial"
                    aria-label="Selecionar Filial"
                    value={this.state.branchSelected}
                    onChange={(e) => this.handleChangeBranch(e)}
                    disabled={this.state.loadingData ? true : false}
                  >
                    <option>Selecionar</option>
                    <option>Todos</option>
                    {this.state.branchsOptions}
                  </select>
                  <label htmlFor="select-filial">Filial</label>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-2">
                <div className="form-floating">
                  <select
                    className="form-select"
                    id="select-client"
                    aria-label="Selecionar Cliente"
                    value={this.state.clientSelected}
                    onChange={(e) => this.handleChangeClient(e)}
                    disabled={
                      this.state.loadingData ||
                      this.state.branchSelected === 'Selecionar'
                        ? true
                        : false
                    }
                  >
                    <option>Selecionar</option>
                    <option>Todos</option>
                    {this.state.clientsOptions}
                  </select>
                  <label htmlFor="select-client">Cliente</label>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-2">
                <div className="form-floating">
                  <select
                    className="form-select"
                    id="select-bills"
                    aria-label="Selecionar tipo de título"
                    value={this.state.billsTypeSelected}
                    onChange={(e) => this.handleChangeBillsType(e)}
                    disabled={this.state.loadingData ? true : false}
                  >
                    <option>Selecionar</option>
                    <option>Todos</option>
                    {this.state.billsTypeOptions}
                  </select>
                  <label htmlFor="select-bills">Tipo de Título</label>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column flex-md-row">
            <div className="col-12 col-md-4">
              <div className="p-2">
                <div className="form-floating">
                  <select
                    className="form-select"
                    id="select-bankingNatures"
                    aria-label="Selecionar Natureza Financeira"
                    value={this.state.bankingNaturesSelected}
                    onChange={(e) => this.handleChangeBankingNatures(e)}
                    disabled={this.state.loadingData ? true : false}
                  >
                    <option>Selecionar</option>
                    <option>Todos</option>
                    {this.state.bankingNaturesOptions}
                  </select>
                  <label htmlFor="select-bankingNatures">
                    Natureza Financeira
                  </label>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-2">
                <div className="form-floating">
                  <input
                    id="input-date-start"
                    type="date"
                    min="2016-01-01"
                    max={this.state.period[1]}
                    className="form-control"
                    aria-label="Selecione o período inicial"
                    aria-describedby="date-addon"
                    onChange={(e) => this.handleChangePeriod(e, 'start')}
                    value={this.state.period[0]}
                    disabled={this.state.loadingData ? true : false}
                  />
                  <label htmlFor="input-date-start">Período Inicial</label>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-2">
                <div className="form-floating">
                  <input
                    id="input-date-end"
                    type="date"
                    min={this.state.period[0]}
                    max={new Date()
                      .toLocaleDateString()
                      .replace(/\//g, '-')
                      .split('-')
                      .reverse()
                      .join('-')}
                    className="form-control"
                    aria-label="Selecione o período Final"
                    aria-describedby="date-addon"
                    onChange={(e) => this.handleChangePeriod(e, 'end')}
                    value={this.state.period[1]}
                    disabled={this.state.loadingData ? true : false}
                  />
                  <label htmlFor="input-date-end">Período Final</label>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column flex-md-row">
            <div className="col-12">
              <div className="p-2">
                <button
                  type="button"
                  className="btn btn-primary d-flex flex-row col-12 fs-5"
                  disabled={
                    this.hasHandleFilter() &&
                    !this.state.loadingData &&
                    !this.state.loadingChart &&
                    !this.state.loading
                      ? false
                      : true
                  }
                  onClick={() => this.handleClickFilter()}
                >
                  <div className="col-10 text-start">
                    <p className="my-auto">Filtrar</p>
                  </div>
                  <div className="col-2 text-end my-auto">
                    <FontAwesomeIcon
                      icon={Icon.render('fas', 'filter')}
                      className="flex-shrink-1 text-secondary"
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        {this.state.loadingData ? (
          <div className="mb-2">{this.render_loading()}</div>
        ) : !this.state.infoDataLoaded ? (
          <>
            <div className="d-flex justify-content-center p-2">
              <GooSpinner size={42} color={'#A1A1A1'} loading={true} />
            </div>
            <div className="d-flex justify-content-center p-2">
              <div className="row text-center">
                <div className="col-12">
                  <p className="text-muted">
                    Defina os filtros a cima para exibir o conteúdo.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
        {this.state.infoDataLoaded ? this.render_information() : <></>}
        {this.state.infoDataLoadedError ? this.render_error() : <></>}
      </>
    )
  }

  render_information() {
    let filialName = 'Todos',
      clientName = 'Todos',
      billsType = 'Todos',
      bankingNature = 'Todos',
      grossValueTotal = 0,
      liquidValue = 0,
      balanceValue = 0,
      IRRF_total = 0,
      ISS_total = 0,
      INSS_total = 0,
      CSLL_total = 0,
      COFINS_total = 0,
      PIS_total = 0

    if (this.state.branchSelected !== 'Todos')
      filialName = (() => {
        let value = '???',
          branch = this.state.branchs.find(
            (branch) => branch.id === this.state.branchSelected
          )

        if (branch) value = branch.name

        return value
      })()

    if (this.state.clientSelected !== 'Todos')
      clientName = (() => {
        let value = '???',
          client = this.state.clients.find(
            (client) =>
              client.id === this.state.clientSelected.split('-')[0] &&
              client.store === this.state.clientSelected.split('-')[1]
          )

        if (client) value = client.name

        return value
      })()

    if (this.state.billsTypeSelected !== 'Todos')
      billsType = (() => {
        let value = '???',
          type = this.state.billsType.find(
            (type) => type.key === this.state.billsTypeSelected
          )

        if (type) value = type.key

        return value
      })()

    if (this.state.bankingNaturesSelected !== 'Todos')
      bankingNature = (() => {
        let value = '???',
          type = this.state.bankingNatures.find(
            (nature) => nature.id === this.state.bankingNaturesSelected
          )

        if (type) value = type.id

        return value
      })()

    this.state.receives.forEach((receive) => {
      grossValueTotal += parseFloat(receive.grossValue)
      liquidValue += parseFloat(receive.liquidValue)
      balanceValue += parseFloat(receive.balanceValue)
      IRRF_total += parseFloat(receive.taxes.IRRF)
      ISS_total += parseFloat(receive.taxes.ISS)
      INSS_total += parseFloat(receive.taxes.INSS)
      CSLL_total += parseFloat(receive.taxes.CSLL)
      COFINS_total += parseFloat(receive.taxes.COFINS)
      PIS_total += parseFloat(receive.taxes.PIS)
    })

    return (
      <div className="chart active col-12 p-2">
        <div className="bg-primary bg-gradient rounded col-12 p-2">
          <h2 className="my-auto text-secondary">Cliente: {clientName}</h2>
        </div>
        <div className="container-fluid">
          <div className="row gx-2">
            <div className="d-flex flex-column flex-md-row">
              <div className="col-12 col-md-2 my-2">
                <div className="px-1">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control fw-bold"
                      id="input-filial-name"
                      value={filialName}
                      disabled={true}
                    />
                    <label htmlFor="input-filial-name">Filial</label>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-2 my-2">
                <div className="px-1">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control fw-bold"
                      id="input-receives-length"
                      value={this.state.receives.length}
                      disabled={true}
                    />
                    <label htmlFor="input-receives-length">
                      Títulos emitidos
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-1 my-2">
                <div className="px-1">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control fw-bold"
                      id="input-bills-type"
                      value={billsType}
                      disabled={true}
                    />
                    <label htmlFor="input-bills-type">Tipo</label>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-1 my-2">
                <div className="px-1">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control fw-bold"
                      id="input-banking-nature"
                      value={bankingNature}
                      disabled={true}
                    />
                    <label htmlFor="input-banking-nature">Natureza</label>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-3 my-2">
                <div className="px-1">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control fw-bold"
                      id="input-grossValue-total"
                      value={`R$ ${grossValueTotal.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                      })}`}
                      disabled={true}
                    />
                    <label htmlFor="input-grossValue-total">Valor bruto</label>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-3 my-2">
                <div className="px-1">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control fw-bold"
                      id="input-liquidValue-total"
                      value={`R$ ${liquidValue.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                      })}`}
                      disabled={true}
                    />
                    <label htmlFor="input-liquidValue-total">Valor real</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row">
              <div className="col-12 col-md-6 my-2">
                <div className="px-1">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control fw-bold"
                      id="input-request-value"
                      value={`R$ ${Math.floor(
                        grossValueTotal - balanceValue
                      ).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                      })}`}
                      disabled={true}
                    />
                    <label htmlFor="input-request-value">Valor recebido</label>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 my-2">
                <div className="px-1">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control fw-bold"
                      id="input-balanceValue-total"
                      value={`R$ ${balanceValue.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                      })}`}
                      disabled={true}
                    />
                    <label htmlFor="input-balanceValue-total">
                      Valor a receber
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row">
              <div className="col-12 col-md-2 my-2">
                <div className="px-1">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control fw-bold"
                      id="input-irrf-value"
                      value={`R$ ${IRRF_total.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                      })}`}
                      disabled={true}
                    />
                    <label htmlFor="input-irrf-value">IRRF</label>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-2 my-2">
                <div className="px-1">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control fw-bold"
                      id="input-iss-value"
                      value={`R$ ${ISS_total.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                      })}`}
                      disabled={true}
                    />
                    <label htmlFor="input-iss-value">ISS</label>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-2 my-2">
                <div className="px-1">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control fw-bold"
                      id="input-inss-value"
                      value={`R$ ${INSS_total.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                      })}`}
                      disabled={true}
                    />
                    <label htmlFor="input-inss-value">INSS</label>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-2 my-2">
                <div className="px-1">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control fw-bold"
                      id="input-csll-value"
                      value={`R$ ${CSLL_total.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                      })}`}
                      disabled={true}
                    />
                    <label htmlFor="input-csll-value">CSLL</label>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-2 my-2">
                <div className="px-1">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control fw-bold"
                      id="input-cofins-value"
                      value={`R$ ${COFINS_total.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                      })}`}
                      disabled={true}
                    />
                    <label htmlFor="input-cofins-value">COFINS</label>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-2 my-2">
                <div className="px-1">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control fw-bold"
                      id="input-pis-value"
                      value={`R$ ${PIS_total.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                      })}`}
                      disabled={true}
                    />
                    <label htmlFor="input-pis-value">PIS</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render_error() {
    return (
      <>
        <div className="d-flex justify-content-center p-2">
          <CubeSpinner
            size={42}
            backColor={'#696969'}
            frontColor={'#A1A1A1'}
            loading={true}
          />
        </div>
        <div className="d-flex justify-content-center p-2">
          <div className="row text-center border-top p-2">
            <div className="col-12">
              <p className="text-muted">
                Não foi possível carregar o conteúdo.
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

  async handleChangeBranch(e) {
    const value = e.target.value

    this.setState({
      branchSelected: value,
      clientSelected:
        value === 'Selecionar' ? value : this.state.clientSelected,
    })

    if (value !== 'Selecionar') {
      this.setState({
        loadingData: true,
      })

      const clients = await getClients(this.props.fetch, value, true)

      this.setState({
        clients,
        clientsOptions: clients.map((client) => {
          return (
            <option
              key={`${client.id}-${client.fullname}-${client.store}`}
              value={`${client.id}-${client.store}`}
            >
              {client.fullname}
            </option>
          )
        }),
        loadingData: false,
      })
    }
  }

  handleChangeClient(e) {
    const value = e.target.value

    this.setState({
      clientSelected: value,
    })
  }

  handleChangeBillsType(e) {
    const value = e.target.value

    this.setState({
      billsTypeSelected: value,
    })
  }

  handleChangeBankingNatures(e) {
    const value = e.target.value

    this.setState({
      bankingNaturesSelected: value,
    })
  }

  handleChangePeriod(e, position: 'start' | 'end') {
    const value = e.target.value

    this.setState({
      period:
        position === 'start'
          ? [value, this.state.period[1]]
          : [this.state.period[0], value],
    })
  }

  hasHandleFilter() {
    const start = {
        year: this.state.period[0].split('-')[0],
        month: this.state.period[0].split('-')[1],
        day: this.state.period[0].split('-')[2],
      },
      end = {
        year: this.state.period[1].split('-')[0],
        month: this.state.period[1].split('-')[1],
        day: this.state.period[1].split('-')[2],
      }

    if (!verifyPeriodIsValid(start, end)) return false

    return (
      this.state.branchSelected !== 'Selecionar' &&
      this.state.clientSelected !== 'Selecionar' &&
      this.state.billsTypeSelected !== 'Selecionar' &&
      this.state.bankingNaturesSelected !== 'Selecionar' &&
      this.state.period[0].length >= 10 &&
      this.state.period[1].length >= 10
    )
  }

  async handleClickFilter() {
    this.setState({
      loadingData: true,
    })

    const filial =
        this.state.branchSelected !== 'Todos'
          ? this.state.branchSelected
          : null,
      client =
        this.state.clientSelected !== 'Todos'
          ? this.state.clientSelected.split('-')[0]
          : null,
      store =
        this.state.clientSelected !== 'Todos'
          ? this.state.clientSelected.split('-')[1]
          : null,
      type =
        this.state.billsTypeSelected !== 'Todos'
          ? this.state.billsTypeSelected
          : null,
      bankingNature =
        this.state.bankingNaturesSelected !== 'Todos'
          ? this.state.bankingNaturesSelected
          : null

    try {
      const receives = await dashboardReceive(
        this.props.fetch,
        filial,
        client,
        store,
        type,
        bankingNature,
        this.state.period,
        true
      )

      this.setState({
        receives,
        infoDataLoaded: true,
        loadingData: false,
      })
    } catch {
      this.setState({
        infoDataLoadedError: true,
        loadingData: false,
      })
    }
  }
}
