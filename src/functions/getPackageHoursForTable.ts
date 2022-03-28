import { GridColDef, GridRowsProp } from '@mui/x-data-grid';

import Sugar from 'sugar';
import StringEx from '@/src/utils/stringEx';

import { PackageHoursType } from '@/types/PackageHoursType';

export default function getPackageHoursForTable(
  postings: PackageHoursType[]
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
        field: 'jobTitle',
        headerName: 'Função',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'workplace_destination',
        headerName: 'Cliente',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'contract_startedAt',
        headerName: 'Inicio do Acordo',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'contract_finishAt',
        headerName: 'Término do Acordo',
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
        field: 'law_days',
        headerName: 'Dias de Direito',
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
        field: 'payment_method',
        headerName: 'Forma de Pagamento',
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
        matricule: posting.personPH.person.matricule,
        name: Sugar.String.capitalize(posting.personPH.person.name),
        jobTitle: posting.jobTitle,
        workplace_destination: posting.workplaceDestination.name,
        contract_startedAt: new Date(posting.contractStartedAt).toLocaleDateString(),
        contract_finishAt: new Date(posting.contractFinishAt).toLocaleDateString(),
        entryTime: new Date(posting.entryTime).toLocaleTimeString().substring(0, 5),
        exitTime: new Date(posting.exitTime).toLocaleTimeString().substring(0, 5),
        value_closed: StringEx.maskMoney(posting.valueClosed),
        law_days: posting.lawdays,
        payment_value: StringEx.maskMoney(posting.paymentValue),
        payment_date: new Date(posting.paymentDatePayable).toLocaleDateString(),
        payment_method: posting.paymentMethod === 'money' ? 'Dinheiro' : 'Cartão Alelo',
        payment_status: posting.paymentStatus === 'paid' ? 'Sim' : 'Não'
      }
    })

  return { columns, rows };
}