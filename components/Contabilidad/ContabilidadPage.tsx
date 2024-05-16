/* eslint-disable react-hooks/exhaustive-deps */
import { Button, DatePicker, Grid, TextInput } from '@brick/core';
import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { LoadingGalicia } from '../LoadingGalicia/LoadingGalicia';
import { ContabilidadTable } from './ContabilidadTable';
import { Contabilidad } from '@lib/types/Contabilidad/Contabilidad.types';
import { FilterContainer } from '@components/Proyectadas/BusquedaProyectadas.style';
import {
  getAllContabilidades,
  prepareFilter,
  verificarFiltroCruces,
} from '@lib/helpers/Contabilidad.helpers';

export type ContabilidadAuxiliar = {
  numOp1: string;
  codcta: string;
  origen: string;
  debe: string;
  haber: string;
  legajoUltimaModificacion: string;
  legajoCreacion: string;
  numOp2: string;
  fechaCreacion: string;
  fechaModificacion: string;
};

export const ContabilidadPage = () => {

  const initialState: ContabilidadAuxiliar = {
    numOp1: '',
    codcta: '',
    origen: '',
    legajoUltimaModificacion: '',
    legajoCreacion: '',
    debe: '',
    haber: '',
    numOp2: '',
    fechaCreacion: '',
    fechaModificacion: '',
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [busquedaDelDia, setBusquedaDelDia] = useState<boolean>(true);
  const [crucesList, setCrucesList] = useState<Contabilidad[]>([]);

  const [filtroContabilidad, setFiltroContabilidad] = useState<
    ContabilidadAuxiliar
  >(initialState);
  const [refresh, setRefresh] = useState<boolean>(false);

  const sendFilters = () => {
    setLoading(true);
    if (verificarFiltroCruces(filtroContabilidad)) {
      getAllContabilidades(setCrucesList, setLoading);
      setBusquedaDelDia(true);
    } else {
      prepareFilter(filtroContabilidad, setCrucesList, setLoading);
      setBusquedaDelDia(false);
    }
  };

  const handleChange = (value: string, field: string) => {
    setFiltroContabilidad(() => ({ ...filtroContabilidad, [field]: value }));
  };

  const cleanFilter = (event: any) => {
    event.preventDefault();
    setFiltroContabilidad(initialState);
    setRefresh(true);
  };

  useEffect(() => {
    setLoading(true);
    getAllContabilidades(setCrucesList, setLoading);
  }, []);

  useEffect(() => {
    if ( refresh ) {
      setLoading(true);
      getAllContabilidades(setCrucesList, setLoading);
      setRefresh(false);
    }
  }, [refresh]);

  const filtros = (
    <>
      <FilterContainer>
        <Grid
          className='h-100 d-flex mt-40'
        >
          {/* NRO OPERACION */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Nro. Operación"
              value={filtroContabilidad.numOp1}
              onChange={(e: any) => {
                handleChange(e.target.value, 'numOp1');
              }}
            />
          </Grid.Item>
          {/* Num operacion 2 */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Nro. Operación 2"
              value={filtroContabilidad.numOp2}
              onChange={(e: any) => {
                handleChange(e.target.value, 'numOp2');
              }}
              thousandDelimiter="."
              decimalDelimiter=","
            />
          </Grid.Item>
          {/* Corresponsal */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Corresponsal"
              value={filtroContabilidad.codcta}
              onChange={(e: any) => {
                handleChange(e.target.value, 'codcta');
              }}
              thousandDelimiter="."
              decimalDelimiter=","
            />
          </Grid.Item>
          <Grid.Item sm={3} className="mb-24">
            <DatePicker
              label="Fecha de Creación"
              variant="inline"
              placeholder="Fecha de Creación"
              value={filtroContabilidad.fechaCreacion}
              zIndexDpPopper={2}
              selectYears
              onChangeStartDate={(e: any) => {
                handleChange(e, 'fechaCreacion');
              }}
              dateFormat="dd/MM/yyyy"
              divider
            />
          </Grid.Item>
          {/* Fecha de Modificación */}
          <Grid.Item sm={3} className="mb-24">
            <DatePicker
              label="Fecha de Modificación"
              variant="inline"
              placeholder="Fecha de Modificación"
              value={filtroContabilidad.fechaModificacion}
              zIndexDatepicker={3}
              selectYears
              onChangeStartDate={(e: any) => {
                handleChange(e, 'fechaModificacion');
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
              value={filtroContabilidad.legajoUltimaModificacion}
              onChange={(e: any) => {
                handleChange(e.target.value, 'legajoUltimaModificacion');
              }}
            />
          </Grid.Item>
          {/* Legajo Creacion */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Legajo Creación"
              value={filtroContabilidad.legajoCreacion}
              onChange={(e: any) => {
                handleChange(e.target.value, 'legajoCreacion');
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
          className='h-100 d-flex'
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
          <ContabilidadTable
            cruces={crucesList}
            refreshTable={sendFilters}
            mensajeTablaVacia={busquedaTernarioIndependiente}
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
    </>
  );
};
