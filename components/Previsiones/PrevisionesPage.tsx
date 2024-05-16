import { Button, DatePicker, Grid, SelectInput } from '@brick/core';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import OverviewContext from '@contexts/Overview';
import {
  buildEstadosPrevisionesInitialValueFilter,
  estadosPrevisiones,
  initialStateFilters,
  prepareFilter,
  verificarPeriodo,
} from '@lib/helpers/Previsiones.helpers';
import {
  PrevisionFiltersAuxiliar,
  PrevisionResponse,
} from '@lib/types/Previsiones/Previsiones.types';
import React, { useContext, useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { FilterContainer } from 'styles/CommonStyles';
import PrevisionesTable from './PrevisionesTable';
import {
  buildMonedasInitialValueFilter,
  buildMonedasList,
} from '@lib/helpers/Monedas.helpers';
import {
  buildCorresponsalInitialValueFilter,
  buildCorresponsalList,
} from '@lib/helpers/Corresponsal.helpers';
import { Moneda } from '@lib/types/COMEX/Monedas.types';
import { Corresponsal } from '@lib/types/Corresponsal/Corresponsa.types';
import { tienePermisos } from '@lib/helpers/Auth.helpers';
import { funcionalidades, acciones } from '../../config/ConfigurationService';
import AuthContext from '@contexts/Auth/AuthContext';
import { buildTiposAnaliticoPrevisiones } from '@lib/helpers/TiposAnalitico.helpers';

const PrevisionesPage = () => {
  const estadosContext = useContext(OverviewContext);
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialValue, setInitialValue] = React.useState<any>({});
  const [filtroPrevisiones, setFiltroPrevisiones] = useState<
    PrevisionFiltersAuxiliar
  >(initialStateFilters);
  const [previsionesList, setPrevisionesList] = useState<PrevisionResponse[]>(
    []
  );
  const [periodo, setPeriodo] = useState<string>('');
  const [refresh, setRefresh] = useState<boolean>(true);
  
  const handleChange = (value: string, field: string) => {
    if (field === 'periodo') {
      verificarPeriodo(value, field, setFiltroPrevisiones, filtroPrevisiones);
    } else {
      setFiltroPrevisiones(() => ({ ...filtroPrevisiones, [field]: value }));
    }
  };

  const tiposAnaliticoPrevisionesMemo = React.useMemo(() => {
    return buildTiposAnaliticoPrevisiones(estadosContext.tiposAnaliticoPrevisiones)
  }, [estadosContext.tiposAnaliticoPrevisiones]);


  const divisasMemo = React.useMemo(() => {
    return buildMonedasList(estadosContext.monedas);
  }, [estadosContext.monedas]);

  const corresponsalMemo = React.useMemo(() => {
    return buildCorresponsalList(estadosContext.tiposCorresponsal);
  }, [estadosContext.tiposCorresponsal]);

  const cleanFilter = (event: any) => {
    event.preventDefault();
    setFiltroPrevisiones(initialStateFilters);
    setRefresh(true);
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

  const sendFilters = () => {
   tienePermisos(
    funcionalidades.prevision,
    acciones.read,
    authContext.permisos,
    async () => {
      setLoading(true);
      prepareFilter(
        filtroPrevisiones,
        setPrevisionesList,
        setLoading,
        setPeriodo
      );
    }
   );
  };

  useEffect(() => {
    if (refresh) {
      sendFilters();
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    if (filtroPrevisiones.divisa === '') {
      setInitialValue(
        buildMonedasInitialValueFilter(
          estadosContext.monedas?.find(
            (e: Moneda) => filtroPrevisiones.divisa === e.iso
          )
        )
      );
    }
  }, [filtroPrevisiones.divisa, estadosContext.monedas]);

  useEffect(() => {
    if (filtroPrevisiones.corresponsal === '') {
      setInitialValue(
        buildCorresponsalInitialValueFilter(
          estadosContext.tiposCorresponsal?.find(
            (e: Corresponsal) => filtroPrevisiones.corresponsal === e.id
          )
        )
      );
    }
  }, [filtroPrevisiones.corresponsal, estadosContext.tiposCorresponsal]);

  useEffect(() => {
    if (filtroPrevisiones.estado === '') {
      setInitialValue(
        buildEstadosPrevisionesInitialValueFilter(
          estadosPrevisiones.find(
            (e: any) => filtroPrevisiones.estado === e.text
          )
        )
      );
    }
  }, [filtroPrevisiones.estado]);

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
              value={filtroPrevisiones.periodo}
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
          {/* CORRESPONSAL */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={corresponsalMemo}
              initialValue={initialValue}
              handlerBlur={(e: any) => handleChange(e.value, 'corresponsal')}
              label="Corresponsal"
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
          <Grid.Item>
            <Button variant="primary" size="small" onClick={() => {}}>
              Descargar
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
          <PrevisionesTable
            previsiones={previsionesList}
            setPrevisionesList={setPrevisionesList}
            setLoading={setLoading}
            periodo={periodo}
            setRefresh={setRefresh}
            tiposAnaliticoPrevisionesMemo={tiposAnaliticoPrevisionesMemo}
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

export default PrevisionesPage;