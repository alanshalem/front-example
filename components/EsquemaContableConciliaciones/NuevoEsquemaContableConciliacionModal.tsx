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
import OverviewContext from '@contexts/Overview';
import {
  buildConciliaconInitialValueFilter,
  handleGuardarEsquemaContableConciliacion,
  transformarArrayCentrosDeCosto,
  transformarArrayRubros,
  valoresConciliaBoolean,
} from '@lib/helpers/EsquemaContableConciliacion.helpers';
import { DataEsquemaContableNuevoEsquemaContableConciliacion } from '@lib/types/EsquemaContable/EsquemaContable.types';
import React, { useContext, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

interface NuevaDevolucion {
  isModalActive: boolean;
  closeModal: () => void;
  refreshTable: () => void;
}

export const NuevoEsquemaContableConciliacionModal: React.FC<NuevaDevolucion> = (
  props: NuevaDevolucion
) => {
  const { accounts } = useMsal();
  const { centrosDeCosto, rubros } = useContext(OverviewContext);
  const [centrosDeCostoSelectInput, setCentrosDeCostoSelectInput] = useState<
    any
  >();
  const [rubrosSelectInput, setRubrosSelectInput] = useState<any>();
  useEffect(() => {
    if (centrosDeCosto) {
      setCentrosDeCostoSelectInput(
        transformarArrayCentrosDeCosto(centrosDeCosto)
      );
    }
  }, [centrosDeCosto]);

  useEffect(() => {
    if (rubros) {
      setRubrosSelectInput(transformarArrayRubros(rubros));
    }
  }, [rubros]);

  const legajo = accounts[0].username.slice(0, 8);
  const initialStateNuevoEsquemaContableConciliacion: any = {
    idRubro: '',
    descripcion: '',
    idCentroDeCosto: '',
    concilia: true,
    legajo: legajo,
  };

  const [dataEsquemaContable, setDataEsquemaContable] = useState<
    DataEsquemaContableNuevoEsquemaContableConciliacion
  >(initialStateNuevoEsquemaContableConciliacion);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [initialValue, setInitialValue] = useState<any>({});

  const handleChange = (value: string, field: string) => {
    setDataEsquemaContable(() => ({ ...dataEsquemaContable, [field]: value }));
  };

  useEffect(() => {
    if (dataEsquemaContable.concilia !== null) {
      setInitialValue(
        buildConciliaconInitialValueFilter(
          valoresConciliaBoolean.find(
            (e: any) => dataEsquemaContable.concilia === e.text
          )
        )
      );
    }
  }, [dataEsquemaContable.concilia]);

  const guardarNuevoEsquemaContable = async () => {
    handleGuardarEsquemaContableConciliacion(
      dataEsquemaContable,
      setLoading,
      closeToggle,
      props.refreshTable
    );
  };

  const closeToggle = () => {
    setLoading(false);
    setDataEsquemaContable(initialStateNuevoEsquemaContableConciliacion);
    props.closeModal();
  };

  return (
    <>
      <Modal active={props.isModalActive} customWidth="1300px">
        <Modal.Title
          iconCloseAction={() => {
            closeToggle();
          }}
          titleText="Nueva"
        />
        <Modal.Body isStatic={true} customHeight={'90vh'}>
          <Container maxWidth="fluid">
            <Grid>
              {/* RUBRO */}
              <Grid.Item xs={3} direction="row" className="mt-32">
                {props.isModalActive && (
                  <SelectInput
                    variant="inline"
                    label="Rubros"
                    items={rubrosSelectInput}
                    initialValue={initialValue}
                    handlerBlur={(e: any) => {
                      handleChange(e.value, 'idRubro');
                    }}
                  />
                )}
              </Grid.Item>
              {/* CENTRO DE COSTO */}
              <Grid.Item xs={3} direction="row" className="mt-32">
                {props.isModalActive && (
                  <SelectInput
                    variant="inline"
                    label="Centro de Costo"
                    items={centrosDeCostoSelectInput}
                    initialValue={initialValue}
                    handlerBlur={(e: any) => {
                      handleChange(e.value, 'idCentroDeCosto');
                    }}
                  />
                )}
              </Grid.Item>
              {/* DESCRIPCION */}
              <Grid.Item xs={3} direction="row" className="mt-32">
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
              <Grid.Item xs={3} direction="row" className="mt-32">
                {props.isModalActive && (
                  <SelectInput
                    variant="inline"
                    label="Concilia?"
                    items={valoresConciliaBoolean}
                    initialValue={initialValue}
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
              guardarNuevoEsquemaContable();
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
