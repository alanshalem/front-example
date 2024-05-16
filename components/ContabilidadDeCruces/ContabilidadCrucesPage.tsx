/* eslint-disable react-hooks/exhaustive-deps */
import { Button, DatePicker, Grid, SelectInput, TextInput } from '@brick/core';
import { ConfirmationExportConta } from '@components/ConfirmationModal/Contabilidad/ConfirmationExportConta';
import { NuevoAnaliticoModal } from '@components/Contabilidad/NuevoAnaliticoModal';
import { FilterContainer } from '@components/Proyectadas/BusquedaProyectadas.style';
import AuthContext from '@contexts/Auth/AuthContext';
import OverviewContext from '@contexts/Overview';
import {
  checkContabilidadesListVacia,
  getAllContabilidadesCruces,
  prepareFilter,
  verificarFiltroContabilidadCruces,
} from '@lib/helpers/ContabilidadCruces/ContabilidadCruces.helpers';
import {
  buildEstadosInitialValueFilter,
  buildEstadosList,
  getEstadosFuncionalidad,
} from '@lib/helpers/Estados.helpers';
import {
  buildMonedasInitialValueFilter,
  buildMonedasList,
} from '@lib/helpers/Monedas.helpers';
import { Moneda } from '@lib/types/COMEX/Monedas.types';
import { ContabilidadesTableResponse } from '@lib/types/ContabilidadCruces/ContabilidadCruces.types';
import { Estado } from '@lib/types/Estados/Estados.types';
import React, { useContext, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { funcionalidades } from '../../config/ConfigurationService';
import { LoadingGalicia } from '../LoadingGalicia/LoadingGalicia';
import { toastCallAux } from '../Toast/Toast.helpers';
import { ContabilidadCrucesTable } from './ContabilidadCrucesTable';

export type ContabilidadCrucesAuxiliar = {
  analiticoId: string;
  fechaCreacion: string;
  divisa: string;
  monto: string;
  estado: string;
};

export const ContabilidadCrucesPage = () => {
  const initialState: ContabilidadCrucesAuxiliar = {
    analiticoId: '',
    fechaCreacion: '',
    divisa: '',
    monto: '',
    estado: '',
  };

  const estadosContext = React.useContext(OverviewContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [busquedaDelDia, setBusquedaDelDia] = useState<boolean>(true);
  const [crucesList, setCrucesList] = useState<ContabilidadesTableResponse[]>(
    []
  );
  const [initialValue, setInitialValue] = React.useState<any>({});
  const [initialValueEstados, setInitialValueEstados] = React.useState<any>({});
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(
    false
  );
  const [nuevoAnaliticoModal, setNuevoAnaliticoModal] = useState<boolean>(
    false
  );
  const [refresh, setRefresh] = useState<boolean>(false);
  const authContext = useContext(AuthContext);

  const [filtroContabilidadCruces, setFiltroContabilidadCruces] = useState<
    ContabilidadCrucesAuxiliar
  >(initialState);

  const sendFilters = () => {
    setLoading(true);
    if (verificarFiltroContabilidadCruces(filtroContabilidadCruces)) {
      getAllContabilidadesCruces(setCrucesList, setLoading);
      setBusquedaDelDia(true);
    } else {
      prepareFilter(filtroContabilidadCruces, setCrucesList, setLoading);
      setBusquedaDelDia(false);
    }
  };

  const handleChange = (value: string, field: string) => {
    setFiltroContabilidadCruces(() => ({
      ...filtroContabilidadCruces,
      [field]: value,
    }));
  };

  const cleanFilter = (event: any) => {
    event.preventDefault();
    setFiltroContabilidadCruces(initialState);
    setRefresh(true);
  };

  useEffect(() => {
    if (refresh) {
      setLoading(true);
      getAllContabilidadesCruces(setCrucesList, setLoading);
      setRefresh(false);
    }
  }, [refresh]);  

  useEffect(() => {
    setLoading(true);
    getAllContabilidadesCruces(setCrucesList, setLoading);
  }, []);

  const divisasMemo = React.useMemo(() => {
    return buildMonedasList(estadosContext.monedas);
  }, [estadosContext.monedas]);

  const estadosMemo = React.useMemo(() => {
    if (estadosContext.funcionalidades) {
      return buildEstadosList(
        getEstadosFuncionalidad(
          estadosContext.funcionalidades,
          funcionalidades.contabilidad
        )
      );
    }
  }, [estadosContext.funcionalidades]);

  React.useEffect(() => {
    if (filtroContabilidadCruces.divisa === '') {
      setInitialValue(
        buildMonedasInitialValueFilter(
          estadosContext.monedas?.find(
            (e: Moneda) => filtroContabilidadCruces.divisa === e.iso
          )
        )
      );
    }
    if (filtroContabilidadCruces.estado === '') {
      if (estadosContext.funcionalidades) {
        setInitialValueEstados(
          buildEstadosInitialValueFilter(
            getEstadosFuncionalidad(
              estadosContext.funcionalidades,
              funcionalidades.contabilidad
            )?.find(
              (e: Estado) =>
                filtroContabilidadCruces.estado === e.idEstado.toString()
            )
          )
        );
      }
    }
  }, [
    estadosContext.monedas,
    filtroContabilidadCruces.divisa,
    estadosContext.funcionalidades,
    filtroContabilidadCruces.estado,
  ]);

  const botonExportarContabilidad = (
    <Grid
      direction="row"
      justify="start"
      alignItems="start"
      wrap="wrap"
      spacing={2}
      className="h-100 d-flex"
    >
      <Grid.Item className="mb-24">
        <Button
          variant="primary"
          size="small"
          onClick={() => {
            if (crucesList.length > 0) {
              setShowConfirmationModal(!showConfirmationModal);
            } else {
              toastCallAux(
                'No se pueden exportar contabilidades vacias.',
                false
              );
            }
          }}
        >
          Exportar Contabilidades
        </Button>
      </Grid.Item>
      <Grid.Item className="mb-24">
        <Button
          variant="primary"
          size="small"
          onClick={() => {
            setNuevoAnaliticoModal(!nuevoAnaliticoModal);
          }}
        >
          Alta Manual
        </Button>
      </Grid.Item>
    </Grid>
  );

  const filtros = (
    <>
      {botonExportarContabilidad}
      <FilterContainer>
        <Grid className="h-100 d-flex mt-40">
          <Grid.Item sm={3} className="mb-24">
            <DatePicker
              label="Fecha de Creación"
              variant="inline"
              placeholder="Fecha de Creación"
              value={filtroContabilidadCruces.fechaCreacion}
              zIndexDpPopper={2}
              selectYears
              onChangeStartDate={(e: any) => {
                handleChange(e, 'fechaCreacion');
              }}
              dateFormat="dd/MM/yyyy"
              divider
            />
          </Grid.Item>
          {/* NRO OPERACION */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Nro. Operación"
              value={filtroContabilidadCruces.analiticoId}
              onChange={(e: any) => {
                handleChange(e.target.value, 'analiticoId');
              }}
            />
          </Grid.Item>
          {/* DIVISA */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={divisasMemo}
              initialValue={initialValue}
              handlerBlur={(e: any) => handleChange(e.value, 'divisa')}
              label="Divisa"
            />
          </Grid.Item>
          {/* Monto */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Monto"
              value={filtroContabilidadCruces.monto}
              inputType="currency"
              onChange={(e: any) => {
                handleChange(e.target.value, 'monto');
              }}
              thousandDelimiter="."
              decimalDelimiter=","
            />
          </Grid.Item>
          {/* Estado */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={estadosMemo}
              initialValue={initialValueEstados}
              handlerBlur={(e: any) => handleChange(e.value, 'estado')}
              label="Estado"
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
    ? 'Todavía no se cargó ninguna Contabilidad de cruces en el día de hoy.'
    : 'No se encontraron resultados que coincidan con los filtros de búsqueda.';

  return (
    <>
      {filtros}
      <div className="d-flex justify-content-center mx-4 my-20">
        {loading ? (
          <LoadingGalicia />
        ) : (
          <ContabilidadCrucesTable
            cruces={crucesList}
            refreshTable={sendFilters}
            mensajeTablaVacia={busquedaTernarioIndependiente}
            setLoading={setLoading}
          />
        )}
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
      <ConfirmationExportConta
        visible={showConfirmationModal}
        close={() => setShowConfirmationModal(false)}
        message={'Solo se exportará lo visible en la tabla. ¿Desea continuar?'}
        successMsj={'Exportado correctamente'}
        errorMsj={'No se pudo exportar'}
        cruces={crucesList}
        permisos={authContext.permisos}
        setLoading={setLoading}
        function={checkContabilidadesListVacia}
      />
      <NuevoAnaliticoModal
        isModalActive={nuevoAnaliticoModal}
        closeModal={() => setNuevoAnaliticoModal(false)}
        refreshTable={sendFilters}
      />
    </>
  );
};
