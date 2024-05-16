import React, { useContext, useState, useEffect } from 'react';
import { Button, DatePicker, Grid, SelectInput, TextInput } from '@brick/core';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import OverviewContext from '@contexts/Overview';
import { buildEstadosGastosRebatesInitialValueFilter, buildTipoAnaliticoGastosRebatesInitialValueFilter, estadosGastosRebates, initialStateFilters, prepareFilter } from '@lib/helpers/GastosRebates.helpers';
import { GastoRebateResponse, GastosRebatesFilterAuxiliar, RowGastoCalendarizado } from '@lib/types/GastosRebates/GastosRebates.types';
import { FilterContainer } from 'styles/CommonStyles';
import GastosRebatesTable from './GastosRebatesTable';
import { NuevoGastoRebatesModal } from './NuevoGastosRebatesModal';
import { buildCorresponsalDivisaInitialValueFilter,buildCorresponsalDivisaList } from '@lib/helpers/Corresponsal.helpers';
import { Corresponsal } from '@lib/types/Corresponsal/Corresponsa.types';
import { AvanzarCalendarizaModal } from './AvanzarCalendarizadaModal';
import { buildTiposAnaliticoGastoRebatelList } from '@lib/helpers/TiposAnalitico.helpers';
import { Toaster } from 'react-hot-toast';
import { tienePermisos } from '@lib/helpers/Auth.helpers'
import { funcionalidades, acciones } from '../../config/ConfigurationService';
import AuthContext from '@contexts/Auth/AuthContext';


const GastosRebatesPage = () => {
  const estadosContext = useContext(OverviewContext);
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialValue, setInitialValue] = React.useState<any>({});
  const [filtroGastosRebates, setFiltroGastosRebates] = useState<
    GastosRebatesFilterAuxiliar
  >(initialStateFilters);
  const [gastosRebatesList, setGastosRebatesList] = useState<GastoRebateResponse[]>([]);
  const [nuevoGastosRebatesModal, setNuevoGastoRebatesModal] = useState<
    boolean
  >(false);
  const [avanzarCalendarizadaModal, setAvanzarCalendarizaModal] = useState<
    boolean
  >(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [gastosRebatesParaCalendarizar, setGastoParaCalendarizar] = useState<RowGastoCalendarizado[]>([]);
  
  const corresponsalDivisaMemo = React.useMemo(() => {
    return buildCorresponsalDivisaList(estadosContext.tiposCorresponsal);
  }, [estadosContext.tiposCorresponsal]);

  const tiposAnaliticoGastoRebateMemo = React.useMemo(() => {
    return buildTiposAnaliticoGastoRebatelList(estadosContext.tiposAnaliticoGastoRebate)
  }, [estadosContext.tiposAnaliticoGastoRebate]);

  const handleChange = (value: string, field: string) => {
    setFiltroGastosRebates(() => ({ ...filtroGastosRebates, [field]: value }));
  };
  const cleanFilter = (event: any) => {
    event.preventDefault();
    setFiltroGastosRebates(initialStateFilters);
    setRefresh(true)
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
      funcionalidades.gastosRebates,
      acciones.read,
      authContext.permisos,
      async () => {
        setLoading(true);    
        prepareFilter(filtroGastosRebates, setGastosRebatesList, setLoading, corresponsalDivisaMemo);
      }
    );
  };
  
  useEffect(() => {
    setLoading(true);
    prepareFilter(filtroGastosRebates, setGastosRebatesList, setLoading, corresponsalDivisaMemo);
  }, []);

  useEffect(() => {
    if (refresh) {
      setLoading(true);
      prepareFilter(filtroGastosRebates, setGastosRebatesList, setLoading, corresponsalDivisaMemo);
      setRefresh(false);
    }
  }, [refresh])

  useEffect(() => {
    if (filtroGastosRebates.idEstado === '') {
      setInitialValue(
        buildEstadosGastosRebatesInitialValueFilter(
          estadosGastosRebates.find(
            (e: any) => filtroGastosRebates.idEstado === e.value
          )
        )
      );
    }
  }, [filtroGastosRebates.idEstado, estadosGastosRebates]);

  useEffect(() => {
    if (filtroGastosRebates.idTipoAnalitico === '') {
      setInitialValue(
        buildTipoAnaliticoGastosRebatesInitialValueFilter(
          tiposAnaliticoGastoRebateMemo.find((e: any) => filtroGastosRebates.idTipoAnalitico === e.value)
        )
      );
    }
  }, [filtroGastosRebates.idTipoAnalitico, estadosContext.tiposAnaliticoGastoRebate]);

  useEffect(() => {
    if (filtroGastosRebates.idCorresponsal === '') {
      setInitialValue(
        buildCorresponsalDivisaInitialValueFilter(
          estadosContext.tiposCorresponsal?.find(
            (e: Corresponsal) => filtroGastosRebates.idCorresponsal === e.corresponsalDivisa
          )
        )
      );
    }
  }, [filtroGastosRebates.idCorresponsal, estadosContext.tiposCorresponsal]);

  const botonNuevo = (
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
          onClick={() => setNuevoGastoRebatesModal(!nuevoGastosRebatesModal)}
        >
          Nuevo
        </Button>
      </Grid.Item>
    </Grid>
  );

  const filtros = (
    <>
      {botonNuevo}
      <FilterContainer>
        <Grid className="h-100 d-flex mt-40">
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={tiposAnaliticoGastoRebateMemo}
              handlerBlur={(e: any) => handleChange(e.value, 'idTipoAnalitico')}
              label="Tipo"
              initialValue={initialValue}
            />
          </Grid.Item>
          <Grid.Item sm={3} claassName="mb-24">
            <SelectInput
              variant="inline"
              items={corresponsalDivisaMemo}
              initialValue={initialValue}
              label="Corresponsal Divisa"
              handlerBlur={(e: any) => handleChange(e.value, 'idCorresponsal')}
            />
          </Grid.Item>
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={estadosGastosRebates}
              initialValue={initialValue}
              label="Estado"
              handlerBlur={(e: any) => handleChange(e.value, 'idEstado')}
            />
          </Grid.Item>
          <Grid.Item sm={3} className="mb-24">
            <DatePicker
              variant="inline"
              label="Periodo"
              placeholder="Seleccionar Periodo."
              onlyMonths
              dateFormat="yyyy/MM"
              value={filtroGastosRebates.periodo}
              selectYears
              onChangeStartDate={(e: any) => handleChange(e, 'periodo')}
              divider
              rangeStartYear={obtenerAñoActual}
              rangeEndYear={obtenerAñoProximo}
              zIndexDpPopper={2}
              popperPlacement="bottom-end"
            />
          </Grid.Item>
          <Grid.Item sm={3} className="mb-24">
            <DatePicker
              label="Fecha Calendarizada"
              variant="inline"
              placeholder="Fecha Calendarizada"
              value={filtroGastosRebates.fechaCalendarizada}
              zIndexDpPopper={11}
              zIndexDpNav={11}
              zIndexDatepicker={11}
              selectYears
              onChangeStartDate={(e: any) => handleChange(e, 'fechaCalendarizada')}
              dateFormat="dd/MM/yyyy"
              divider
            />
          </Grid.Item>
          <Grid.Item sm={3} className="mb-24">
            <DatePicker
              label="Fecha Ultima Modificacion"
              variant="inline"
              placeholder="Fecha Ultima Modificacion"
              value={filtroGastosRebates.fechaUltimaModificacion}
              zIndexDpPopper={10}
              zIndexDpNav={10}
              zIndexDatepicker={10}
              selectYears
              onChangeStartDate={(e: any) => handleChange(e, 'fechaUltimaModificacion')}
              dateFormat="dd/MM/yyyy"
              divider
            />
          </Grid.Item>
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              label="Nro de Referencia"
              value={filtroGastosRebates.referenciaExterna}
              variant="inline"
              placeholder="Nro de Referencia"
              onChange={(e: any) => handleChange(e.target.value, 'referenciaExterna')}
              maxLength={30}
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
  
  return (
    <>
      {filtros}
      <div className="d-flex justify-content-center mx-4 my-20">
        {loading ? (
          <LoadingGalicia />
        ) : (
          <>
            <GastosRebatesTable
              gastosRebates={gastosRebatesList}
              setLoading={setLoading}
              setAvanzarCalendarizaModal={setAvanzarCalendarizaModal}
              setGastoParaCalendarizar={setGastoParaCalendarizar}
              gastoParaCalendarizar={gastosRebatesParaCalendarizar}
              setRefresh={setRefresh}
            />
            <div className="d-flex justify-content-center mx-4 my-20">
              <>
                <NuevoGastoRebatesModal
                  isModalActive={nuevoGastosRebatesModal}
                  closeModal={() => setNuevoGastoRebatesModal(false)}
                  setLoading={setLoading}
                  setRefresh={setRefresh}
                />
                <AvanzarCalendarizaModal
                  isModalActive={avanzarCalendarizadaModal}
                  closeModal={() => setAvanzarCalendarizaModal(false)}
                  gastosRebatesParaCalendarizar={gastosRebatesParaCalendarizar}
                  setLoading={setLoading}
                  setRefresh={setRefresh}
                  setGastoParaCalendarizar={setGastoParaCalendarizar}
                />
              </>
            </div>
          </>
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

export default GastosRebatesPage;
