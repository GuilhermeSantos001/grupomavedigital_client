import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { HeartSpinner } from 'react-spinners-kit';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75%',
  height: '75%'
};

export type Props = {
  header: string
  show: boolean
  handleClose: () => void
}

export function ModalError(props: Props) {
  return (
    <Modal
      open={props.show}
      onClose={props.handleClose}
      aria-labelledby="modal-loading-title"
      aria-describedby="modal-loading-description"
    >
      <Box className='bg-light-gray bg-gradient rounded shadow' sx={style}>
        <div className='d-flex flex-row justify-content-center align-items-center bg-primary bg-gradient p-2 rounded' style={{ height: '10vh' }}>
          <p className='fs-1 text-secondary fw-bold my-auto'>
            {props.header}
          </p>
        </div>
        <div className='d-flex flex-column fade-effect active'>
          <div className='d-flex justify-content-center p-2'>
            <p>Não foi possível carregar as informações. Tente novamente, mais tarde!</p>
          </div>
          <div className='d-flex justify-content-center p-2'>
            <p className="text-muted">
              Lamentamos o inconveniente.
            </p>
            <HeartSpinner size={32} color='#ff0000' />
          </div>
        </div>
      </Box>
    </Modal>
  );
}
