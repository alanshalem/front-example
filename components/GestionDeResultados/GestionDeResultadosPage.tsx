import React, { useContext, useState, useEffect } from 'react';
import { Button, DatePicker, Grid, SelectInput } from '@brick/core';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import OverviewContext from '@contexts/Overview';
import { FilterContainer } from 'styles/CommonStyles';
import { Moneda } from '@lib/types/COMEX/Monedas.types';
import {
  initialStateFilters,
  prepareFilterGestionDeResultados,
  verificarPeriodoGestionDeResultados,
} from '@lib/helpers/GestionDeResultados.helpers';
import {
  buildMonedasInitialValueFilter,
  buildMonedasList,
} from '@lib/helpers/Monedas.helpers';
import {
  buildEstadosPrevisionesInitialValueFilter,
  estadosPrevisiones,
} from '@lib/helpers/Previsiones.helpers';
import { Toaster } from 'react-hot-toast';
import GestionDeResultadosTable from './GestionDeResultadosTable';
import { buildTiposAnaliticoPrevisiones } from '@lib/helpers/TiposAnalitico.helpers';
import { GestionDeResultadosFiltersAuxiliar } from '@lib/types/GestionDeResultados/GestionDeResultados.types';
import { buildTiposDeResultadosList } from '@lib/helpers/TiposDeResultados.helpers';

const GestionDeResultadosPage = () => {
  const estadosContext = useContext(OverviewContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialValue, setInitialValue] = React.useState<any>({});
  const [filtroGestionDeResultados, setFiltroGestionDeResultados] = useState<
    GestionDeResultadosFiltersAuxiliar
  >(initialStateFilters);
  const [gestionDeResultadosList, setGestionDeResultadosList] = useState<any[]>(
    []
  );
  const [refresh, setRefresh] = useState<boolean>(true);
  const [periodo, setPeriodo] = useState<string>('');

  const divisasMemo = React.useMemo(() => {
    return buildMonedasList(estadosContext.monedas);
  }, [estadosContext.monedas]);

  const tiposDeResultadosMemo = React.useMemo(() => {
    return buildTiposDeResultadosList(estadosContext.tiposDeResultados);
  }, [estadosContext.tiposDeResultados]);

  const tiposAnaliticoPrevisionesMemo = React.useMemo(() => {
    return buildTiposAnaliticoPrevisiones(
      estadosContext.tiposAnaliticoPrevisiones
    );
  }, [estadosContext.tiposAnaliticoPrevisiones]);

  const handleChange = (value: string, field: string) => {
    if (field === 'periodo') {
      verificarPeriodoGestionDeResultados(
        value,
        field,
        setFiltroGestionDeResultados,
        filtroGestionDeResultados
      );
    } else {
      setFiltroGestionDeResultados(() => ({
        ...filtroGestionDeResultados,
        [field]: value,
      }));
    }
  };

  const cleanFilter = (event: any) => {
    event.preventDefault();
    setFiltroGestionDeResultados(initialStateFilters);
    setRefresh(true);
  };

  const sendFilters = () => {
    setLoading(true);
    prepareFilterGestionDeResultados(
      filtroGestionDeResultados,
      setGestionDeResultadosList,
      setLoading,
      setPeriodo
    );
  };

  const obtenerAñoActual = () => {
    let d = new Date();
    let n = d.getFullYear();
    return n;
  };

  const obtenerAñoProximo = () => {
    let d = new Date();
    let n = d.getFullYear();
    return n - 1;
  };

  useEffect(() => {
    if (filtroGestionDeResultados.divisa === '') {
      setInitialValue(
        buildMonedasInitialValueFilter(
          estadosContext.monedas?.find(
            (e: Moneda) => filtroGestionDeResultados.divisa === e.iso
          )
        )
      );
    }
  }, [filtroGestionDeResultados.divisa, estadosContext.monedas]);

  useEffect(() => {
    if (filtroGestionDeResultados.estado === '') {
      setInitialValue(
        buildEstadosPrevisionesInitialValueFilter(
          estadosPrevisiones.find(
            (e: any) => filtroGestionDeResultados.estado === e.text
          )
        )
      );
    }
  }, [filtroGestionDeResultados.estado]);

  useEffect(() => {
    if (refresh) {
      sendFilters();
      setRefresh(false);
    }
  }, [refresh]);

  const filtros = (
    <>
      <FilterContainer>
        <Grid className="h-100 d-flex mt-40">
          {/* PERIODO */}
          <Grid.Item sm={3} className="mb-24">
            <DatePicker
              variant="inline"
              label="Periodo"
              placeholder="Seleccionar Periodo."
              onlyMonths
              dateFormat="yyyy/MM"
              value={filtroGestionDeResultados.periodo}
              selectYears
              onChangeStartDate={(e: any) => {
                handleChange(e, 'periodo');
              }}
              divider
              rangeStartYear={obtenerAñoActual}
              rangeEndYear={obtenerAñoProximo}
              zIndexDpPopper={2}
              popperPlacement="bottom-end"
            />
          </Grid.Item>
          {/* Tipo de Resultados */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={tiposDeResultadosMemo}
              initialValue={initialValue}
              handlerBlur={(e: any) => handleChange(e.value, 'tipoResultado')}
              label="Tipo de Resultado"
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
          {/* Estado */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={estadosPrevisiones}
              initialValue={initialValue}
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
          {/*<Grid.Item>
            <Button variant="primary" size="small" onClick={() => {}}>
              Descargar
            </Button>
            </Grid.Item>*/}
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
          <GestionDeResultadosTable
            previsiones={gestionDeResultadosList}
            setGestionDeResultadosList={setGestionDeResultadosList}
            setLoading={setLoading}
            periodo={periodo}
            tiposAnaliticoPrevisionesMemo={tiposAnaliticoPrevisionesMemo}
            setRefresh={setRefresh}
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
            padding: '4px',
            margin: '4px',
          },
        }}
      />
    </>
  );
};

export default GestionDeResultadosPage;
