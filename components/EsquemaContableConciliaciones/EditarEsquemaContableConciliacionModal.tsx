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
import { handleEditarEsquemaContableConciliacion } from '@lib/helpers/EsquemaContableConciliacion.helpers';
import { DataEsquemaContableEditarEsquemaContableConciliacion } from '@lib/types/EsquemaContable/EsquemaContable.types';
import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

interface NuevaDevolucion {
  esquemasContables: any;
  idEditar: any;
  isModalActive: boolean;
  closeModal: () => void;
  refreshTable: () => void;
  setIdUnico: any;
}

export const EditarEsquemaContableConciliacionModal: React.FC<NuevaDevolucion> = (
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
  const [dataDisabled, setDataDisabled] = useState<any>({
    rubro: '',
    centroDeCosto: '',
  });

  const handleChange = (value: string, field: string) => {
    setDataEsquemaContable(() => ({ ...dataEsquemaContable, [field]: value }));
  };

  const editarEsquemaContable = async () => {
    handleEditarEsquemaContableConciliacion(
      dataEsquemaContable,
      setLoading,
      closeToggle,
      props.refreshTable
    );
  };

  const closeToggle = () => {
    setLoading(false);
    setDataEsquemaContable(initialStateNuevoEsquemaContableConciliacion);
    props.setIdUnico(null);
    props.closeModal();
  };

  useEffect(() => {
    if (props.idEditar !== null && props.esquemasContables.length > 0) {
      const esquemaEditar = props.esquemasContables[props.idEditar];
      if (esquemaEditar) {
        setDataEsquemaContable({
          ...initialStateNuevoEsquemaContableConciliacion,
          idRubroCentroDivisa: esquemaEditar.idRubroCentroDivisa || '',
          concilia: esquemaEditar.concilia || '',
          descripcion: esquemaEditar.descripcion || '',
        });
        setDataDisabled({
          ...dataDisabled,
          rubro: esquemaEditar.rubro ? esquemaEditar.rubro : '',
          centroCosto: esquemaEditar.centroCosto
            ? esquemaEditar.centroCosto
            : '',
        });
      }
    }
  }, [props.idEditar, props.esquemasContables]);

  return (
    <>
      <Modal active={props.isModalActive} customWidth="1300px">
        <Modal.Title
          iconCloseAction={() => {
            closeToggle();
          }}
          titleText="Editar"
        />
        <Modal.Body customHeight={'90vh'}>
          <Container maxWidth="fluid">
            <Grid className="h-100 d-flex mt-40">
              {/* RUBRO */}
              <Grid.Item sm={3} className="mb-24">
                {props.isModalActive && (
                  <TextInput
                    inputType="number"
                    size="normal"
                    label="Rubro"
                    value={dataDisabled.rubro}
                    disabled={true}
                  />
                )}
              </Grid.Item>
              {/* CENTRO DE COSTO */}
              <Grid.Item sm={3} className="mb-24">
                {props.isModalActive && (
                  <TextInput
                    inputType="number"
                    size="normal"
                    label="Centro de Costo"
                    value={dataDisabled.centroCosto}
                    disabled={true}
                  />
                )}
              </Grid.Item>
              {/* DESCRIPCION */}
              <Grid.Item sm={3} className="mb-24">
                {props.isModalActive && (
                  <TextInput
                    size="normal"
                    label="Descripcion"
                    value={dataEsquemaContable.descripcion}
                    onChange={(e: any) => {
                      handleChange(e.target.value, 'descripcion');
                    }}
                  />
                )}
              </Grid.Item>
              <Grid.Item sm={3} className="mb-24">
                {props.isModalActive && (
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
                    handlerBlur={e => {
                      handleChange(e.value, 'concilia');
                    }}
                  />
                )}
              </Grid.Item>
            </Grid>
            {loading && <LoadingGalicia />}
          </Container>
        </Modal.Body>
        <Modal.Footer alingElement="flex-end">
          <Button
            size="small"
            onClick={() => {
              editarEsquemaContable();
            }}
            disabled={false} // Deshabilitar el botón si los campos no están completos
          >
            Guardar
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
