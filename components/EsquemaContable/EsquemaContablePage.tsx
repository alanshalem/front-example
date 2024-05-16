import { Button, Grid, SelectInput, TextInput } from '@brick/core';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import OverviewContext from '@contexts/Overview';
import {
  buildAplicacionInitialValueFilter,
  buildEventosContablesInitialValueFilter,
  getAllEsquemasContables,
  itemsAplicacion,
  prepareFilter,
  transformarEventosContables,
  verificarFiltroEsquema,
} from '@lib/helpers/EsquemaContable.helpers';
import {
  buildMonedasInitialValueFilter,
  buildMonedasList,
} from '@lib/helpers/Monedas.helpers';
import { EsquemaContableAuxiliar } from '@lib/types/EsquemaContable/EsquemaContable.types';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { FilterContainer } from 'styles/CommonStyles';
import EsquemaContableTable from './EsquemaContableTable';
import { Moneda } from '@lib/types/COMEX/Monedas.types';

const EsquemaContablePage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [esquemasContablesList, setEsquemasContablesList] = useState<any[]>([]);
  const [busquedaDelDia, setBusquedaDelDia] = useState<boolean>(true);
  const [eventosContablesFiltro, setEventosContablesFiltro] = useState<any[]>(
    []
  );
  const { eventosContables, monedas } = useContext(OverviewContext);

  const initialState: EsquemaContableAuxiliar = {
    aplicacion: '',
    idEventoContable: '',
    rubro: '',
    centroCosto: '',
    divisa: '',
  };
  const [initialValue, setInitialValue] = useState<any>({});
  const [refresh, setRefresh] = useState<boolean>(false);

  const [filtroEsquemaContable, setFiltroEsquemaContable] = useState<
    EsquemaContableAuxiliar
  >(initialState);

  const divisasMemo = useMemo(() => {
    return buildMonedasList(monedas);
  }, [monedas]);

  const sendFilters = () => {
    setLoading(true);
    if (verificarFiltroEsquema(filtroEsquemaContable)) {
      getAllEsquemasContables(setEsquemasContablesList, setLoading);
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

  useEffect(() => {
    if (eventosContables) {
      setEventosContablesFiltro(transformarEventosContables(eventosContables));
    }
  }, []);

  useEffect(() => {
    getAllEsquemasContables(setEsquemasContablesList, setLoading);
  }, []);

  useEffect(() => {
    if (refresh) {
      getAllEsquemasContables(setEsquemasContablesList, setLoading);
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    if (filtroEsquemaContable.aplicacion === '') {
      setInitialValue(
        buildAplicacionInitialValueFilter(
          itemsAplicacion.find(
            (e: any) => filtroEsquemaContable.aplicacion === e.text
          )
        )
      );
    }
  }, [filtroEsquemaContable.aplicacion]);

  useEffect(() => {
    if (filtroEsquemaContable.divisa === '') {
      setInitialValue(
        buildMonedasInitialValueFilter(
          monedas?.find((e: Moneda) => filtroEsquemaContable.divisa === e.iso)
        )
      );
    }
  }, [filtroEsquemaContable.divisa, monedas]);

  useEffect(() => {
    if (filtroEsquemaContable.idEventoContable === '') {
      setInitialValue(
        buildEventosContablesInitialValueFilter(
          eventosContables?.find(
            (e: any) => filtroEsquemaContable.idEventoContable === e.text
          )
        )
      );
    }
  }, [filtroEsquemaContable.idEventoContable, eventosContables]);

  const handleChange = (value: string, field: string) => {
    setFiltroEsquemaContable(() => ({
      ...filtroEsquemaContable,
      [field]: value,
    }));
  };

  const cleanFilter = (event: any) => {
    event.preventDefault();
    setFiltroEsquemaContable(initialState);
    setRefresh(true);
  };

  const filtros = (
    <>
      <FilterContainer>
        <Grid className="h-100 d-flex mt-40">
          {/* APLICACION */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={itemsAplicacion}
              initialValue={initialValue}
              handlerBlur={(e: any) => handleChange(e.value, 'aplicacion')}
              label="Aplicación"
            />
          </Grid.Item>
          {/* GRUPO */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              initialValue={initialValue}
              items={eventosContablesFiltro}
              handlerBlur={(e: any) =>
                handleChange(e.value, 'idEventoContable')
              }
              label="Evento Contable"
            />
          </Grid.Item>
          {/* RUBRO */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Rubro"
              value={filtroEsquemaContable.rubro}
              onChange={(e: any) => {
                handleChange(e.target.value, 'rubro');
              }}
            />
          </Grid.Item>
          {/* CENTRO DE COSTO */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Centro de Costo"
              value={filtroEsquemaContable.centroCosto}
              onChange={(e: any) => {
                handleChange(e.target.value, 'centroCosto');
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
    ? 'No existe ningun esquema contable.'
    : 'No se encontraron resultados que coincidan con los filtros de búsqueda.';

  return (
    <>
      {filtros}
      <div className="d-flex justify-content-center mx-4 my-20">
        {loading ? (
          <LoadingGalicia />
        ) : (
          <EsquemaContableTable
            esquema={esquemasContablesList}
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

export default EsquemaContablePage;
