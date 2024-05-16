/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Collapse, Grid, SelectInput, TextInput } from '@brick/core';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import { FilterContainer } from '@components/Proyectadas/BusquedaProyectadas.style';
import OverviewContext from '@contexts/Overview';
import {
  buildEstadosInitialValueFilter,
  buildEstadosList,
  getEstadosFuncionalidad,
} from '@lib/helpers/Estados.helpers';
import {
  buildAplicacionInitialValueFilter,
  buildMonedaPosVentaInitialValueFilter,
  buildTipoPosVentaInitialValueFilter,
  getAllPosventaReporteTable,
  itemsAplicacion,
  itemsMoneda,
  prepareFilterPosventaReporte,
  verificarFiltro,
} from '@lib/helpers/PosventaReporte.helpers';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';
import { PosventaReporteAuxiliar } from '@lib/types/PosventaReporte.types';
import React, { useEffect, useState } from 'react';
import { funcionalidades } from '../../config/ConfigurationService';
import PosventaReporteTable from './PosventaReporteTable';
import { buildConceptoInitialValueFilter } from '@lib/helpers/Proyectadas.helpers';
import { ConceptoDeBoleto } from '@lib/types/COMEX/ConceptoDeBoleto.types';
import {
  buildNombresConceptosList,
  buildPosventaTipoInitialValueList,
} from '@lib/helpers/Posventa.helpers';
import { Estado } from '@lib/types/Estados/Estados.types'

const PosventaReportePage = () => {
  const initialState: PosventaReporteAuxiliar = {
    idAplicacion: '',
    moneda: '',
    concepto: '',
    cuit: '',
    idPosVentaTipo: '',
    idEstado: '',
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [filtroPosventa, setFiltroPosventa] = useState<PosventaReporteAuxiliar>(
    initialState
  );

  const [itemsPosventaTipo, setItemsPosventaTipo] = React.useState<
    ItemDropdown[]
  >([]);
  const [items, setItems] = React.useState<ItemDropdown[]>([]);
  const [initialValue, setInitialValue] = React.useState<any>({});
  const [refresh, setRefresh] = useState<boolean>(false);
  const [posventaTable, setPosventaTable] = useState([]);
  const estadosContext = React.useContext(OverviewContext);

  const estadosMemo = React.useMemo(() => {
    if (estadosContext.funcionalidades) {
      return buildEstadosList(
        getEstadosFuncionalidad(
          estadosContext.funcionalidades,
          funcionalidades.posventa
        )
      );
    }
  }, [estadosContext.funcionalidades]);

  useEffect(() => {
    setLoading(true);
    getAllPosventaReporteTable(setPosventaTable, setLoading);
  }, []);

  useEffect(() => {
    if (refresh) {
      setLoading(true);
      getAllPosventaReporteTable(setPosventaTable, setLoading);
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    setItemsPosventaTipo(
      buildPosventaTipoInitialValueList(estadosContext.tiposPosventa)
    );
  }, [estadosContext.tiposPosventa]);

  useEffect(() => {
    setItems(buildNombresConceptosList(estadosContext.nombresConceptos));
  }, [estadosContext.nombresConceptos]);

  useEffect(() => {
    if (filtroPosventa.concepto === '') {
      setInitialValue(
        buildConceptoInitialValueFilter(
          estadosContext.conceptos?.find(
            (e: ConceptoDeBoleto) => filtroPosventa.concepto === e.codigo
          )
        )
      );
    }
  }, [filtroPosventa.concepto, estadosContext.conceptos]);
  
  const sendFilters = () => {
    setLoading(true);
    if (verificarFiltro(filtroPosventa)) {
      getAllPosventaReporteTable(setPosventaTable, setLoading);
    }
    // Sino hago un getByFilter
    else {
      prepareFilterPosventaReporte(
        filtroPosventa,
        setPosventaTable,
        setLoading
      );
    }
  };

  const handleChange = (value: string, field: string) => {
    setFiltroPosventa(() => ({ ...filtroPosventa, [field]: value }));
  };

  const cleanFilter = (event: any) => {
    event.preventDefault();
    setFiltroPosventa(initialState);
    setRefresh(true);
  };

  useEffect(() => {
    if (filtroPosventa.idAplicacion === '') {
      setInitialValue(
        buildAplicacionInitialValueFilter(
          itemsAplicacion.find(
            (e: any) => filtroPosventa.idAplicacion === e.text
          )
        )
      );
    }
  }, [filtroPosventa.idAplicacion]);
  
  useEffect(() => {
    if (filtroPosventa.moneda === '') {
      setInitialValue(
        buildMonedaPosVentaInitialValueFilter(
          itemsMoneda.find(
            (e: any) => filtroPosventa.moneda === e.text
          )
        )
      );
    }
  }, [filtroPosventa.moneda]);

  useEffect(() => {
    if (filtroPosventa.idPosVentaTipo === '') {
      setInitialValue(
        buildTipoPosVentaInitialValueFilter(
          itemsPosventaTipo.find(
            (e: any) => filtroPosventa.idPosVentaTipo === e.text
          )
        )
      );
    }
  }, [filtroPosventa.idPosVentaTipo]);

  useEffect(() => {
    if ( filtroPosventa.idEstado === '') {
      if (estadosContext.funcionalidades) {
        setInitialValue(
          buildEstadosInitialValueFilter(
            getEstadosFuncionalidad(
              estadosContext.funcionalidades,
              funcionalidades.posventa
            )?.find(
              (e: Estado) => filtroPosventa.idEstado === e.idEstado.toString()
            )
          )
        )
      }
    }
  }, [filtroPosventa.idEstado, estadosContext.funcionalidades]);

  const filtros = (
    <>
      <FilterContainer>
        <Collapse
          title={{
            label: 'Filtros',
            main: 'Selecciona los filtros a aplicar.',
          }}
        >
          <Grid className="h-100 d-flex mt-40">
            {/* FILTRO APLICACION */}
            <Grid.Item sm={3} className="mb-24">
              <SelectInput
                variant="inline"
                items={itemsAplicacion}
                initialValue={initialValue}
                handlerBlur={(e: any) =>
                  handleChange(e.value, 'idAplicacion')
                }
                label="Aplicación"
              />
            </Grid.Item>
            {/* FILTRO MONEDA CUENTA */}
            <Grid.Item sm={3} className="mb-24">
              <SelectInput
                variant="inline"
                items={itemsMoneda}
                initialValue={initialValue}
                handlerBlur={(e: any) => handleChange(e.value, 'moneda')}
                label="Moneda"
              />
            </Grid.Item>
            {/* FILTRO CONCEPTO */}
            <Grid.Item sm={3} className="mb-24">
              <SelectInput
                variant="inline"
                items={items}
                initialValue={initialValue}
                handlerBlur={(e: any) => handleChange(e.value, 'concepto')}
                label="Concepto"
              />
            </Grid.Item>
            {/* FILTRO CUIT */}
            <Grid.Item sm={3} className="mb-24">
              <TextInput
                size="normal"
                label="CUIT"
                maxLength={11}
                value={filtroPosventa.cuit}
                onChange={e => {
                  const re = /^[0-9\b]+$/;
                  if (e.target.value === '' || re.test(e.target.value)) {
                    handleChange(e.target.value, 'cuit');
                  }
                }}
              />
            </Grid.Item>
            {/* FILTRO TIPO DE POSVENTA */}
            <Grid.Item sm={3} className="mb-24">
              <SelectInput
                variant="inline"
                items={itemsPosventaTipo}
                initialValue={initialValue}
                handlerBlur={(e: any) => handleChange(e.value, 'idPosVentaTipo')}
                label="Tipo de Posventa"
              />
            </Grid.Item>
            {/* FILTRO ESTADO */}
            <Grid.Item sm={3} className="mb-24">
              <SelectInput
                variant="inline"
                items={estadosMemo}
                initialValue={initialValue}
                handlerBlur={(e: any) => handleChange(e.value, 'idEstado')}
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
        </Collapse>
      </FilterContainer>
    </>
  );

  return (
    <>
      {filtros}
      {loading ? (
        <LoadingGalicia />
      ) : (
        <div className="container-fluid mt-100px">
          <PosventaReporteTable
            refreshTable={sendFilters}
            setLoading={setLoading}
            posventaTable={posventaTable}
          />
        </div>
      )}
    </>
  );
};

export default PosventaReportePage;
