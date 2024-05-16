/* eslint-disable react-hooks/exhaustive-deps */
// @ts-ignore
import { useMsal } from '@azure/msal-react';
import {
  Button,
  Container,
  Grid,
  Modal,
  SelectInput,
  TextInput,
} from '@brick/core';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import { handleEliminarEsquemaContableConciliacion } from '@lib/helpers/EsquemaContableConciliacion.helpers';
import { DataEsquemaContableEditarEsquemaContableConciliacion } from '@lib/types/EsquemaContable/EsquemaContable.types';
import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

interface NuevaDevolucion {
  esquemasContables: any;
  idEliminar: any;
  isModalActive: boolean;
  closeModal: () => void;
  refreshTable: () => void;
  setIdUnicoEliminar: any;
}

export const EliminarEsquemaContableConciliacionModal: React.FC<NuevaDevolucion> = (
  props: NuevaDevolucion
) => {
  const { accounts } = useMsal();
  const legajo = accounts[0].username.slice(0, 8);
  const initialStateNuevoEsquemaContableConciliacion: any = {
    idRubroCentroDivisa: '',
    descripcion: '',
    concilia: '',
    legajo: legajo,
  };

  const [dataEsquemaContable, setDataEsquemaContable] = useState<
    DataEsquemaContableEditarEsquemaContableConciliacion
  >(initialStateNuevoEsquemaContableConciliacion);
  const [loading, setLoading] = useState<boolean | null>(null);

  const eliminarEsquemaContable = async () => {
    handleEliminarEsquemaContableConciliacion(
      dataEsquemaContable.idRubroCentroDivisa,
      setLoading,
      closeToggle,
      props.refreshTable
    );
  };

  const closeToggle = () => {
    setLoading(false);
    setDataEsquemaContable(initialStateNuevoEsquemaContableConciliacion);
    props.setIdUnicoEliminar(null);
    props.closeModal();
  };

  useEffect(() => {
    if (props.idEliminar !== null && props.esquemasContables.length > 0) {
      const esquemaAEliminar = props.esquemasContables[props.idEliminar];
      if (esquemaAEliminar) {
        setDataEsquemaContable({
          ...dataEsquemaContable,
          idRubroCentroDivisa: esquemaAEliminar.idRubroCentroDivisa || '',
          concilia: esquemaAEliminar.concilia || '',
          descripcion: esquemaAEliminar.descripcion || '',
          rubro: esquemaAEliminar.rubro || '',
          centroDeCosto: esquemaAEliminar.centroCosto || '',
        });
      }
    }
  }, [props.idEliminar, props.esquemasContables]);

  return (
    <>
      <Modal active={props.isModalActive} customWidth="1300px">
        <Modal.Title
          iconCloseAction={() => {
            closeToggle();
          }}
          titleText="Eliminar"
        />
        <Modal.Body customHeight={'90vh'}>
          <Container maxWidth="fluid">
            <Grid className="h-100 d-flex mt-40">
              {/* RUBRO */}
              <Grid.Item sm={3} className="mb-24">
                <TextInput
                  inputType="number"
                  size="normal"
                  label="Rubro"
                  value={dataEsquemaContable.rubro}
                  disabled={true}
                />
              </Grid.Item>
              {/* CENTRO DE COSTO */}
              <Grid.Item sm={3} className="mb-24">
                <TextInput
                  inputType="number"
                  size="normal"
                  label="Centro de Costo"
                  value={dataEsquemaContable.centroDeCosto}
                  disabled={true}
                />
              </Grid.Item>
              {/* DESCRIPCION */}
              <Grid.Item sm={3} className="mb-24">
                <TextInput
                  size="normal"
                  label="Descripcion"
                  value={dataEsquemaContable.descripcion}
                  disabled={true}
                />
              </Grid.Item>
              <Grid.Item sm={3} className="mb-24">
                <SelectInput
                  variant="inline"
                  label="Concilia?"
                  items={[
                    { text: 'Si', value: true },
                    { text: 'No', value: false },
                  ]}
                  initialValue={{
                    text: dataEsquemaContable.concilia ? 'SI' : 'NO',
                    value: dataEsquemaContable.concilia ? 'true' : 'false',
                  }}
                  disabled={true}
                />
              </Grid.Item>
            </Grid>
            {loading && <LoadingGalicia />}
          </Container>
        </Modal.Body>
        <Modal.Footer alingElement="flex-end">
          <Button
            size="small"
            onClick={() => {
              eliminarEsquemaContable();
            }}
            disabled={false} // Deshabilitar el botón si los campos no están completos
          >
            Eliminar
          </Button>
        </Modal.Footer>
        {loading && <LoadingGalicia />}
      </Modal>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </>
  );
};
