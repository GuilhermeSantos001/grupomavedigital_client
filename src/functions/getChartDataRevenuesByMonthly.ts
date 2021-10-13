/**
 * @description Efetuada uma chamada para a API para retornar a data do grafico
 * de "Faturamento"
 * @author @GuilhermeSantos001
 * @update 09/10/2021
 */

import Fetch from '@/src/utils/fetch'
import dashboardRevenues from '@/src/functions/dashboardRevenues'

const getChartDataRevenuesByMonthly = async (_fetch: Fetch, branch: string | null, client: string | null, store: string | null, period: string[], cache: boolean): Promise<number[]> => {
  const revenues = await dashboardRevenues(
    _fetch,
    branch,
    client,
    store,
    period,
    cache
  ),
    dataMonthly = {
      january: revenues.find(
        (revenue) => revenue.released.replaceAll('/', '').slice(2, 4) == '01'
      ),
      february: revenues.find(
        (revenue) => revenue.released.replaceAll('/', '').slice(2, 4) == '02'
      ),
      march: revenues.find(
        (revenue) => revenue.released.replaceAll('/', '').slice(2, 4) == '03'
      ),
      april: revenues.find(
        (revenue) => revenue.released.replaceAll('/', '').slice(2, 4) == '04'
      ),
      may: revenues.find(
        (revenue) => revenue.released.replaceAll('/', '').slice(2, 4) == '05'
      ),
      june: revenues.find(
        (revenue) => revenue.released.replaceAll('/', '').slice(2, 4) == '06'
      ),
      july: revenues.find(
        (revenue) => revenue.released.replaceAll('/', '').slice(2, 4) == '07'
      ),
      august: revenues.find(
        (revenue) => revenue.released.replaceAll('/', '').slice(2, 4) == '08'
      ),
      setember: revenues.find(
        (revenue) => revenue.released.replaceAll('/', '').slice(2, 4) == '09'
      ),
      october: revenues.find(
        (revenue) => revenue.released.replaceAll('/', '').slice(2, 4) == '10'
      ),
      november: revenues.find(
        (revenue) => revenue.released.replaceAll('/', '').slice(2, 4) == '11'
      ),
      december: revenues.find(
        (revenue) => revenue.released.replaceAll('/', '').slice(2, 4) == '12'
      ),
    },
    periodData = [
      dataMonthly.january
        ? parseFloat(dataMonthly.january.value)
        : 0,
      dataMonthly.february
        ? parseFloat(dataMonthly.february.value)
        : 0,
      dataMonthly.march
        ? parseFloat(dataMonthly.march.value)
        : 0,
      dataMonthly.april
        ? parseFloat(dataMonthly.april.value)
        : 0,
      dataMonthly.may ? parseFloat(dataMonthly.may.value) : 0,
      dataMonthly.june ? parseFloat(dataMonthly.june.value) : 0,
      dataMonthly.july ? parseFloat(dataMonthly.july.value) : 0,
      dataMonthly.august
        ? parseFloat(dataMonthly.august.value)
        : 0,
      dataMonthly.setember
        ? parseFloat(dataMonthly.setember.value)
        : 0,
      dataMonthly.october
        ? parseFloat(dataMonthly.october.value)
        : 0,
      dataMonthly.november
        ? parseFloat(dataMonthly.november.value)
        : 0,
      dataMonthly.december
        ? parseFloat(dataMonthly.december.value)
        : 0,
    ]

  return periodData;
}

export default getChartDataRevenuesByMonthly;