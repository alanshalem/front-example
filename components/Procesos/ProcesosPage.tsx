import { Button, DatePicker, Grid, SelectInput } from '@brick/core';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import {
  buildProcesosInitialValueFilter,
  buildProcesosList,
  initialStateFilters,
  prepareFilterAvisos,
} from '@lib/helpers/Procesos.helpers';
import { ProcesosFiltersAuxiliar } from '@lib/types/Procesos/Procesos.types';
import React, { useContext, useEffect, useState } from 'react';
import { FilterContainer } from 'styles/CommonStyles';
import ProcesosTable from './ProcesosTable';
import OverviewContext from '@contexts/Overview';

const ProcesosPage = () => {
  const {procesosForFilter} = useContext(OverviewContext);
  const [initialValue, setInitialValue] = React.useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [procesos, setProcesos] = useState<any>();

  const [filtrosProcesos, setFiltrosProcesos] = useState<
    ProcesosFiltersAuxiliar
  >(initialStateFilters);

  const handleChange = (value: string, field: string) => {
    setFiltrosProcesos(() => ({ ...filtrosProcesos, [field]: value }));
  };


  const procesosMemo = React.useMemo(() => {
    return buildProcesosList(procesosForFilter);
  }, [procesosForFilter]);

  useEffect(() => {
    if (filtrosProcesos.idProceso === '') {
      setInitialValue(
        buildProcesosInitialValueFilter(
          procesosForFilter?.find(
            (e: any) => filtrosProcesos.idProceso === e.text
          )
        )
      );
    }
  }, [filtrosProcesos.idProceso]);
  // #endregion

  useEffect(() => {
    sendFilters();
  }, []);

  const cleanFilter = (event: any) => {
    event.preventDefault();
    setFiltrosProcesos(initialStateFilters);
  };

  const sendFilters = () => {
    setLoading(true);
    prepareFilterAvisos(filtrosProcesos, setProcesos, setLoading);
  };

  const filtros = (
    <>
      <FilterContainer>
        <Grid className="h-100 d-flex mt-32">
          {/* PROCESO */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={procesosMemo}
              initialValue={initialValue}
              handlerBlur={(e: any) => handleChange(e.value, 'idProceso')}
              label="Proceso"
              placeholder="Proceso"
            />
          </Grid.Item>
          {/* FECHA INICIO */}
          <Grid.Item sm={3} className="mb-24">
            {' '}
            <DatePicker
              label="Fecha"
              clear={filtrosProcesos.fechaInicio === ''}
              variant="inline"
              placeholder="Fecha Inicio"
              value={filtrosProcesos.fechaInicio}
              zIndexDpPopper={11}
              zIndexDpNav={11}
              zIndexDatepicker={11}
              selectYears
              onChangeStartDate={(e: any) => handleChange(e, 'fechaInicio')}
              dateFormat="dd/MM/yyyy"
              divider
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
        {loading ? <LoadingGalicia /> : <ProcesosTable procesos={procesos} />}
      </div>
    </>
  );
};

export default ProcesosPage;
