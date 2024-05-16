/* eslint-disable react-hooks/exhaustive-deps */
import { Button, DatePicker, Grid, SelectInput, TextInput } from '@brick/core';
import { toastCallAux } from '@components/Toast/Toast.helpers';
import AuthContext from '@contexts/Auth/AuthContext';
import OverviewContext from '@contexts/Overview';
import { tienePermisos } from '@lib/helpers/Auth.helpers';
import { getExportBcra } from '@lib/helpers/Export.helpers';
import {
  arrayProyectadaToCSV,
  buildConceptoInitialValueFilter,
  buildConceptosList,
  getAllProyectadas,
  prepareFilter,
  verificarFiltro,
} from '@lib/helpers/Proyectadas.helpers';
import { getProyectadasVsOpcam, nuevaProyectada } from '@lib/services/Proyectadas.services';
import { ConceptoDeBoleto } from '@lib/types/COMEX/ConceptoDeBoleto.types';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';
import { Proyectada, ProyectadaAuxiliar } from '@lib/types/Proyectada.types';
import React, { useContext, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { acciones, funcionalidades } from '../../config/ConfigurationService';
import { LoadingGalicia } from '../LoadingGalicia/LoadingGalicia';
import { FilterContainer } from './BusquedaProyectadas.style';
import { NuevaProyectadaModal } from './NuevaProyectadaModal';
import { ProyectadasTable } from './ProyectadasTable';

export const BusquedaProyectadas = () => {
  const initialState: ProyectadaAuxiliar = {
    cuit: '',
    codigoConcepto: '',
    legajoUltimaModificacion: '',
    monto: '',
    raype: '',
    fechaCreacion: '',
    fechaProyectada: '',
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [busquedaDelDia, setBusquedaDelDia] = useState<boolean>(true);

  const [showModalNuevaProyectada, setShowModalNuevaProyectada] = useState<
    boolean
  >(false);
  const [proyectadasList, setProyectadasList] = useState<Proyectada[]>([]);
  // STATES DE FILTROS
  const [filtroProyectada, setFiltroProyectada] = useState<ProyectadaAuxiliar>(
    initialState
  );
  const [items, setItems] = React.useState<ItemDropdown[]>([]);
  const [initialValue, setInitialValue] = React.useState<any>({});
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleChange = (value: string, field: string) => {
    setFiltroProyectada(() => ({ ...filtroProyectada, [field]: value }));
  };

  const estadosContext = useContext(OverviewContext);
  const authContext = useContext(AuthContext);

  const sendFilters = () => {
    // Si los campos de los filtros estan vacios me traigo todas las proyectadas del dia
    setLoading(true);
    if (verificarFiltro(filtroProyectada)) {
      getAllProyectadas(setProyectadasList, setLoading);
      setBusquedaDelDia(true);
    } else {
      // Sino hago un getByFilter
      prepareFilter(filtroProyectada, setProyectadasList, setLoading);
      setBusquedaDelDia(false);
    }
  };

  const cleanFilter = (event: any) => {
    event.preventDefault();
    setFiltroProyectada(initialState);
    setRefresh(true);
  };

  useEffect(() => {
    setLoading(true);
    getAllProyectadas(setProyectadasList, setLoading);
  }, []);

  useEffect(() => {
    if (refresh) {
      setLoading(true);
      getAllProyectadas(setProyectadasList, setLoading);
      setRefresh(false);
    }
  }, [refresh])

  useEffect(() => {
    setItems(buildConceptosList(estadosContext.conceptos));
  }, [estadosContext.conceptos]);

  React.useEffect(() => {
    if (filtroProyectada.codigoConcepto === '') {
      setInitialValue(
        buildConceptoInitialValueFilter(
          estadosContext.conceptos?.find(
            (e: ConceptoDeBoleto) =>
              filtroProyectada.codigoConcepto === e.codigo
          )
        )
      );
    }
  }, [estadosContext.conceptos, filtroProyectada.codigoConcepto]);

  const botonNuevaProyectada = (
    <Grid
      direction="row"
      justify="start"
      alignItems="start"
      wrap="wrap"
      spacing={2}
      className="h-100 d-flex mt-40"
    >
      <Grid.Item className="mb-24">
        <Button
          variant="primary"
          size="small"
          onClick={() =>
            tienePermisos(
              funcionalidades.proyectada,
              acciones.manual,
              authContext.permisos,
              () => setShowModalNuevaProyectada(true)
            )
          }
        >
          Alta Manual
        </Button>
      </Grid.Item>
      <Grid.Item className="mb-24">
        <Button
          variant="primary"
          size="small"
          onClick={() =>
            tienePermisos(
              funcionalidades.proyectada,
              acciones.export,
              authContext.permisos,
              () => getExportBcra(setLoading)
            )
          }
        >
          Exportar BCRA
        </Button>
      </Grid.Item>
      <Grid.Item className="mb-24">
        <Button
          variant="primary"
          size="small"
          onClick={() => {
            setLoading(true)
            getProyectadasVsOpcam(filtroProyectada.fechaProyectada)
              .then((result) => {
                setLoading(false)
                arrayProyectadaToCSV(result, filtroProyectada.fechaProyectada)
              })
              .catch(() => {
                setLoading(false);
              });
          }}
        >
          Exportar
        </Button>
      </Grid.Item>
    </Grid>
  );

  const filtros = (
    <>
      {botonNuevaProyectada}
      <FilterContainer>
        <Grid className=" h-100 d-flex mt-32">
          {/* CUIT/CUIL */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="CUIT"
              value={filtroProyectada.cuit}
              onChange={(e: any) => {
                handleChange(e.target.value, 'cuit');
              }}
            />
          </Grid.Item>
          {/* Monto */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Monto"
              value={filtroProyectada.monto}
              inputType="currency"
              onChange={(e: any) => {
                handleChange(e.target.value, 'monto');
              }}
              thousandDelimiter="."
              decimalDelimiter=","
            />
          </Grid.Item>
          {/* Nro RAyPE */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Nro. RAyPE"
              value={filtroProyectada.raype}
              onChange={(e: any) => {
                handleChange(e.target.value, 'raype');
              }}
            />
          </Grid.Item>
          {/* Código de Concepto */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={items}
              initialValue={initialValue}
              handlerBlur={(e: any) => handleChange(e.value, 'codigoConcepto')}
              label="Concepto"
            />
          </Grid.Item>
          {/* Fecha de Creacion */}
          <Grid.Item sm={3} className="mb-24">
            <DatePicker
              clear={filtroProyectada.fechaCreacion === ''}
              variant="inline"
              label="Fecha de Creación"
              placeholder="Fecha de Creación"
              value={filtroProyectada.fechaCreacion}
              zIndexDpPopper={2}
              selectYears
              onChangeStartDate={(e: any) => {
                handleChange(e, 'fechaCreacion');
              }}
              dateFormat="dd/MM/yyyy"
              divider
            />
          </Grid.Item>
          {/* Fecha de Proyección */}
          <Grid.Item sm={3} className="mb-24">
            <DatePicker
              clear={filtroProyectada.fechaProyectada === ''}
              variant="inline"
              label="Fecha de Proyección"
              placeholder="Fecha de Proyección"
              value={filtroProyectada.fechaProyectada}
              zIndexDatepicker={3}
              selectYears
              onChangeStartDate={(e: any) => {
                handleChange(e, 'fechaProyectada');
              }}
              dateFormat="dd/MM/yyyy"
              divider
            />
          </Grid.Item>
          {/* Legajo Ultima Modificacion */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Legajo Ult. Modificación"
              value={filtroProyectada.legajoUltimaModificacion}
              onChange={(e: any) => {
                handleChange(e.target.value, 'legajoUltimaModificacion');
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
          className="h-100 d-flex mt-32"
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
    ? 'Todavía no se cargó ninguna proyectada en el día de hoy.'
    : 'No se encontraron resultados que coincidan con los filtros de búsqueda.';

  return (
    <>
      {filtros}

      <div className="d-flex justify-content-center mx-4 my-20">
        {loading ? (
          <LoadingGalicia />
        ) : (
          <ProyectadasTable
            proyectadas={proyectadasList}
            refreshTable={sendFilters}
            toastCall={toastCallAux}
            mensajeTablaVacia={busquedaTernarioIndependiente}
          />
        )}
      </div>

      <NuevaProyectadaModal
        isModalActive={showModalNuevaProyectada}
        closeModal={() => setShowModalNuevaProyectada(false)}
        isEdition={false}
        genericFunc={nuevaProyectada}
        refreshTable={sendFilters}
        toastCall={toastCallAux}
      />

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