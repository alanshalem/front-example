import { useMsal } from '@azure/msal-react';
import { Button, Container, Modal, TextInput } from '@brick/core';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import {
  createObservacionComexSAP,
  getObservacionesByIdSapAlerta,
} from '@lib/helpers/ConciliacionComexSAP.helpers';
import React, { useEffect, useState } from 'react';
import ObservacionesTable from './ObservacionesTable'; 

type Observacion = {
  id: number;
  observacion: string;
  legajo: string;
  fechaObservacion: string;
};

type Props = {
  visible: boolean;
  close: () => void;
  conciliacion: {
    idSapAlerta: number;
  } | null;
};

const ObservacionesModal: React.FC<Props> = ({
  visible,
  close,
  conciliacion,
}) => {
  const { accounts } = useMsal();
  const legajo = accounts[0].username.slice(0, 8);
  const [loading, setLoading] = useState<boolean>(true);
  const [nuevaObservacion, setNuevaObservacion] = useState<string>('');
  const [observaciones, setObservaciones] = useState<
    Observacion[] | undefined
  >();

  useEffect(() => {
    const fetchObservaciones = async () => {
      try {
        if (conciliacion && conciliacion.idSapAlerta) {
          await getObservacionesByIdSapAlerta(
            conciliacion?.idSapAlerta || 0,
            setObservaciones,
            setLoading
          );
        }
      } catch (error) {
        console.error('Error fetching observaciones:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchObservaciones();
  }, [conciliacion, visible]);

  const closeToggle = () => {
    setObservaciones([]);
    setNuevaObservacion('');
    close();
  };

  const handleClose = () => {
    closeToggle();
  };

  const handleGuardar = async () => {
    try {
      createObservacionComexSAP(
        conciliacion?.idSapAlerta || 0,
        nuevaObservacion,
        legajo,
        handleClose
      );
    } catch (error) {
      console.error('Error creating observacion:', error);
    }
  };

  return (
    <Modal active={visible} modalClose={close} customWidth="1300px">
      <Modal.Title
        iconCloseAction={() => {
          closeToggle();
        }}
        titleText="Detalles"
      />
      <Modal.Body
        isStatic
        className="d-flex flex-column justify-content-center"
      >
        <Container maxWidth="fluid">
          <TextInput
            id="ID"
            label="Observación (max. 200 caracteres)"
            message="Observación"
            onChange={e => setNuevaObservacion(e.target.value)}
            placeholder="Nueva Observacion"
            value={nuevaObservacion}
            maxLength={200}
            variant="border"
          />
          <ObservacionesTable observaciones={observaciones} />
        </Container>
      </Modal.Body>
      <Modal.Footer alingElement="flex-end">
        <Button size="small" variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <div style={{ marginRight: '8px' }}></div>

        <Button size="small" variant="secondary" onClick={handleGuardar}>
          Guardar
        </Button>
      </Modal.Footer>
      {loading && <LoadingGalicia />}
    </Modal>
  );
};

export default ObservacionesModal;
