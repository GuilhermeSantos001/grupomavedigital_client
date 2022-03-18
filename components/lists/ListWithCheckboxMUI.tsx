import { memo } from 'react';

import { DataGrid, GridColDef, GridRowsProp, ptBR } from '@mui/x-data-grid';

export interface Props {
  columns: GridColDef[]
  rows: GridRowsProp
  pageSize: number
  pageSizeOptions: number[]
  deepCompare?: boolean
  onChangeSelection: (itens: string[]) => void
  onPageSizeChange: (pageSize: number) => void
}

function Component(props: Props): JSX.Element {
  return (
    <div className='m-2' style={{ height: 350, width: '100%' }}>
      <DataGrid
        rows={props.rows}
        columns={props.columns}
        pageSize={props.pageSize}
        checkboxSelection={true}
        onSelectionModelChange={(selection) => props.onChangeSelection(selection.map((item) => item.toString()))}
        rowsPerPageOptions={props.pageSizeOptions}
        onPageSizeChange={(pageSize: number) => props.onPageSizeChange(pageSize)}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
      />
    </div>
  );
}

export const ListWithCheckboxMUI = memo(Component, (prevProps, nextProps) => {
  const
    { rows: prevRows } = prevProps,
    { rows: nextRows } = nextProps;

  if (prevRows.length !== nextRows.length)
    return false;

  if (prevProps.deepCompare) {
    for (let i = 0; i < prevRows.length; i++) {
      if (typeof prevRows[i] === 'object' || typeof prevRows[i] === 'function') {
        if (JSON.stringify(prevRows[i]) !== JSON.stringify(nextRows[i]))
          return false;
      } else {
        if (prevRows[i] !== nextRows[i])
          return false;
      }
    }
  }

  return true;
});