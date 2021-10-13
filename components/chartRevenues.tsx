/**
 * @description Componente do painel de "Faturamento"
 * @author @GuilhermeSantos001
 * @update 08/10/2021
 */

import React from 'react'

import moment from 'moment'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon, { iconsFamily, iconsName } from '@/src/utils/fontAwesomeIcons'

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
import dashboardRevenues from '@/src/functions/dashboardRevenues'
import getChartDataRevenuesByMonthly from '@/src/functions/getChartDataRevenuesByMonthly'

import Alerting from '@/src/utils/alerting'

type MyProps = {
  fetch: Fetch
}

type MyState = {
  isReady: boolean
  isError: boolean
  filial: Filial[]
  clients: Client[]
  period: string[]
  optionsFilters: JSX.Element[]
  optionsClients: JSX.Element[]
  selectedFilter: optionFilters
  selectedBranch: string
  selectedClient: string
  selectedClientStore: string
  userFocusInput: boolean
  renderInfoIsReady: boolean
  processInfo: boolean
  amount_sales: JSX.Element
  total_sales: JSX.Element
  chartData_loading: boolean
  chartData_filial: string
  chartData_client: string
  chartData_clientStore: string
  chartData_date: string
  chartDataset_monthlyValueLoading: boolean
  chartDataset_monthlyValue: {
    dataset: {
      data: Chart.ChartData
      options: Chart.ChartOptions
    }
  }
}

type optionFilters =
  | 'Por empresa e cliente'
  | 'Por empresa e todos os clientes'
  | 'Por período, todas as empresas e todos os clientes'

export default class ChartRevenues extends React.Component<MyProps, MyState> {
  constructor(props) {
    super(props)

    const optionsFilters: optionFilters[] = [
      'Por empresa e cliente',
      'Por empresa e todos os clientes',
      'Por período, todas as empresas e todos os clientes',
    ]

    this.state = {
      userFocusInput: false,
      isReady: false,
      isError: false,
      filial: [],
      clients: [],
      period: ['', ''],
      optionsFilters: optionsFilters.map((filter) => {
        return (
          <option key={`option-filter-${filter}`} value={filter}>
            {filter}
          </option>
        )
      }),
      optionsClients: undefined,
      selectedFilter: 'Por empresa e cliente',
      selectedBranch: 'Selecionar',
      selectedClient: 'Selecionar',
      selectedClientStore: 'Selecionar',
      renderInfoIsReady: false,
      processInfo: false,
      amount_sales: undefined,
      total_sales: undefined,
      chartData_loading: undefined,
      chartData_filial: undefined,
      chartData_client: undefined,
      chartData_clientStore: undefined,
      chartData_date: undefined,
      chartDataset_monthlyValueLoading: undefined,
      chartDataset_monthlyValue: undefined,
    }
  }

  componentDidMount() {
    const timer = setTimeout(async () => {
      const branchs = await getFilial(this.props.fetch, true)

      if (branchs.length <= 0) return this.setState({ isError: true })
      else {
        this.setState({ filial: branchs, isReady: true })
      }
    })

    return () => clearTimeout(timer)
  }

  render() {
    if (this.state.isError) return this.compose_error()

    if (this.state.isReady) return this.compose_ready()

    return this.compose_loading()
  }

  compose_error() {
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

  compose_loading() {
    return (
      <div className="d-flex justify-content-center p-2">
        <RotateSpinner size={42} color={'#004a6e'} loading={true} />
      </div>
    )
  }

  compose_loading_chart() {
    return (
      <div className="d-flex justify-content-center p-2">
        <WaveSpinner size={42} color={'#004a6e'} loading={true} />
      </div>
    )
  }

  compose_ready() {
    const optionsBranch = this.state.filial.map((branch) => {
        return (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        )
      }),
      handleFocusOrBlurInput = (status) => {
        this.setState({ userFocusInput: status })
      },
      handleChangePeriodStart = (e) => {
        this.setState({
          period: [e.target.value, this.state.period[1]],
        })

        if (
          (this.state.processInfo &&
            this.state.selectedFilter ===
              'Por período, todas as empresas e todos os clientes') ||
          (this.state.processInfo &&
            this.state.selectedFilter === 'Por empresa e todos os clientes')
        )
          this.setState({
            processInfo: false,
          })
      },
      handleChangePeriodEnd = (e) => {
        this.setState({
          period: [this.state.period[0], e.target.value],
        })

        if (
          (this.state.processInfo &&
            this.state.selectedFilter ===
              'Por período, todas as empresas e todos os clientes') ||
          (this.state.processInfo &&
            this.state.selectedFilter === 'Por empresa e todos os clientes')
        )
          this.setState({
            processInfo: false,
          })
      },
      handleSelectOptionFilters = async (e) => {
        if (
          this.state.processInfo &&
          this.state.selectedFilter !== e.target.value
        )
          this.setState({
            processInfo: false,
          })

        this.setState({ selectedFilter: e.target.value })
      },
      handleSelectOptionBranch = async (e) => {
        const value = e.target.value

        if (value !== 'Selecionar') {
          const clients = await getClients(this.props.fetch, value, true)

          if (clients.length > 0) {
            this.setState({
              clients,
              optionsClients: clients.map((client) => {
                return (
                  <option
                    key={`${client.id}-${client.store}`}
                    value={`${client.id}-${client.fullname}-${client.store}`}
                  >
                    {client.fullname}
                  </option>
                )
              }),
            })
          } else {
            Alerting.create(`Filial(${value}) não possui clientes ativos.`)
          }
        }

        this.setState({
          selectedBranch: value !== 'Selecionar' ? value : 'Selecionar',
        })

        if (
          this.state.processInfo &&
          this.state.selectedFilter === 'Por empresa e todos os clientes'
        )
          this.setState({
            processInfo: false,
          })
      },
      handleSelectOptionClient = (e) => {
        const value: string = e.target.value

        let selectedClient = 'Selecionar',
          selectedClientStore = 'Selecionar'

        this.state.clients.forEach((client) => {
          const id = value.split('-')[0],
            store = value.split('-')[2]

          if (id === client.id && store === client.store) {
            selectedClient = value
            selectedClientStore = store
          }
        })

        this.setState({
          selectedClient,
          selectedClientStore,
        })

        if (
          this.state.processInfo &&
          this.state.selectedFilter === 'Por empresa e cliente'
        )
          this.setState({
            processInfo: false,
          })
      }

    const date = new Date()

    return (
      <div className="container-fluid">
        <div className="d-flex flex-column flex-md-row">
          <div className="form-floating col-12 col-md-4 mb-2">
            <select
              id="select-filter"
              className="form-select"
              aria-label="Floating label select example"
              onChange={handleSelectOptionFilters}
              disabled={this.state.chartData_loading}
              value={this.state.selectedFilter}
            >
              {this.state.optionsFilters}
            </select>
            <label htmlFor="select-filter">Filtro</label>
          </div>
          <div className="form-floating col-12 col-md-4 mb-2">
            <input
              id="input-data1"
              type="date"
              min="2016-01-01"
              max={this.state.period[1]}
              className="form-control"
              aria-label="Selecione o período inicial"
              aria-describedby="date-addon"
              onChange={handleChangePeriodStart}
              onFocus={() => handleFocusOrBlurInput(true)}
              onBlur={() => handleFocusOrBlurInput(false)}
              value={this.state.period[0]}
              disabled={this.state.chartData_loading}
            />
            <label htmlFor="input-data1">Período Inicial</label>
          </div>
          <div className="form-floating col-12 col-md-4 mb-2">
            <input
              id="input-data2"
              type="date"
              min={this.state.period[0]}
              max={date.toISOString().slice(0, date.toISOString().indexOf('T'))}
              className="form-control"
              aria-label="Selecione o período final"
              aria-describedby="date-addon"
              onChange={handleChangePeriodEnd}
              onFocus={() => handleFocusOrBlurInput(true)}
              onBlur={() => handleFocusOrBlurInput(false)}
              value={this.state.period[1]}
              disabled={this.state.chartData_loading}
            />
            <label htmlFor="input-data2">Período Final</label>
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row">
          <div className="form-floating col-12 col-md-6 mb-2">
            <select
              id="select-filial"
              className="form-select"
              aria-label="Selecione a filial"
              onChange={handleSelectOptionBranch}
              disabled={this.state.chartData_loading}
              value={this.state.selectedBranch}
            >
              <option>Selecionar</option>
              {optionsBranch}
            </select>
            <label htmlFor="select-filial">Filial</label>
          </div>
          <div className="form-floating col-12 col-md-6 mb-2">
            <select
              id="select-client"
              className="form-select"
              aria-label="Selecione o cliente"
              onChange={handleSelectOptionClient}
              disabled={
                this.state.chartData_loading ||
                this.state.selectedBranch === 'Selecionar'
              }
              value={this.state.selectedClient}
            >
              <option>Selecionar</option>
              {this.state.optionsClients}
            </select>
            <label htmlFor="select-client">Cliente</label>
          </div>
        </div>
        <div className="d-flex flex-column">{this.compose_information()}</div>
      </div>
    )
  }

  compose_information() {
    setInterval(async () => {
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

      if (
        this.state.processInfo ||
        this.state.userFocusInput ||
        !(
          parseInt(start.year) >= 2016 &&
          parseInt(end.year) >= parseInt(start.year) &&
          parseInt(start.month) > 0 &&
          parseInt(start.month) <= 12 &&
          parseInt(end.month) > 0 &&
          parseInt(end.month) <= 12 &&
          parseInt(start.day) > 0 &&
          parseInt(start.day) <= 31 &&
          parseInt(end.day) > 0 &&
          parseInt(end.day) <= 31
        )
      )
        return

      if (
        this.state.selectedFilter === 'Por empresa e cliente' &&
        this.state.period[0].length >= 10 &&
        this.state.period[1].length >= 10 &&
        this.state.selectedBranch !== 'Selecionar' &&
        this.state.selectedClient !== 'Selecionar' &&
        this.state.selectedClientStore !== 'Selecionar'
      ) {
        this.setState({ processInfo: true, chartData_loading: true })

        const revenues = await dashboardRevenues(
          this.props.fetch,
          this.state.selectedBranch,
          this.state.selectedClient.split('-')[0],
          this.state.selectedClientStore,
          this.state.period,
          true // use cache
        )

        if (revenues.length > 0) {
          const amountTotal = revenues.length,
            valueTotal = (() => {
              let value = 0

              for (const revenue of revenues) {
                value += parseFloat(revenue.value)
              }

              return value
            })(),
            total_sales = this.compose_simpleBoxInfo(
              {
                family: 'fas',
                name: 'coins',
              },
              'Valor total vendido',
              `R$ ${valueTotal.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 3,
              })}`,
              'col-12 col-md-6'
            ),
            amount_sales = this.compose_simpleBoxInfo(
              {
                family: 'fas',
                name: 'hand-holding-usd',
              },
              'Total de pedidos',
              `${amountTotal}`,
              'col-12 col-md-6'
            )

          let chartData_filial = '???',
            chartData_client = '???',
            chartData_clientStore = '???',
            chartData_date = '???'

          this.state.filial.forEach((filial) => {
            if (filial.id === this.state.selectedBranch) {
              return (chartData_filial = `${filial.name}`)
            }
          })

          this.state.clients.forEach((client) => {
            if (
              client.id === this.state.selectedClient.split('-')[0] &&
              client.store === this.state.selectedClient.split('-')[2]
            ) {
              const start = moment({
                  year: parseInt(this.state.period[0].split('-')[0]),
                  month: parseInt(this.state.period[0].split('-')[1]) - 1,
                  day: parseInt(this.state.period[0].split('-')[2]),
                }),
                end = moment({
                  year: parseInt(this.state.period[1].split('-')[0]),
                  month: parseInt(this.state.period[1].split('-')[1]) - 1,
                  day: parseInt(this.state.period[1].split('-')[2]),
                })

              chartData_date = `Período de apuração: ${start.format(
                'DD[/]MM[/]YYYY'
              )} até ${end.format('DD[/]MM[/]YYYY')}`

              chartData_clientStore = `${client.store}`

              return (chartData_client = `${client.fullname}`)
            }
          })

          this.loading_chartDataset_monthlyValue(
            this.state.selectedBranch,
            this.state.selectedClient.split('-')[0],
            this.state.selectedClientStore,
            this.state.period
          )

          this.setState({
            amount_sales,
            total_sales,
            chartDataset_monthlyValueLoading: true,
            chartData_filial,
            chartData_client,
            chartData_clientStore,
            chartData_date,
          })
        } else {
          Alerting.create(
            `Nenhuma nota encontrada na loja e período informados.`
          )

          this.setState({
            chartData_loading: false,
            selectedClient: 'Selecionar',
            selectedClientStore: 'Selecionar',
          })
        }
      } else if (
        this.state.selectedFilter === 'Por empresa e todos os clientes' &&
        this.state.period[0].length >= 10 &&
        this.state.period[1].length >= 10 &&
        this.state.selectedBranch !== 'Selecionar'
      ) {
        this.setState({ processInfo: true, chartData_loading: true })

        const revenues = await dashboardRevenues(
          this.props.fetch,
          this.state.selectedBranch,
          null,
          null,
          this.state.period,
          true // use cache
        )

        if (revenues.length > 0) {
          const amountTotal = revenues.length,
            valueTotal = (() => {
              let value = 0

              for (const revenue of revenues) {
                value += parseFloat(revenue.value)
              }

              return value
            })(),
            total_sales = this.compose_simpleBoxInfo(
              {
                family: 'fas',
                name: 'coins',
              },
              'Valor total vendido',
              `R$ ${valueTotal.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 3,
              })}`,
              'col-12 col-md-6'
            ),
            amount_sales = this.compose_simpleBoxInfo(
              {
                family: 'fas',
                name: 'hand-holding-usd',
              },
              'Total de pedidos',
              `${amountTotal}`,
              'col-12 col-md-6'
            )

          let chartData_filial = '???',
            chartData_client = '???',
            chartData_clientStore = '???',
            chartData_date = '???'

          this.state.filial.forEach((filial) => {
            if (filial.id === this.state.selectedBranch) {
              return (chartData_filial = `${filial.name}`)
            }
          })

          const start = moment({
              year: parseInt(this.state.period[0].split('-')[0]),
              month: parseInt(this.state.period[0].split('-')[1]) - 1,
              day: parseInt(this.state.period[0].split('-')[2]),
            }),
            end = moment({
              year: parseInt(this.state.period[1].split('-')[0]),
              month: parseInt(this.state.period[1].split('-')[1]) - 1,
              day: parseInt(this.state.period[1].split('-')[2]),
            })

          chartData_date = `Período de apuração: ${start.format(
            'DD[/]MM[/]YYYY'
          )} até ${end.format('DD[/]MM[/]YYYY')}`

          chartData_client = `Todos os Clientes`
          chartData_clientStore = `Todas as Lojas`

          this.loading_chartDataset_monthlyValue(
            this.state.selectedBranch,
            null,
            null,
            this.state.period
          )

          this.setState({
            amount_sales,
            total_sales,
            chartDataset_monthlyValueLoading: true,
            chartData_filial,
            chartData_client,
            chartData_clientStore,
            chartData_date,
          })
        } else {
          Alerting.create(
            `Nenhuma nota encontrada na filial e período informados.`
          )

          this.setState({
            chartData_loading: false,
            selectedBranch: 'Selecionar',
            selectedClient: 'Selecionar',
            selectedClientStore: 'Selecionar',
          })
        }
      } else if (
        this.state.selectedFilter ===
          'Por período, todas as empresas e todos os clientes' &&
        this.state.period[0].length >= 10 &&
        this.state.period[1].length >= 10
      ) {
        this.setState({ processInfo: true, chartData_loading: true })

        const revenues = await dashboardRevenues(
          this.props.fetch,
          null,
          null,
          null,
          this.state.period,
          true // use cache
        )

        if (revenues.length > 0) {
          const amountTotal = revenues.length,
            valueTotal = (() => {
              let value = 0

              for (const revenue of revenues) {
                value += parseFloat(revenue.value)
              }

              return value
            })(),
            total_sales = this.compose_simpleBoxInfo(
              {
                family: 'fas',
                name: 'coins',
              },
              'Valor total vendido',
              `R$ ${valueTotal.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 3,
              })}`,
              'col-12 col-md-6'
            ),
            amount_sales = this.compose_simpleBoxInfo(
              {
                family: 'fas',
                name: 'hand-holding-usd',
              },
              'Total de pedidos',
              `${amountTotal}`,
              'col-12 col-md-6'
            )

          let chartData_filial = '???',
            chartData_client = '???',
            chartData_clientStore = '???',
            chartData_date = '???'

          const start = moment({
              year: parseInt(this.state.period[0].split('-')[0]),
              month: parseInt(this.state.period[0].split('-')[1]) - 1,
              day: parseInt(this.state.period[0].split('-')[2]),
            }),
            end = moment({
              year: parseInt(this.state.period[1].split('-')[0]),
              month: parseInt(this.state.period[1].split('-')[1]) - 1,
              day: parseInt(this.state.period[1].split('-')[2]),
            })

          chartData_date = `Período de apuração: ${start.format(
            'DD[/]MM[/]YYYY'
          )} até ${end.format('DD[/]MM[/]YYYY')}`

          chartData_filial = 'Todas as Filiais'
          chartData_client = `Todos os Clientes`
          chartData_clientStore = `Todas as Lojas`

          this.loading_chartDataset_monthlyValue(
            null,
            null,
            null,
            this.state.period
          )

          this.setState({
            amount_sales,
            total_sales,
            chartDataset_monthlyValueLoading: true,
            chartData_filial,
            chartData_client,
            chartData_clientStore,
            chartData_date,
          })
        } else {
          Alerting.create(
            `Nenhuma nota encontrada na filial e período informados.`
          )

          this.setState({
            chartData_loading: false,
            period: ['', ''],
            selectedBranch: 'Selecionar',
            selectedClient: 'Selecionar',
            selectedClientStore: 'Selecionar',
          })
        }
      } else {
        if (this.state.renderInfoIsReady)
          this.setState({ renderInfoIsReady: false })
      }
    })

    if (this.state.renderInfoIsReady) return this.render_information()
    else
      return (
        <>
          {this.state.chartData_loading ? (
            <div className="mb-2">{this.compose_loading()}</div>
          ) : (
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
          )}
        </>
      )
  }

  render_information() {
    return (
      <>
        {this.state.chartData_loading ? (
          <div className="m-2">{this.compose_loading()}</div>
        ) : (
          <></>
        )}
        <div className="chartRevenues active">
          <div className="my-2">
            <h1 className="text-primary text-center fw-bold">
              {this.state.chartData_client} (
              {`Loja: ${this.state.chartData_clientStore}`})
            </h1>
            <p className="text-center text-muted">
              {this.state.chartData_filial}
            </p>
            <p className="text-center text-muted">
              {this.state.chartData_date}
            </p>
          </div>
          <div className="d-flex flex-column flex-md-row">
            <div className="container overflow-hidden">
              <div className="row g-2 mb-2">
                {this.state.amount_sales}
                {this.state.total_sales}
              </div>
            </div>
          </div>
          <hr className="text-muted" />
          {this.compose_chartDataset_monthlyValue()}
        </div>
      </>
    )
  }

  compose_simpleBoxInfo(
    icon: { family: iconsFamily; name: iconsName },
    title: string,
    value: string,
    col: string
  ) {
    return (
      <div className={col}>
        <div className="rounded bg-primary bg-gradient">
          <div className="d-flex overflow-auto" style={{ height: '15vh' }}>
            <div className="col-12 text-center text-secondary">
              <div className="m-2">
                <p className="fw-bold fs-5 text-truncate">
                  <FontAwesomeIcon
                    icon={Icon.render(icon.family, icon.name)}
                    className="me-2 flex-shrink-1"
                  />
                  {title}
                </p>
                <h1 className="fw-bold text-truncate">{value}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  compose_chartDataset_monthlyValue() {
    if (this.state.chartDataset_monthlyValueLoading)
      return this.compose_loading_chart()

    return (
      <div className="d-flex flex-column flex-md-row p-2">
        <div className="col-12">
          <Line
            className={`chart ${
              this.state.chartDataset_monthlyValueLoading
                ? 'deactivate'
                : 'active'
            }`}
            height={100}
            data={this.state.chartDataset_monthlyValue.dataset.data}
            options={this.state.chartDataset_monthlyValue.dataset.options}
          />
        </div>
      </div>
    )
  }

  async loading_chartDataset_monthlyValue(
    selectedBranch: string | null,
    selectedClient: string | null,
    selectedClientStore: string | null,
    period: string[]
  ) {
    const periods: { date: string; value: number[] }[] = []

    if (parseInt(period[1].slice(0, 4)) - parseInt(period[0].slice(0, 4)) > 0) {
      let i = 1

      const diff =
        parseInt(period[1].slice(0, 4)) - parseInt(period[0].slice(0, 4))

      if (
        parseInt(period[0].slice(0, 4)) + i !==
        parseInt(period[1].slice(0, 4))
      )
        while (i < diff) {
          periods.push({
            date: `${parseInt(period[0].slice(0, 4)) + i}`,
            value: await getChartDataRevenuesByMonthly(
              this.props.fetch,
              selectedBranch,
              selectedClient,
              selectedClientStore,
              [
                `${parseInt(period[0].slice(0, 4)) + i}-01-01`,
                `${parseInt(period[0].slice(0, 4)) + i++}-12-31`,
              ],
              true // use cache
            ),
          })
        }
    }

    periods.splice(0, 0, {
      date: `${period[0].slice(0, 4)}`,
      value: await getChartDataRevenuesByMonthly(
        this.props.fetch,
        selectedBranch,
        selectedClient,
        selectedClientStore,
        [`${period[0].slice(0, 4)}-01-01`, `${period[0].slice(0, 4)}-12-31`],
        true // use cache
      ),
    })

    periods.push({
      date: `${period[1].slice(0, 4)}`,
      value: await getChartDataRevenuesByMonthly(
        this.props.fetch,
        selectedBranch,
        selectedClient,
        selectedClientStore,
        [`${period[1].slice(0, 4)}-01-01`, `${period[1].slice(0, 4)}-12-31`],
        true // use cache
      ),
    })

    const data: Chart.ChartData = {
        labels: [
          'Janeiro',
          'Fevereiro',
          'Março',
          'Abril',
          'Maio',
          'Junho',
          'Julho',
          'Agosto',
          'Setembro',
          'Outubro',
          'Novembro',
          'Dezembro',
        ],
        datasets: [],
      },
      options: Chart.ChartOptions = {
        plugins: {
          filler: {
            propagate: false,
          },
        },
        interaction: {
          intersect: false,
        },
      }

    for (const period of periods) {
      const color = randomColor({
        luminosity: 'dark',
        format: 'hex',
      })

      data.datasets.push({
        label: `Notas de ${period.date}`,
        data: period.value,
        borderColor: color,
        backgroundColor: color,
        fill: 'false',
        tension: 0.5,
      })
    }

    if (period[0].slice(0, 4) === period[1].slice(0, 4))
      data.datasets.splice(1, 1)

    this.setState({
      chartDataset_monthlyValue: {
        dataset: {
          data,
          options,
        },
      },
      selectedClient: 'Selecionar',
      selectedClientStore: 'Selecionar',
      renderInfoIsReady: true,
      chartData_loading: false,
      chartDataset_monthlyValueLoading: false,
    })
  }
}
