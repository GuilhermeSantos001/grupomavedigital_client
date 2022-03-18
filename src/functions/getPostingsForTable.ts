import { GridColDef, GridRowsProp } from '@mui/x-data-grid';

import Sugar from 'sugar';
import StringEx from '@/src/utils/stringEx';

import { PostingType } from '@/types/PostingType';

export default function getPostingsForTable(
  postings: PostingType[]
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
        field: 'originDate',
        headerName: 'Data de Origem',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'matricule_coverage',
        headerName: 'RE de Cobertura',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'coverage_name',
        headerName: 'Funcionário de Cobertura',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'coverage_workplace',
        headerName: 'Posto de Origem',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'modality',
        headerName: 'Motivo',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'reasonForAbsence',
        headerName: 'Situação',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'covering_workplace',
        headerName: 'Posto de Cobertura',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'covering_matricule',
        headerName: 'RE (Substituído)',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'covering_name',
        headerName: 'Funcionário (Substituído)',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'paymentMethod',
        headerName: 'Forma de Pagamento',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'paymentValue',
        headerName: 'Valor',
        width: 250,
        headerAlign: 'center',
        align: 'center'
      },
      {
        field: 'paymentDate',
        headerName: 'Previsão de Pagamento',
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
        originDate: new Date(posting.originDate).toLocaleDateString(),
        matricule_coverage: posting.coverage.person.matricule,
        coverage_name: posting.coverage.person.name,
        coverage_workplace: posting.coverageWorkplace?.name || 'Freelancer',
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