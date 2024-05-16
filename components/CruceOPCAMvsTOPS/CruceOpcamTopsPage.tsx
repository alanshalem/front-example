import { Button, DatePicker, Grid, TextInput } from '@brick/core';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import {
  getCrucesOpcamTopsDelUltimoDiaHabil,
  initialStateFilters,
  prepareFilter,
} from '@lib/helpers/CruceOpcamTops.helpers';
import { CruceOpcamTopsFiltersAuxiliar } from '@lib/types/CruceOpcamTops/CruceOpcamTops.types';
import React, { useEffect, useState } from 'react';
import { FilterContainer } from 'styles/CommonStyles';
import CruceOpcamTopsTable from './CruceOpcamTopsTable';

export type OpcamTopsAuxiliar = {
  idConci?: number;
  fechaCruce?: string;
  nroBoleto?: string;
  tipoOperacion?: string;
  tipoCondicion?: string;
  aplicacion?: string;
  diferencias?: Diferencia[];
};

export interface Diferencia {
  tipoDiferencia?: string;
  valorOpcam?: string;
  valorAplicacion?: string;
}

const CruceOpcamTopsPage = () => {
  const [filtroOpcamTops, setFiltroOpcamTops] = useState<
    CruceOpcamTopsFiltersAuxiliar
  >(initialStateFilters);
  const [loading, setLoading] = useState<boolean>(false);
  const [CruceBoletoOpcamTopsList, setCruceBoletoOpcamTopsList] = useState<
    OpcamTopsAuxiliar[]
  >([]);
  const [busquedaDelDia, setBusquedaDelDia] = useState<boolean>(true);

  const cleanFilter = (event: any) => {
    event.preventDefault();
    setFiltroOpcamTops(initialStateFilters);
  };
  const handleChange = (value: string, field: string) => {
    setFiltroOpcamTops(() => ({ ...filtroOpcamTops, [field]: value }));
  };

  const sendFilters = () => {
    setLoading(true);
    // sino hago un getByFilter pasandole los filtros
    prepareFilter(setCruceBoletoOpcamTopsList, setLoading, filtroOpcamTops);
    setBusquedaDelDia(false);
  };

  const sendUltimoDiaHabil = () => {
    setLoading(true);
    getCrucesOpcamTopsDelUltimoDiaHabil(
      setCruceBoletoOpcamTopsList,
      setLoading,
      setFiltroOpcamTops
    );
  };

  useEffect(() => {
    sendUltimoDiaHabil();
  }, []);
  const filtros = (
    <>
      <FilterContainer>
        <Grid className="h-100 d-flex mt-32">
          {/* FECHA CRUCE */}
          <Grid.Item sm={3} className="mb-24">
            <DatePicker
              clear={filtroOpcamTops.fechaCruce === ''}
              label="Fecha de Cruce"
              variant="inline"
              placeholder="Fecha de Cruce"
              value={filtroOpcamTops.fechaCruce}
              zIndexDpPopper={2}
              selectYears
              onChangeStartDate={(e: any) => {
                handleChange(e, 'fechaCruce');
              }}
              dateFormat="dd/MM/yyyy"
              divider
              popperPlacement="bottom-end"
            />
          </Grid.Item>
          {/* Tipo Operacion */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Numero de Boleto"
              value={filtroOpcamTops.nroBoleto}
              onChange={(e: any) => {
                handleChange(e.target.value, 'nroBoleto');
              }}
            />
          </Grid.Item>
          {/* Tipo de Operacion */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Tipo de Operacion"
              value={filtroOpcamTops.tipoOperacion}
              onChange={(e: any) => {
                handleChange(e.target.value, 'tipoOperacion');
              }}
            />
          </Grid.Item>
          {/* Tipo Condicion */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Tipo de Condicion"
              value={filtroOpcamTops.tipoCondicion}
              onChange={(e: any) => {
                handleChange(e.target.value, 'tipoCondicion');
              }}
            />
          </Grid.Item>
          {/* Aplicacion */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Aplicacion"
              value={filtroOpcamTops.aplicacion}
              onChange={(e: any) => {
                handleChange(e.target.value, 'aplicacion');
              }}
            />
          </Grid.Item>
          {/* Cod. Concepto */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Tipo de Diferencia"
              value={filtroOpcamTops.tipoDiferencia}
              onChange={(e: any) => {
                handleChange(e.target.value, 'tipoDiferencia');
              }}
            />
          </Grid.Item>
          {/* Cod. Moneda */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Valor de la Diferencia"
              value={filtroOpcamTops.valor}
              onChange={(e: any) => {
                handleChange(e.target.value, 'valor');
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
    ? 'Todavía no se cargó ninguna Contabilidad de OPCAM o TOPS para cruzar en el día de hoy.'
    : 'No se encontraron resultados que coincidan con los filtros de búsqueda.';

  return (
    <>
      {filtros}
      <div className="d-flex justify-content-center mx-4 my-20">
        {loading ? (
          <LoadingGalicia />
        ) : (
          <CruceOpcamTopsTable
            cruces={CruceBoletoOpcamTopsList}
            refreshTable={sendFilters}
            mensajeTablaVacia={busquedaTernarioIndependiente}
          />
        )}
      </div>
    </>
  );
};

export default CruceOpcamTopsPage;
