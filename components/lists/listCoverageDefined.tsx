/**
 * @description Lista -> Lista de coberturas operacionais lançadas
 * @author GuilhermeSantos001
 * @update 19/01/2022
 */

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import ArrowCircleUp from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDown from '@mui/icons-material/ArrowCircleDown';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import DateEx from '@/src/utils/dateEx';

import { useAppSelector } from '@/app/hooks';

import type {
  PostingCreate
} from '@/app/features/payback/payback.slice';

export type Props = {
  postings: PostingCreate[]
  handlePostingRemove: (id: string) => void
}

export default function ListCoverageDefined(props: Props) {
  const
    workplaces = useAppSelector(state => state.system.workplaces || []),
    people = useAppSelector(state => state.system.people || []),
    reasonForAbsences = useAppSelector(state => state.system.reasonForAbsences || []);

  return (
    <List className='col-12 bg-light-gray border rounded m-2'>
      {
        props.postings.length > 0 ?
          props.postings.map(posting => {
            const
              coveringWorkplace = workplaces.find(place => place.id === posting.coveringWorkplace),
              coverageWorkplace = workplaces.find(place => place.id === posting.coverageWorkplace);

            let coveringPerson, coveragePerson, coveringReasonForAbsence;

            if (posting.covering)
              coveringPerson = people.find(person => person.id === posting.covering.id);

            if (posting.coverage)
              coveragePerson = people.find(person => person.id === posting.coverage.id);

            if (coveringPerson)
              coveringReasonForAbsence = reasonForAbsences.find(reason => reason.id === posting.covering.reasonForAbsence).value;

            return (
              <div key={posting.id} className='d-flex flex-column flex-md-row justify-content-center align-items-center p-2'>
                <Chip label={DateEx.format(new Date(posting.originDate), 'dd/MM/yy')} className='bg-primary text-white fw-bold' />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className='bg-danger'>
                      <ArrowCircleDown className='text-white fw-bold fs-1' />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={`Posto de Cobertura: ${coveringWorkplace.name}`} secondary={coveringPerson ? `[${coveringPerson.matricule}] - ${coveringPerson.name}` : 'Descoberto'} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className='bg-success'>
                      <ArrowCircleUp className='text-white fw-bold fs-1' />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={coverageWorkplace ? `Posto de Origem: ${coverageWorkplace.name}` : `Freelancer`} secondary={`[${coveragePerson.matricule}] - ${coveragePerson.name}`} />
                </ListItem>
                <Chip label={`Motivo: ${coveringReasonForAbsence ? coveringReasonForAbsence : 'Falta de Efetivo'}`} className='bg-primary text-white shadow' />
                <Button
                  variant="text"
                  className='mx-2 rounded'
                  color="error"
                  onClick={() => props.handlePostingRemove(posting.id)}
                >
                  <DeleteForeverIcon className='fw-bold fs-3' />
                </Button>
              </div>
            )
          })
          :
          <ListItem>
            <ListItemText primary='Nenhuma cobertura aplicada.' />
          </ListItem>
      }
    </List>
  );
}