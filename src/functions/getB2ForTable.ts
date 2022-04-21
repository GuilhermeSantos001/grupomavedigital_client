import { Columns, RowData } from '@/components/lists/ListWithCheckbox';

import Sugar from 'sugar';
import StringEx from '@/src/utils/stringEx';

import { B2Type } from '@/types/B2Type';

export default function getB2ForTable(
  postings: B2Type[]
) {
  const
    columns: Columns = [
      {
        field: 'id',
        align: 'center',
        hidden: true
      },
      {
        field: 'item',
        title: 'Item',
        align: 'center'
      },
      {
        field: 'costCenter',
        title: 'Filial',
        align: 'center'
      },
      {
        field: 'matricule',
        title: 'RE',
        align: 'center'
      },
      {
        field: 'name',
        title: 'Nome Completo',
        align: 'center'
      },
      {
        field: 'service',
        title: 'Função',
        align: 'center'
      },
      {
        field: 'workplace_origin',
        title: 'Posto de Origem',
        align: 'center'
      },
      {
        field: 'workplace_destination',
        title: 'Posto de Destino',
        align: 'center'
      },
      {
        field: 'coverage_startedAt',
        title: 'Inicio da Cobertura',
        align: 'center'
      },
      {
        field: 'entryTime',
        title: 'Horário de Entrada',
        align: 'center'
      },
      {
        field: 'exitTime',
        title: 'Horário de Saída',
        align: 'center'
      },
      {
        field: 'value_closed',
        title: 'Valor Fechado',
        align: 'center'
      },
      {
        field: 'absences',
        title: 'Faltas',
        align: 'center'
      },
      {
        field: 'law_days',
        title: 'Dias de Direito',
        align: 'center'
      },
      {
        field: 'discount_value',
        title: 'Valor de Desconto',
        align: 'center'
      },
      {
        field: 'level',
        title: 'Nível',
        align: 'center'
      },
      {
        field: 'gratification',
        title: 'Gratificação',
        align: 'center'
      },
      {
        field: 'payment_value',
        title: 'Valor a Pagar',
        align: 'center'
      },
      {
        field: 'payment_date',
        title: 'Data de Pagamento',
        align: 'center'
      },
      {
        field: 'payment_method',
        title: 'Forma de Pagamento',
        align: 'center'
      },
      {
        field: 'payment_status',
        title: 'Já foi Pago?',
        align: 'center'
      }
    ],
    rows: RowData[] = postings.map((posting, index) => {
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
        payment_method: posting.paymentMethod === 'money' ? 'Dinheiro' : 'Cartão Alelo',
        payment_status: posting.paymentStatus === 'paid' ? 'Sim' : 'Não'
      }
    })

  return { columns, rows };
}