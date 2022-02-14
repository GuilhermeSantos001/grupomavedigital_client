import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { RotateSpinner } from 'react-spinners-kit';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  height: '80%'
};

export type Props = {
  header: string
  message: string
  show: boolean
  handleClose: () => void
}

export function ModalLoading(props: Props) {
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
        <div className='d-flex flex-row justify-content-center align-items-center p-2'>
          <p className='text-muted'>
            {props.message}
          </p>
        </div>
        <div className='d-flex justify-content-center align-items-center'>
          <div className='d-flex justify-content-center col-6 p-2'>
            <RotateSpinner size={52} color="#004a6e" />
          </div>
        </div>
      </Box>
    </Modal>
  );
}
