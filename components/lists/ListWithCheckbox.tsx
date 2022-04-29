import { memo, useMemo, useState } from 'react';

import MaterialTable, { Column } from 'material-table'

export type Columns = Column<RowData>[]
export type RowData = { [key: string]: any }

export type Props = {
  title: string
  columns: Columns
  data: RowData[]
  messages: {
    emptyDataSourceMessage: string
  }
  deepCompare?: boolean
  onChangeSelection?: (items: string[]) => void
}

function Component(props: Props) {
  const [data, setData] = useState<RowData[]>(props.data);

  const lessCodeThanCheckingPrevRow = useMemo(
    () => setData(props.data),
    [props],
  );

  return (
    <div className="col-12 p-2 my-2">
      <MaterialTable
        title={props.title}
        localization={{
          pagination: {
            labelDisplayedRows: '{from}-{to} de {count}',
            firstTooltip: 'Pagina inicial',
            previousTooltip: 'Página anterior',
            nextTooltip: 'Próxima página',
            lastTooltip: 'Última página',
            labelRowsPerPage: 'Linhas por página',
            labelRowsSelect: 'Linhas',
          },
          header: {
            actions: 'Ações'
          },
          toolbar: {
            searchTooltip: 'Pesquisar',
            searchPlaceholder: 'Procurar por...',
            clearSearchAriaLabel: 'Limpar pesquisa',
            nRowsSelected: '{0} linha(s) selecionada(s)',
            addRemoveColumns: 'Adicionar/Remover colunas',
            showColumnsTitle: 'Mostrar colunas'
          },
          body: {
            addTooltip: 'Adicionar',
            deleteTooltip: 'Excluir',
            editRow: {
              saveTooltip: 'Salvar',
              deleteText: 'Tem certeza que deseja excluir este registro?',
              cancelTooltip: 'Cancelar'
            },
            editTooltip: 'Editar',
            filterRow: {
              filterPlaceHolder: 'Filtro',
              filterTooltip: 'Filtrar'
            },
            emptyDataSourceMessage: props.messages.emptyDataSourceMessage,
          }
        }}
        columns={props.columns}
        data={data}
        onSelectionChange={(rows) => {
          if (props.onChangeSelection) {
            props.onChangeSelection(rows.map((row) => row.id));
          }
        }}
        onRowSelected={(row) => {
          if (props.onChangeSelection) {
            props.onChangeSelection([row.id]);
          }
        }}
        options={{
          selection: true,
          search: true,
          headerStyle: {
            backgroundColor: '#e8e8e8',
            border: '1px solid #e0e0e0',
            color: '#414141',
          },
          rowStyle: {
            backgroundColor: '#f0f0f0',
            border: '1px solid #e0e0e0',
            color: '#004a6e',
          },
        }}
        style={{
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          padding: '10px',
        }}
      />
    </div>
  )
}

export const ListWithCheckbox = memo(Component, (prevProps, nextProps) => {
  const
    { data: prevData } = prevProps,
    { data: nextData } = nextProps;

  if (prevData.length !== nextData.length)
    return false;

  if (prevProps.deepCompare) {
    for (let i = 0; i < prevData.length; i++) {
      if (
        typeof prevData[i] === 'string'
        || typeof prevData[i] === 'number'
      ) {
        if (prevData[i] !== nextData[i])
          return false;
      } else {
        if (JSON.stringify(prevData[i]) !== JSON.stringify(nextData[i]))
          return false;
      }
    }
  }

  return true;
});