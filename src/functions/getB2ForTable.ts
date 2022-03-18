import { GridColDef, GridRowsProp } from '@mui/x-data-grid';

import Sugar from 'sugar';
import StringEx from '@/src/utils/stringEx';

import { B2Type } from '@/types/B2Type';

export default function getB2ForTable(
  postings: B2Type[]
) {
  const
    columns: GridColDef[] = [
      {
        field: 'id',
        headerName: 'ID',
        headerAlign: 'center',
        align: 'center',
        hide: true
      },
      {
        field: 'item',
        headerName: 'Item',
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'costCenter',
        headerName: 'Filial',
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'matricule',
        headerName: 'RE',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'name',
        headerName: 'Nome Completo',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'service',
        headerName: 'Função',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'workplace_origin',
        headerName: 'Posto de Origem',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'workplace_destination',
        headerName: 'Posto de Origem',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'coverage_startedAt',
        headerName: 'Inicio da Cobertura',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'entryTime',
        headerName: 'Horário de Entrada',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'exitTime',
        headerName: 'Horário de Saída',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'value_closed',
        headerName: 'Valor Fechado',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'absences',
        headerName: 'Faltas',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'law_days',
        headerName: 'Dias de Direito',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'discount_value',
        headerName: 'Valor de Desconto',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'level',
        headerName: 'Nível',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'gratification',
        headerName: 'Gratificação',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'payment_value',
        headerName: 'Valor a Pagar',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'payment_date',
        headerName: 'Data de Pagamento',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'payment_status',
        headerName: 'Já foi Pago?',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      }
    ],
    rows: GridRowsProp = postings.map((posting, index) => {
      return {
        id: posting.id,
        item: index + 1,
        costCenter: posting.costCenter.value,
        matricule: posting.personB2.person.matricule,
        name: Sugar.String.capitalize(posting.personB2.person.name),
        service: posting.personB2.person.personService.map(_ => _.service.value).join(', '),
        workplace_origin: posting.workplaceOrigin.name,
        workplace_destination: posting.workplaceDestination.name,
        coverage_startedAt: new Date(posting.coverageStartedAt).toLocaleDateString(),
        entryTime: new Date(posting.entryTime).toLocaleTimeString().substring(0, 5),
        exitTime: new Date(posting.exitTime).toLocaleTimeString().substring(0, 5),
        value_closed: StringEx.maskMoney(posting.valueClosed),
        absences: posting.absences,
        law_days: posting.lawdays,
        discount_value: StringEx.maskMoney(posting.discountValue),
        level: posting.level,
        gratification: StringEx.maskMoney(posting.gratification),
        payment_value: StringEx.maskMoney(posting.paymentValue),
        payment_date: new Date(posting.paymentDatePayable).toLocaleDateString(),
        payment_status: posting.paymentStatus === 'paid' ? 'Sim' : 'Não'
      }
    })

  return { columns, rows };
}