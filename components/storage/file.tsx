/**
 * @description Componente de exibição dos arquivos do GED
 * @author @GuilhermeSantos001
 * @update 13/10/2021
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

type MyProps = {}

type MyState = {}

export default class ChartRevenues extends React.Component<MyProps, MyState> {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  render() {
    return (
      <p>Hello World</p>
    )
  }
}
