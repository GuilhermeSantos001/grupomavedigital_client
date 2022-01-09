/**
 * @description Janela de super administrador
 * @author GuilhermeSantos001
 * @update 05/01/2022
*/

import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import PlayIcon from '@mui/icons-material/PlayArrow';
import BookmarkIcon from '@mui/icons-material/Bookmark';

import hasPrivilege from '@/src/functions/hasPrivilege'

import { useSnackbar } from 'notistack';

import { useAppDispatch, useAppSelector } from '@/app/hooks';

import {
  clearCostCenters,
  clearWorkplaces,
  clearServices,
  clearPeople,
  clearScales,
  clearStreets,
  clearNeighborhoods,
  clearCities,
  clearDistricts,
} from '@/app/features/system/system.slice'

import {
  clearLot,
  clearPostings,
} from '@/app/features/payback/payback.slice'

declare type OptionClear = {
  id?: string
  title: string
  exec: () => void
}

declare type OptionQtRegisters = {
  title: string
  length: number
  exec: () => void
}

export default function WindowSuperAdmin() {
  const [show, setShow] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [hasOptionExec, setHasOptionExec] = useState<string[]>([]);

  const [
    collapseExpandedOptionsClear,
    setCollapseExpandedOptionsClear
  ] = useState<boolean>(false);
  const [
    textSearchOptionsClear,
    setTextSearchOptionsClear
  ] = useState<string>('');

  const [
    collapseExpandedQtRegisters,
    setCollapseExpandedQtRegisters
  ] = useState<boolean>(false);
  const [
    textSearchQtRegisters,
    setTextSearchQtRegisters
  ] = useState<string>('');

  const
    dispatch = useAppDispatch(),
    { enqueueSnackbar } = useSnackbar(),
    handleCollapseExpand = (
      type: 'optionsClear' | 'qtRegisters',
    ) => {
      if (type === 'optionsClear') {
        setCollapseExpandedOptionsClear(!collapseExpandedOptionsClear);
      } else if (type === 'qtRegisters') {
        setCollapseExpandedQtRegisters(!collapseExpandedQtRegisters);
      }
    },
    handleClose = () => {
      setShow(false);

      if (hasChanges) {
        enqueueSnackbar(
          'A página será recarregada para aplicar as alterações!', {
          variant: 'info',
          className: 'bg-primary fw-bold text-secondary',
        });

        handleReload();
      }
    },
    handleReload = () => {
      const reload = setTimeout(() => {
        clearTimeout(reload);
        window.location.reload();
      }, 2000);
    },
    handleOptionExec = (option: string) => setHasOptionExec([...hasOptionExec, option]),
    handleClear = (exec: () => void) => {
      enqueueSnackbar(
        'Tarefa executada com sucesso!', {
        variant: 'success',
        className: 'bg-primary fw-bold text-secondary'
      });

      setHasChanges(true);

      exec();
    }

  const
    lotItems = useAppSelector(state => state.payback.lotItems || []),
    postings = useAppSelector(state => state.payback.postings || []),
    costCenters = useAppSelector(state => state.system.costCenters || []),
    workplaces = useAppSelector(state => state.system.workplaces || []),
    services = useAppSelector(state => state.system.services || []),
    people = useAppSelector(state => state.system.people || []),
    scales = useAppSelector(state => state.system.scales || []),
    streets = useAppSelector(state => state.system.streets || []),
    neighborhoods = useAppSelector(state => state.system.neighborhoods || []),
    cities = useAppSelector(state => state.system.cities || []),
    districts = useAppSelector(state => state.system.districts || []),
    optionsClear: OptionClear[] = [
      {
        id: 'all',
        title: 'Limpar registros do banco de dados',
        exec: () => {
          dispatch(clearCostCenters());
          dispatch(clearLot());
          dispatch(clearPostings());
          dispatch(clearWorkplaces());
          dispatch(clearServices());
          dispatch(clearPeople());
          dispatch(clearScales());
          dispatch(clearStreets());
          dispatch(clearNeighborhoods());
          dispatch(clearCities());
          dispatch(clearDistricts());
        }
      },
      {
        title: 'Limpar registros dos centros de custo',
        exec: () => dispatch(clearCostCenters())
      },
      {
        title: 'Limpar registros dos lotes de cartão',
        exec: () => dispatch(clearLot())
      },
      {
        title: 'Limpar registros dos lançamentos financeiros',
        exec: () => dispatch(clearPostings())
      },
      {
        title: 'Limpar registros dos locais de trabalho',
        exec: () => dispatch(clearWorkplaces())
      },
      {
        title: 'Limpar registros dos serviços',
        exec: () => dispatch(clearServices())
      },
      {
        title: 'Limpar registros das pessoas',
        exec: () => dispatch(clearPeople())
      },
      {
        title: 'Limpar registros das escalas',
        exec: () => dispatch(clearScales())
      },
      {
        title: 'Limpar registros das ruas',
        exec: () => dispatch(clearStreets())
      },
      {
        title: 'Limpar registros dos bairros',
        exec: () => dispatch(clearNeighborhoods())
      },
      {
        title: 'Limpar registros das cidades',
        exec: () => dispatch(clearCities())
      },
      {
        title: 'Limpar registros dos estados',
        exec: () => dispatch(clearDistricts())
      },
    ],
    optionsQtRegisters: OptionQtRegisters[] = [
      {
        title: 'Cartões Benefício',
        length: lotItems.length,
        exec: () => console.log(lotItems)
      },
      {
        title: 'Lançamentos Financeiros',
        length: postings.length,
        exec: () => console.log(postings)
      },
      {
        title: 'Centros de custo',
        length: costCenters.length,
        exec: () => console.info(costCenters)
      },
      {
        title: 'Locais de trabalho',
        length: workplaces.length,
        exec: () => console.info(workplaces)
      },
      {
        title: 'Serviços',
        length: services.length,
        exec: () => console.info(services)
      },
      {
        title: 'Pessoas',
        length: people.length,
        exec: () => console.info(people)
      },
      {
        title: 'Escalas',
        length: scales.length,
        exec: () => console.info(scales)
      },
      {
        title: 'Ruas',
        length: streets.length,
        exec: () => console.info(streets)
      },
      {
        title: 'Bairros',
        length: neighborhoods.length,
        exec: () => console.info(neighborhoods)
      },
      {
        title: 'Cidades',
        length: cities.length,
        exec: () => console.info(cities)
      },
      {
        title: 'Estados',
        length: districts.length,
        exec: () => console.info(districts)
      },
    ]

  useEffect(() => {
    const listener = async (e) => {
      if (e.key === 'F2') {
        if (!(await hasPrivilege('administrador')))
          return;

        setShow(true);
      }
    }

    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    }
  }, []);

  const
    renderOptionClear = (key: number, title: string, exec: () => void, id?: string) => {
      return (
        <ListItem
          key={key}
          button
          className='border-bottom p-3'
          onClick={() => {
            if (!hasOptionExec.includes(title)) {
              if (id === 'all') {
                setHasOptionExec(optionsClear.map(option => option.title));
              } else {
                handleOptionExec(title);
              }

              handleClear(exec);
            } else {
              enqueueSnackbar(
                'Tarefa já foi executada!', {
                variant: 'error',
                className: 'fw-bold'
              });
            }
          }}>
          <ListItemAvatar className='px-2'>
            <Avatar className={`${hasOptionExec.includes(title) ? 'bg-light-gray' : 'bg-primary'}`}>
              <PlayIcon className={`${hasOptionExec.includes(title) ? 'text-muted' : 'text-secondary'}`} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={title} />
        </ListItem>
      )
    },
    renderQtRegisters = (key: number, title: string, length: number, exec: () => void) => {
      return (
        <ListItem
          key={key}
          button
          className='border-bottom p-3'
          onClick={() => exec()}
        >
          <ListItemAvatar className='px-2'>
            <Avatar className='bg-light-gray'>
              <BookmarkIcon className='text-muted' />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={`${title} (${length})`} />
        </ListItem>
      )
    }

  return (
    <Dialog fullWidth={true} onClose={handleClose} open={show}>
      <DialogTitle className='bg-primary text-secondary fw-bold'>Comandos de Administrador</DialogTitle>
      <List className='p-2'>
        <ListItem className='d-flex flex-column'>
          <Button
            color="error"
            variant="contained"
            onClick={() => handleCollapseExpand('optionsClear')}
            className='col-12'
          >
            Registros dos Banco de Dados
          </Button>
          <Collapse className='col-12' in={collapseExpandedOptionsClear} timeout="auto" unmountOnExit>
            <TextField
              className='col-12 mt-4'
              label="Procurar..."
              variant="outlined"
              value={textSearchOptionsClear}
              onChange={(e) => setTextSearchOptionsClear(e.target.value)}
            />
            <List>
              {
                optionsClear
                  .filter(option => textSearchOptionsClear.length > 0 ? option.title.toLowerCase().includes(textSearchOptionsClear.toLowerCase()) : true)
                  .map((option, index) => {
                    return renderOptionClear(
                      index,
                      option.title,
                      option.exec,
                      option.id
                    )
                  })
              }
            </List>
          </Collapse>
        </ListItem>
        <ListItem className='d-flex flex-column'>
          <Button
            color="error"
            variant="contained"
            onClick={() => handleCollapseExpand('qtRegisters')}
            className='col-12'
          >
            Quantidade de Registros
          </Button>
          <Collapse className='col-12' in={collapseExpandedQtRegisters} timeout="auto" unmountOnExit>
            <TextField
              className='col-12 mt-4'
              label="Procurar..."
              variant="outlined"
              value={textSearchQtRegisters}
              onChange={(e) => setTextSearchQtRegisters(e.target.value)}
            />
            <List>
              {
                optionsQtRegisters
                  .filter(option => textSearchQtRegisters.length > 0 ? option.title.toLowerCase().includes(textSearchQtRegisters.toLowerCase()) : true)
                  .map((option, index) => {
                    return renderQtRegisters(
                      index,
                      option.title,
                      option.length,
                      option.exec
                    )
                  })
              }
            </List>
          </Collapse>
        </ListItem>
      </List>
    </Dialog>
  );
}