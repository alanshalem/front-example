import { Button, Grid, Modal, Typography } from '@brick/core';
import React, { useState } from 'react';

interface ConfirmationModalProps {
  visible: boolean;
  close: () => void;
  message: string;
}

export const ConfirmationModalSimi: React.FC<ConfirmationModalProps> = props => {
  const [message] = useState<string>(props.message);

  return (
    <Modal active={props.visible} modalClose={props.close} customWidth="800px">
      <Modal.Body>
        <Typography variant="s1" className="my-2" weight="bold">
          {message}
        </Typography>
      </Modal.Body>
      <Modal.Footer>
        <Grid>
          <Grid.Item sm={6} className='mr-20'>
            <Button
              size="small"
              variant="primary"
              className="m-2"
              onClick={props.close}
            >
              Aceptar
            </Button>
          </Grid.Item>
        </Grid>
      </Modal.Footer>
    </Modal>
  );
};
