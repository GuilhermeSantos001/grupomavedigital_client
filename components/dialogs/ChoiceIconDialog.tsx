import * as React from 'react';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';

import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/CloseOutlined';

declare interface Choice {
  label: string;
  value: string;
  icon: Icon;
}

declare type Icon = OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
  muiName: string;
};

export interface Props {
  title: string;
  open: boolean;
  selectedValue: string;
  choices: Choice[];
  onClose: (value: string) => void;
}

export function ChoiceIconDialog(props: Props) {
  const { title, onClose, selectedValue, open, choices } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'sm'}
      onClose={handleClose}
      open={open}
    >
      <DialogTitle className="bg-primary bg-gradient text-secondary fw-bold">{title}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {choices.map((choice) => (
          <ListItem button onClick={() => handleListItemClick(choice.value)} key={choice.label}>
            <ListItemAvatar>
              <Avatar className="bg-primary bg-gradient text-secondary">
                <choice.icon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={choice.label} />
          </ListItem>
        ))}
        <ListItem autoFocus button onClick={() => handleListItemClick('addAccount')}>
          <ListItemAvatar>
            <Avatar>
              <CloseIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Voltar" />
        </ListItem>
      </List>
    </Dialog>
  );
}