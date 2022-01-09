/**
 * @description Lista -> Lista com checkbox (MUI)
 * @author GuilhermeSantos001
 * @update 31/12/2021
 */

import * as React from 'react';
import { DataGrid, GridColDef, ptBR } from '@mui/x-data-grid';

export interface Props {
  columns: GridColDef[]
  rows: any[]
  pageSize: number
  pageSizeOptions: number[]
  onChangeSelection: (itens: string[]) => void
  onPageSizeChange: (pageSize: number) => void
}

export default function listWithCheckboxMUI(props: Props): JSX.Element {
  return (
    <div className='m-2' style={{ height: 350, width: '100%' }}>
      <DataGrid
        rows={props.rows}
        columns={props.columns}
        pageSize={props.pageSize}
        checkboxSelection={true}
        onSelectionModelChange={(selection: string[]) => props.onChangeSelection(selection)}
        rowsPerPageOptions={props.pageSizeOptions}
        onPageSizeChange={(pageSize: number) => props.onPageSizeChange(pageSize)}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
      />
    </div>
  );
}