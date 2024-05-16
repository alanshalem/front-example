import React from 'react';
import { Button, Grid, Modal, Typography } from '@brick/core';
import { PosventaTableItem } from '@lib/types/Posventa/Posventa.types';
import { Title } from 'styles/CommonStyles';
import WorkflowModalTimeline from './WorkflowModalTimeline';

interface WorkflowModalProps {
  visible: boolean;
  close: () => void;
  posventa: PosventaTableItem;
}

const WorkflowModal = ({ visible, close, posventa }: WorkflowModalProps) => {
  const detalleWorkflow = posventa?.detalleWorkflow;

  return (
    <Modal active={visible} modalClose={close} customWidth="50rem">
      <Modal.Body className="d-flex justify-content-center">
        {Array.isArray(detalleWorkflow) && detalleWorkflow.length > 0 ? (
          <WorkflowModalTimeline detalleWorkflow={detalleWorkflow} />
        ) : (
          <Title>
            <Typography variant="s1" className="my-2" weight="bold">
              Esta devolucion no posee workflow.
            </Typography>
          </Title>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Grid spacing={1}>
          <Grid.Item>
            <Button size="small" variant="secondary" onClick={close}>
              Cerrar
            </Button>
          </Grid.Item>
        </Grid>
      </Modal.Footer>
    </Modal>
  );
};

export default WorkflowModal;
