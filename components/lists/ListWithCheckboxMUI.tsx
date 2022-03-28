import { memo, useMemo, useState } from 'react';

import { DataGrid, GridColDef, GridRowsProp, ptBR } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Fab from '@mui/material/Fab';
import SearchRounded from '@mui/icons-material/SearchRounded';
import ClearRounded from '@mui/icons-material/ClearRounded';

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
  const [textFilter, setTextFilter] = useState<string>('');
  const [rows, setRows] = useState<GridRowsProp>(props.rows);
  const [filterApplied, setFilterApplied] = useState<boolean>(false);

  const lessCodeThanCheckingPrevRow = useMemo(
    () => setRows(props.rows),
    [props],
  );

  const
    handleChangeTextFilter = (text: string) => setTextFilter(text),
    handleTextFilter = () => {
      if (filterApplied)
        return setRows(props.rows);

      setRows(
        rows.filter(row => {
          if (textFilter.length <= 0 || filterApplied)
            return true;

          const values = Object.values(row);

          return values.some(value => {
            if (typeof value === 'number')
              return value.toString().toLowerCase().includes(textFilter.toLowerCase());
            else if (typeof value === 'string')
              return value.toLowerCase().includes(textFilter.toLowerCase());
            else
              return false;
          })
        })
      )
    },
    handleChangeFilterApplied = () => setFilterApplied(!filterApplied)

  return (
    <div className='m-2' style={{ height: '50vh', width: '100%' }}>
      {InputFreeFilter(
        textFilter,
        handleChangeTextFilter,
        handleTextFilter,
        filterApplied,
        handleChangeFilterApplied,
      )}
      <DataGrid
        className="p-2 my-2"
        rows={rows}
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

function InputFreeFilter(
  textFilter: string,
  handleChangeTextFilter: (text: string) => void,
  handleTextFilter: () => void,
  filterApplied: boolean,
  handleChangeFilterApplied: () => void
) {
  return (
    <Box className="d-flex flex-row p-2" sx={{ '& > :not(style)': { m: 1 } }}>
      <FormControl className="col" variant="standard">
        <InputLabel htmlFor="input-free-filter-icon-adornment">
          Pesquisar
        </InputLabel>
        <Input
          id="input-free-filter-icon-adornment"
          onChange={(e) => handleChangeTextFilter(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SearchRounded />
            </InputAdornment>
          }
        />
      </FormControl>
      <Fab
        color={filterApplied ? 'error' : 'primary'}
        aria-label="search"
        disabled={textFilter.length <= 0 && !filterApplied}
        onClick={() => {
          handleTextFilter();
          handleChangeFilterApplied();
        }}
      >
        {!filterApplied ? <SearchRounded /> : <ClearRounded />}
      </Fab>
    </Box>
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
      if (
        typeof prevRows[i] === 'string'
        || typeof prevRows[i] === 'number'
      ) {
        if (prevRows[i] !== nextRows[i])
          return false;
      } else {
        if (JSON.stringify(prevRows[i]) !== JSON.stringify(nextRows[i]))
          return false;
      }
    }
  }

  return true;
});