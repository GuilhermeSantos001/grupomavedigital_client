/**
 * @description Janela de super administrador
 * @author GuilhermeSantos001
 * @update 18/01/2022
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
import DataObject from '@mui/icons-material/DataObject';

import hasPrivilege from '@/src/functions/hasPrivilege'
import Alerting from '@/src/utils/alerting'

import { useSnackbar } from 'notistack';

import { useAppDispatch, useAppSelector } from '@/app/hooks';

import {
  SystemActions
} from '@/app/features/system/system.slice'

import {
  PaybackActions
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
    },
    handleConsoleShowData = (data: any) => {
      console.warn(data);

      enqueueSnackbar(
        'Abra o seu terminal e verifique os dados.', {
        variant: 'info',
        className: 'bg-primary fw-bold text-secondary'
      });
    }

  const
    lotItems = useAppSelector(state => state.payback.lotItems || []),
    postings = useAppSelector(state => state.payback.postings || []),
    costCenters = useAppSelector(state => state.system.costCenters || []),
    workplaces = useAppSelector(state => state.system.workplaces || []),
    services = useAppSelector(state => state.system.services || []),
    people = useAppSelector(state => state.system.people || []),
    reasonForAbsences = useAppSelector(state => state.system.reasonForAbsences || []),
    scales = useAppSelector(state => state.system.scales || []),
    streets = useAppSelector(state => state.system.streets || []),
    neighborhoods = useAppSelector(state => state.system.neighborhoods || []),
    cities = useAppSelector(state => state.system.cities || []),
    districts = useAppSelector(state => state.system.districts || []),
    uploads = useAppSelector(state => state.system.uploads || []),
    optionsClear: OptionClear[] = [
      {
        id: 'all',
        title: 'Limpar todos os registros',
        exec: () => {
          dispatch(PaybackActions.CLEAR_LOTS());
          dispatch(PaybackActions.CLEAR_POSTINGS());
          dispatch(SystemActions.CLEAR_COSTCENTERS());
          dispatch(SystemActions.CLEAR_WORKPLACES());
          dispatch(SystemActions.CLEAR_SERVICES());
          dispatch(SystemActions.CLEAR_PEOPLE());
          dispatch(SystemActions.CLEAR_REASONFORABSENCES());
          dispatch(SystemActions.CLEAR_SCALES());
          dispatch(SystemActions.CLEAR_STREETS());
          dispatch(SystemActions.CLEAR_NEIGHBORHOODS());
          dispatch(SystemActions.CLEAR_CITIES());
          dispatch(SystemActions.CLEAR_DISTRICTS());
          dispatch(SystemActions.CLEAR_UPLOADS());
        }
      },
      {
        title: 'Limpar registros dos centros de custo',
        exec: () => dispatch(SystemActions.CLEAR_COSTCENTERS())
      },
      {
        title: 'Limpar registros dos lotes de cartão',
        exec: () => dispatch(PaybackActions.CLEAR_LOTS())
      },
      {
        title: 'Limpar registros dos lançamentos financeiros',
        exec: () => dispatch(PaybackActions.CLEAR_POSTINGS())
      },
      {
        title: 'Limpar registros dos locais de trabalho',
        exec: () => dispatch(SystemActions.CLEAR_WORKPLACES())
      },
      {
        title: 'Limpar registros dos serviços',
        exec: () => dispatch(SystemActions.CLEAR_SERVICES())
      },
      {
        title: 'Limpar registros das pessoas',
        exec: () => dispatch(SystemActions.CLEAR_PEOPLE())
      },
      {
        title: 'Limpar registros dos motivos de falta',
        exec: () => dispatch(SystemActions.CLEAR_REASONFORABSENCES())
      },
      {
        title: 'Limpar registros das escalas',
        exec: () => dispatch(SystemActions.CLEAR_SCALES())
      },
      {
        title: 'Limpar registros das ruas',
        exec: () => dispatch(SystemActions.CLEAR_STREETS())
      },
      {
        title: 'Limpar registros dos bairros',
        exec: () => dispatch(SystemActions.CLEAR_NEIGHBORHOODS())
      },
      {
        title: 'Limpar registros das cidades',
        exec: () => dispatch(SystemActions.CLEAR_CITIES())
      },
      {
        title: 'Limpar registros dos estados',
        exec: () => dispatch(SystemActions.CLEAR_DISTRICTS())
      },
      {
        title: 'Limpar registros dos uploads',
        exec: () => dispatch(SystemActions.CLEAR_UPLOADS())
      },
    ],
    optionsQtRegisters: OptionQtRegisters[] = [
      {
        title: 'Cartões Benefício',
        length: lotItems.length,
        exec: () => handleConsoleShowData(lotItems)
      },
      {
        title: 'Lançamentos Financeiros',
        length: postings.length,
        exec: () => handleConsoleShowData(postings)
      },
      {
        title: 'Centros de custo',
        length: costCenters.length,
        exec: () => handleConsoleShowData(costCenters)
      },
      {
        title: 'Locais de trabalho',
        length: workplaces.length,
        exec: () => handleConsoleShowData(workplaces)
      },
      {
        title: 'Serviços',
        length: services.length,
        exec: () => handleConsoleShowData(services)
      },
      {
        title: 'Pessoas',
        length: people.length,
        exec: () => handleConsoleShowData(people)
      },
      {
        title: 'Motivos de Falta',
        length: reasonForAbsences.length,
        exec: () => handleConsoleShowData(reasonForAbsences)
      },
      {
        title: 'Escalas',
        length: scales.length,
        exec: () => handleConsoleShowData(scales)
      },
      {
        title: 'Ruas',
        length: streets.length,
        exec: () => handleConsoleShowData(streets)
      },
      {
        title: 'Bairros',
        length: neighborhoods.length,
        exec: () => handleConsoleShowData(neighborhoods)
      },
      {
        title: 'Cidades',
        length: cities.length,
        exec: () => handleConsoleShowData(cities)
      },
      {
        title: 'Estados',
        length: districts.length,
        exec: () => handleConsoleShowData(districts)
      },
      {
        title: 'Uploads',
        length: uploads.length,
        exec: () => handleConsoleShowData(uploads)
      },
    ]

  useEffect(() => {
    const listener = async (e) => {
      if (e.key === 'F2') {
        try {
          if (!(await hasPrivilege('administrador')))
            return;

          setShow(true);
        } catch (error) {
          Alerting.create('error', 'Você não pode abrir a janela de administrador agora!');
          console.error(error);
        }
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
              <DataObject className='text-muted' />
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
            onClick={() => handleCollapseExpand('qtRegisters')}
            className='col-12'
          >
            Registros
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
        <ListItem className='d-flex flex-column'>
          <Button
            color="error"
            variant="contained"
            onClick={() => handleCollapseExpand('optionsClear')}
            className='col-12'
          >
            Limpar
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
      </List>
    </Dialog>
  );
}