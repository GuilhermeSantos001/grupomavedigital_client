import { Columns, RowData } from '@/components/lists/ListWithCheckbox';

import Sugar from 'sugar';
import StringEx from '@/src/utils/stringEx';

import { PostingType } from '@/types/PostingType';

export default function getPostingsForTable(
  postings: PostingType[]
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
        field: 'originDate',
        title: 'Data de Origem',
        align: 'center'
      },
      {
        field: 'matricule_coverage',
        title: 'RE de Cobertura',
        align: 'center'
      },
      {
        field: 'coverage_name',
        title: 'Funcionário de Cobertura',
        align: 'center'
      },
      {
        field: 'coverage_workplace',
        title: 'Posto de Origem',
        align: 'center'
      },
      {
        field: 'modality',
        title: 'Motivo',
        align: 'center'
      },
      {
        field: 'reasonForAbsence',
        title: 'Situação',
        align: 'center'
      },
      {
        field: 'covering_workplace',
        title: 'Posto de Cobertura',
        align: 'center'
      },
      {
        field: 'covering_matricule',
        title: 'RE (Substituído)',
        align: 'center'
      },
      {
        field: 'covering_name',
        title: 'Funcionário (Substituído)',
        align: 'center'
      },
      {
        field: 'paymentMethod',
        title: 'Forma de Pagamento',
        align: 'center'
      },
      {
        field: 'paymentValue',
        title: 'Valor',
        align: 'center'
      },
      {
        field: 'paymentDate',
        title: 'Previsão de Pagamento',
        align: 'center'
      }
    ],
    rows: RowData[] = postings.map((posting, index) => {
      return {
        id: posting.id,
        item: index + 1,
        costCenter: posting.costCenter.value,
        originDate: new Date(posting.originDate).toLocaleDateString(),
        matricule_coverage: posting.coverage.person.matricule,
        coverage_name: posting.coverage.person.name,
        coverage_workplace: posting.coverageWorkplace?.name || '-',
        modality: posting.coverage.modalityOfCoverage.length <= 2 ? String(posting.coverage.modalityOfCoverage).toUpperCase() : Sugar.String.capitalize(posting.coverage.modalityOfCoverage),
        reasonForAbsence: posting.covering ? posting.covering.reasonForAbsence.value : 'Falta de Efetivo',
        covering_workplace: posting.coveringWorkplace.name,
        covering_matricule: posting.covering ? posting.covering.person.matricule : '-',
        covering_name: posting.covering ? posting.covering.person.name : '-',
        paymentMethod: posting.paymentMethod === 'card' ? 'Cartão Alelo' : 'Caixinha',
        paymentValue: StringEx.maskMoney(posting.paymentValue),
        paymentDate: new Date(posting.paymentDatePayable).toLocaleDateString()
      }
    })

  return { columns, rows };
}