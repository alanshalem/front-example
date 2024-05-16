import React from 'react';
import { Button, Grid, SelectInput } from '@brick/core';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';

import OverviewContext from '@contexts/Overview';
import {
  buildConciliaconInitialValueFilter,
  getAllEsquemasContablesConciliacion,
  prepareFilter,
  transformarArrayCentrosDeCosto,
  transformarArrayRubros,
  valoresConcilia,
  verificarFiltroEsquemaContableConciliacion,
} from '@lib/helpers/EsquemaContableConciliacion.helpers';
import { EsquemaContableConciliacionAuxiliar } from '@lib/types/EsquemaContableConciliacion/EsquemaContableConciliacion.types';
import { useContext, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { FilterContainer } from 'styles/CommonStyles';
import { EditarEsquemaContableConciliacionModal } from './EditarEsquemaContableConciliacionModal';
import { EliminarEsquemaContableConciliacionModal } from './EliminarEsquemaContableConciliacionModal';
import EsquemaContableConciliacionesTable from './EsquemaContableConciliacionesTable';
import { NuevoEsquemaContableConciliacionModal } from './NuevoEsquemaContableConciliacionModal';

const EsquemaContableConciliacionesPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [esquemasContablesList, setEsquemasContablesList] = useState<any[]>([]);
  const [busquedaDelDia, setBusquedaDelDia] = useState<boolean>(true);
  const [nuevoEsquemaModal, setNuevoEsquemaModal] = useState<boolean>(false);
  const [editarEsquemaModal, setEditarEsquemaModal] = useState<boolean>(false);
  const [eliminarEsquemaModal, setEliminarEsquemaModal] = useState<boolean>(
    false
  );

  const [idUnico, setIdUnico] = useState<number | null>(null);
  const [idUnicoEliminar, setIdUnicoEliminar] = useState<number | null>(null);
  const initialState: EsquemaContableConciliacionAuxiliar = {
    idCentroDeCosto: '',
    idRubro: '',
    concilia: '',
  };

  const [initialValue, setInitialValue] = useState<any>({});

  const [filtroEsquemaContable, setFiltroEsquemaContable] = useState<
    EsquemaContableConciliacionAuxiliar
  >(initialState);

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

  useEffect(() => {
    if (filtroEsquemaContable.concilia === '') {
      setInitialValue(
        buildConciliaconInitialValueFilter(
          valoresConcilia.find(
            (e: any) => filtroEsquemaContable.concilia === e.text
          )
        )
      );
    }
  }, [filtroEsquemaContable.concilia]);

  const sendFilters = () => {
    setLoading(true);
    if (verificarFiltroEsquemaContableConciliacion(filtroEsquemaContable)) {
      getAllEsquemasContablesConciliacion(setEsquemasContablesList, setLoading);
      setBusquedaDelDia(true);
    } else {
      prepareFilter(
        filtroEsquemaContable,
        setEsquemasContablesList,
        setLoading
      );
      setBusquedaDelDia(false);
    }
  };

  const cleanFilter = (event: any) => {
    event.preventDefault();
    setFiltroEsquemaContable(initialState);
    setInitialValue({
      ...initialValue,
      text: '',
      value: '',
    });
  };

  const handleChange = (value: string, field: string) => {
    setFiltroEsquemaContable(() => ({
      ...filtroEsquemaContable,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (idUnico !== null || idUnico === 0) {
      setEditarEsquemaModal(true);
    }
  }, [idUnico]);

  useEffect(() => {
    if (idUnicoEliminar !== null || idUnicoEliminar === 0) {
      setEliminarEsquemaModal(true);
    }
  }, [idUnicoEliminar]);

  useEffect(() => {
    setLoading(true);
    getAllEsquemasContablesConciliacion(setEsquemasContablesList, setLoading);
  }, []);

  const botonNuevaDevolucion = (
    <Grid
      direction="row"
      justify="start"
      alignItems="start"
      wrap="wrap"
      spacing={2}
    >
      <Grid.Item className="mb-24">
        <Button
          variant="primary"
          size="small"
          onClick={() => {
            setNuevoEsquemaModal(!nuevoEsquemaModal);
          }}
        >
          Nueva
        </Button>
      </Grid.Item>
    </Grid>
  );

  const filtros = (
    <>
      {botonNuevaDevolucion}
      <FilterContainer>
        <Grid className="h-100 d-flex mt-40">
          {/* CENTRO DE COSTO */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              label="Centro de Costo"
              items={centrosDeCostoSelectInput}
              initialValue={initialValue}
              handlerBlur={(e: any) => {
                handleChange(e.value, 'idCentroDeCosto');
              }}
            />
          </Grid.Item>
          {/* RUBRO */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              label="Rubros"
              items={rubrosSelectInput}
              initialValue={initialValue}
              handlerBlur={(e: any) => {
                handleChange(e.value, 'idRubro');
              }}
            />
          </Grid.Item>

          {/* CONCILIA */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              label="Concilia?"
              items={valoresConcilia}
              initialValue={initialValue}
              handlerBlur={(e: any) => {
                handleChange(e.value, 'concilia');
              }}
            />
          </Grid.Item>
        </Grid>
        <Grid
          direction="row"
          justify="end"
          alignItems="end"
          wrap="wrap"
          spacing={6}
          className="h-100 d-flex"
        >
          <Grid.Item>
            <Button
              variant="terciary"
              size="small"
              onClick={(e: any) => cleanFilter(e)}
            >
              Limpiar
            </Button>
          </Grid.Item>
          <Grid.Item>
            <Button variant="secondary" size="small" onClick={sendFilters}>
              Buscar
            </Button>
          </Grid.Item>
        </Grid>
      </FilterContainer>
    </>
  );

  const busquedaTernarioIndependiente = busquedaDelDia
    ? 'Todavía no se cargó ninguna Contabilidad en el día de hoy.'
    : 'No se encontraron resultados que coincidan con los filtros de búsqueda.';

  return (
    <>
      {filtros}
      <div className="d-flex justify-content-center mx-4 my-20">
        {loading ? (
          <LoadingGalicia />
        ) : (
          <EsquemaContableConciliacionesTable
            esquema={esquemasContablesList}
            refreshTable={sendFilters}
            mensajeTablaVacia={busquedaTernarioIndependiente}
            setIdUnico={setIdUnico}
            setIdUnicoEliminar={setIdUnicoEliminar}
          />
        )}
      </div>
      <div className="d-flex justify-content-center mx-4 my-20">
        <NuevoEsquemaContableConciliacionModal
          isModalActive={nuevoEsquemaModal}
          closeModal={() => {
            setNuevoEsquemaModal(false);
          }}
          refreshTable={sendFilters}
        />
        <EditarEsquemaContableConciliacionModal
          esquemasContables={esquemasContablesList}
          idEditar={idUnico}
          isModalActive={editarEsquemaModal}
          closeModal={() => {
            setEditarEsquemaModal(false);
          }}
          refreshTable={sendFilters}
          setIdUnico={setIdUnico}
        />
        <EliminarEsquemaContableConciliacionModal
          esquemasContables={esquemasContablesList}
          idEliminar={idUnicoEliminar}
          isModalActive={eliminarEsquemaModal}
          closeModal={() => {
            setEliminarEsquemaModal(false);
          }}
          refreshTable={sendFilters}
          setIdUnicoEliminar={setIdUnicoEliminar}
        />
      </div>
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

export default EsquemaContableConciliacionesPage;
