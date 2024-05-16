import React, { useContext, useEffect, useState } from 'react';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import { Toaster } from 'react-hot-toast';
import { FilterContainer } from 'styles/CommonStyles';
import { Button, DatePicker, Grid, SelectInput } from '@brick/core';
import AlertasTable from './AlertasTable';
import {
  AlertasFiltersAuxiliar,
  AvisosResponse,
} from '@lib/types/Alertas/Alertas.types';
import {
  builTiposDeAvisosInitialValueFilter,
  buildTiposDeAvisosList,
  initialStateFilters,
  prepareFilterAvisos,
} from '@lib/helpers/Alertas.helpers';
import OverviewContext from '@contexts/Overview';
import {
  buildAplicacionesInitialValueFilter,
  buildAplicacionesList,
} from '@lib/helpers/Aplicaciones.helpers';
import AlertasModalDetalle from './AlertasModalDetalle';

const AlertasPage = () => {
  const estadosContext = useContext(OverviewContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialValue, setInitialValue] = React.useState<any>({});
  const [filtrosAlertas, setFiltrosAlertas] = useState<AlertasFiltersAuxiliar>(
    initialStateFilters
  );
  const [alertasConciliacionList, setAlertasConciliacionList] = useState<
    AvisosResponse[]
  >();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [dataModal, setDataModal] = useState<number | null>(null);

  const handleChange = (value: string, field: string) => {
    setFiltrosAlertas(() => ({ ...filtrosAlertas, [field]: value }));
  };
  const aplicacionesMemo = React.useMemo(() => {
    return buildAplicacionesList(estadosContext.tiposAplicaciones);
  }, [estadosContext.tiposAplicaciones]);

  const tiposAvisosMemo = React.useMemo(() => {
    return buildTiposDeAvisosList(estadosContext.tiposAvisos);
  }, [estadosContext.tiposAvisos]);

  const cleanFilter = (event: any) => {
    event.preventDefault();
    setFiltrosAlertas(initialStateFilters);
    setRefresh(true);
  };

  const sendFilters = () => {
    setLoading(true);
    prepareFilterAvisos(filtrosAlertas, setAlertasConciliacionList, setLoading);
  };

  useEffect(() => {
    sendFilters();
  }, []);

  const handleModal = e => {
    setDataModal(e.id);
    setTimeout(() => {
      setModal(true)
    }, 200)
  };
  
  useEffect(() => {
    if (refresh) {
      setLoading(true);
      prepareFilterAvisos(
        filtrosAlertas,
        setAlertasConciliacionList,
        setLoading
      );
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    if (filtrosAlertas.aplicacion === '') {
      setInitialValue(
        buildAplicacionesInitialValueFilter(
          estadosContext.tiposAplicaciones?.find(
            (e: any) => filtrosAlertas.aplicacion === e.text
          )
        )
      );
    }
  }, [filtrosAlertas.aplicacion, estadosContext.tiposAplicaciones]);

  useEffect(() => {
    if (filtrosAlertas.tipo === '') {
      setInitialValue(
        builTiposDeAvisosInitialValueFilter(
          estadosContext.tiposAvisos?.find(
            (e: any) => filtrosAlertas.aplicacion === e.text
          )
        )
      );
    }
  }, [filtrosAlertas.tipo, estadosContext.tiposAvisos]);

  const filtros = (
    <>
      <FilterContainer>
        <Grid className="h-100 d-flex mt-40">
          <Grid.Item sm={3} className="mb-24">
            <DatePicker
              label="Fecha"
              clear={filtrosAlertas.fecha === ''}
              variant="inline"
              placeholder="Fecha"
              value={filtrosAlertas.fecha}
              zIndexDpPopper={11}
              zIndexDpNav={11}
              zIndexDatepicker={11}
              selectYears
              onChangeStartDate={(e: any) => handleChange(e, 'fecha')}
              dateFormat="dd/MM/yyyy"
              divider
            />
          </Grid.Item>
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={aplicacionesMemo}
              initialValue={initialValue}
              handlerBlur={(e: any) => handleChange(e.value, 'aplicacion')}
              label="Aplicación"
            />
          </Grid.Item>
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={tiposAvisosMemo}
              initialValue={initialValue}
              handlerBlur={(e: any) => handleChange(e.value, 'tipo')}
              label="Tipo de Alerta"
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
            <AlertasTable
              alertasConciliacionList={alertasConciliacionList}
              handleModal={handleModal}
            />
            <AlertasModalDetalle
              isModalActive={modal}
              dataModal={dataModal}
              closeModal={() => setModal(false)}
              alertasConciliacionList={alertasConciliacionList}
              setDataModal={setDataModal}
            />
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

export default AlertasPage;