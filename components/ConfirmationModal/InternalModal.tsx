import { Button, Grid, Modal, Typography } from '@brick/core'
import React from 'react'


interface InternalModalProps {
  visible: boolean;
  close: () => void;
  message: string;
  onAccept: () => void; 
  loading: boolean;
}

export const InternalModal = ({visible, close, message, loading, onAccept}: InternalModalProps) => {
  return (
    <Modal active={visible} modalClose={close} customWidth="800px">
      <Modal.Body>
        <Typography variant="s1" className="my-2" weight="bold">
          {message}
        </Typography>
      </Modal.Body>
      <Modal.Footer>
        <Grid spacing={1}>
          <Grid.Item>
            <Button
              size="small"
              variant="primary"
              onClick={onAccept}
              disabled={loading}
            >
              Aceptar
            </Button>
          </Grid.Item>
          <Grid.Item >
            <Button
              size="small"
              variant="secondary"
              onClick={close}
              disabled={loading}
            >
              Cancelar
            </Button>
          </Grid.Item>
        </Grid>
      </Modal.Footer>
    </Modal>
  )
}
