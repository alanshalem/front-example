/* eslint-disable react-hooks/exhaustive-deps */
import { Button, DatePicker, Grid, TextInput } from '@brick/core';
import {
  getBoletoSimi,
  nuevoBoletoSimi,
} from '@lib/services/BoletoSimi/Boletosimi.services';
import {
  cleanFilter,
  prepareFilter,
  verificarFiltro,
} from '@lib/helpers/BoletoSimi.helpers';
import { funcionalidades, acciones } from '../../config/ConfigurationService';
import React, { useContext, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { LoadingGalicia } from '../LoadingGalicia/LoadingGalicia';
import { FilterContainer } from 'styles/CommonStyles';
import { BoletoSimiTable } from './BoletoSimiTable';
import { NuevoBoletoSimiModal } from './NuevoBoletoSimiModal';
import { BoletoSimi } from '@lib/types/BoletoSimi/BoletoSimi.types';
import AuthContext from '@contexts/Auth/AuthContext';
import { tienePermisos } from '@lib/helpers/Auth.helpers';
import { toastCallAux } from '@components/Toast/Toast.helpers';

export const BusquedaSimi = (): JSX.Element => {
  const initialState: BoletoSimi = {
    fechaExportacion: '',
    fechaCreacion: '',
    nroSimi: '',
    nroBoleto: '',
    ccuce: '',
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [showModalNuevoSimi, setShowModalNuevoSimi] = useState<boolean>(false);
  const [boletosSimiList, setBoletosSimiList] = useState<BoletoSimi[]>([]);
  // STATES DE FILTROS
  const [filtroSimi, setFiltroSimi] = useState<BoletoSimi>(initialState);
  const [nroCcuceError, setNroCcuceError] = useState(false);
  const [nroCcuceErrorMessage, setNroCcuceErrorMessage] = useState('');

  const authContext = useContext(AuthContext);

  const handleChange = (value: string, field: string) => {
    setFiltroSimi(() => ({ ...filtroSimi, [field]: value }));
  };

  const handleNroCcuceChange = (value: string) => {
    handleChange(value, 'ccuce');

    if (value.length === 0) {
      setNroCcuceError(false);
      setNroCcuceErrorMessage('');
      return;
    }

    const isNumeric = /^\d+$/.test(value);
    const isValidLength = value.length <= 36;

    if (isNumeric && isValidLength) {
      setNroCcuceError(false);
      setNroCcuceErrorMessage('');
    } else {
      setNroCcuceError(true);
      setNroCcuceErrorMessage('Ingrese hasta 36 dígitos numéricos.');
    }
  };

  const sendFilters = () => {
    // Si los campos de los filtros estan vacios hago un getAll
    if (verificarFiltro(filtroSimi)) {
      setLoading(true);
      getAllBoletoSimis();
    }
    // Sino hago un getByFilter
    else {
      setLoading(true);
      prepareFilter(filtroSimi, setBoletosSimiList, setLoading);
    }
  };

  // TRAIGO TODAS LAS PROYECTADAS
  const getAllBoletoSimis = () => {
    getBoletoSimi()
      .then((result: any) => {
        setBoletosSimiList(result);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    setLoading(true);
    getAllBoletoSimis();
  }, []);

  const botonNuevaProyectada = (
    <Grid>
      <Grid.Item sm={2} className="mb-24">
        <Button
          variant="primary"
          onClick={() =>
            tienePermisos(
              funcionalidades.simi,
              acciones.manual,
              authContext.permisos,
              () => setShowModalNuevoSimi(true)
            )
          }
        >
          Nuevo Boleto
        </Button>
      </Grid.Item>
    </Grid>
  );
  const filtros: JSX.Element = (
    <>
      {botonNuevaProyectada}
      <FilterContainer>
        <Grid className="h-100 d-flex mt-40">
          {/* NRO BOLETO */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Número de Boleto"
              value={filtroSimi.nroBoleto}
              onChange={(e: any) => {
                handleChange(e.target.value, 'nroBoleto');
              }}
            />
          </Grid.Item>
          {/* NRO SIMI */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Número de SIRA"
              value={filtroSimi.nroSimi}
              onChange={(e: any) => {
                handleChange(e.target.value, 'nroSimi');
              }}
            />
          </Grid.Item>
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Número de Ccuce"
              value={filtroSimi.ccuce}
              error={nroCcuceError}
              message={nroCcuceErrorMessage}
              onChange={(e: any) => handleNroCcuceChange(e.target.value)}
            />
          </Grid.Item>
          {/* Fecha de Creación */}
          <Grid.Item sm={3} className="mb-24">
            <DatePicker
              clear={filtroSimi.fechaCreacion === ''}
              variant="inline"
              label="Fecha de Creación"
              placeholder="Fecha de Creación"
              value={filtroSimi.fechaCreacion}
              selectYears
              onChangeStartDate={(e: any) => {
                handleChange(e, 'fechaCreacion');
              }}
              dateFormat="dd/MM/yyyy"
              divider
              popperPlacement="bottom-end"
            />
          </Grid.Item>
          {/* Fecha de Exportación */}
          <Grid.Item sm={3} className="mb-24">
            <DatePicker
              clear={filtroSimi.fechaExportacion === ''}
              variant="inline"
              label="Fecha de Exportación"
              placeholder="Fecha de Exportación"
              value={filtroSimi.fechaExportacion}
              selectYears
              onChangeStartDate={(e: any) => {
                handleChange(e, 'fechaExportacion');
              }}
              dateFormat="dd/MM/yyyy"
              divider
              popperPlacement="bottom-end"
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
              onClick={(e: any) => cleanFilter(e, setFiltroSimi, initialState)}
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

  return (
    <>
      {filtros}

      <div className="d-flex justify-content-center mx-4 my-20">
        {loading ? (
          <LoadingGalicia />
        ) : (
          <BoletoSimiTable
            boletosSimi={boletosSimiList}
            refreshTable={sendFilters}
            toastCall={toastCallAux}
          />
        )}
      </div>

      <NuevoBoletoSimiModal
        isModalActive={showModalNuevoSimi}
        closeModal={() => setShowModalNuevoSimi(false)}
        isEdition={false}
        genericFunc={nuevoBoletoSimi}
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
