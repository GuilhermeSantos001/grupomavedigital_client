import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import { PersonType } from '@/types/PersonType'
import { CardType } from '@/types/CardType'
import { PostingType } from '@/types/PostingType'
import { B2Type } from '@/types/B2Type'

import {
  FunctionAssignPeopleCardTypeof,
  FunctionUnassignPeopleCardTypeof
} from '@/types/CardServiceType'

import Alerting from '@/src/utils/alerting'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export type Props = {
  open: boolean
  person: PersonType
  cards: CardType[]
  postings: PostingType[]
  postingsB2: B2Type[]
  assignPersonCard: FunctionAssignPeopleCardTypeof,
  unassignPersonCard: FunctionUnassignPeopleCardTypeof,
  handleClose: () => void
}

export function ManagerCards(props: Props) {
  return (
    <Dialog
      fullScreen
      open={props.open}
      onClose={props.handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={props.handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Cartões Alelo (Benefício) do {props.person.name}
          </Typography>
          <Button autoFocus color="inherit" onClick={props.handleClose}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>
      <List>
        <ListItem className="text-primary">
          <ListItemText primary="Em Uso" secondary="Todos os cartões do colaborador" />
        </ListItem>
        <Divider />
        {
          props.person.cards.map(card => (
            <div key={card.id}>
              <ListItem button>
                <ListItemText primary={`Lote [${card.lotNum}], Número de Série [${card.serialNumber}], 4 Últimos Dígitos do Cartão [${card.lastCardNumber}]`} secondary={card.costCenter.value} />
                <Button
                  color="error"
                  disabled={
                    props.postings.filter(posting =>
                      posting.paymentStatus === 'pending' &&
                      posting.paymentMethod === 'card' &&
                      posting.costCenterId === card.costCenterId &&
                      posting.coverage.person.cards.some(_ => _.id === card.id)
                    ).length > 0 ||
                    props.postingsB2.filter(posting =>
                      posting.paymentStatus === 'pending' &&
                      posting.paymentMethod === 'card' &&
                      posting.costCenterId === card.costCenterId &&
                      posting.personB2.person.cards.some(_ => _.id === card.id)
                    ).length > 0
                  }
                  onClick={async () => {
                    if (!props.unassignPersonCard)
                      return Alerting.create('error', 'Não foi possível desassociar o cartão. Por favor, tente novamente.');

                    await props.unassignPersonCard([card.id]);
                  }}
                >
                  Desassociar
                </Button>
              </ListItem>
              <Divider />
            </div>
          ))
        }
        {
          props.person.cards.length <= 0 &&
          <>
            <ListItem disabled>
              <ListItemText primary="Nenhum cartão associado" secondary="Você pode associar um cartão por empresa." />
            </ListItem>
            <Divider />
          </>
        }
        <ListItem className="text-primary">
          <ListItemText primary="Disponíveis" secondary="Prontos para associação" />
        </ListItem>
        <Divider />
        {
          props.cards.filter(card => !card.personId).length <= 0 &&
          <>
            <ListItem disabled>
              <ListItemText primary="Nenhum cartão disponível" secondary="Entre em contato com o departamento financeiro." />
            </ListItem>
            <Divider />
          </>
        }
        {
          props.cards.filter(card => !card.personId).map(card => (
            <div key={card.id}>
              <ListItem button>
                <ListItemText primary={`Lote [${card.lotNum}], Número de Série [${card.serialNumber}], 4 Últimos Dígitos do Cartão [${card.lastCardNumber}]`} secondary={card.costCenter.value} />
                <Button
                  color="success"
                  disabled={props.person.cards.some(_ => _.costCenterId === card.costCenterId)}
                  onClick={async () => {
                    if (!props.assignPersonCard)
                      return Alerting.create('error', 'Não foi possível associar o cartão. Por favor, tente novamente.');

                    await props.assignPersonCard(card.id, [{ personId: props.person.id }]);
                  }}
                >
                  Associar
                </Button>
              </ListItem>
              <Divider />
            </div>
          ))
        }
      </List>
    </Dialog>
  );
}
