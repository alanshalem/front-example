import { Button, DatePicker, Grid, SelectInput, TextInput } from '@brick/core';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import OverviewContext from '@contexts/Overview';
import {
  buildMonedasInitialValueFilter,
  buildMonedasList,
} from '@lib/helpers/Monedas.helpers';
import {
  downloadOpcamTable,
  getAllOpcam,
  initialStateFilters,
  prepareFilter,
  verificarFiltroOpcam,
} from '@lib/helpers/Opcam.helpers';
import {
  buildConceptoInitialValueFilter,
  buildConceptosList,
} from '@lib/helpers/Proyectadas.helpers';
import { ConceptoDeBoleto } from '@lib/types/COMEX/ConceptoDeBoleto.types';
import { Moneda } from '@lib/types/COMEX/Monedas.types';
import { OpcamFiltersAuxiliar } from '@lib/types/Opcam/Opcam.types';
import React, { useEffect, useState } from 'react';
import { FilterContainer } from 'styles/CommonStyles';
import OpcamTable from './OpcamTable';

export type OpcamAuxiliar = {
  codDisenio?: string;
  codEntidad?: string;
  fechaInformacion?: string;
  codJurisdiccion?: string;
  tipoOperacion?: string;
  nroBoleto?: string;
  nroEntidad?: string;
  tipoIdent?: string;
  nroIdent?: string;
  denominacionClie?: string;
  codPaisResid?: string;
  condClie?: string;
  corresponsal?: string;
  codInstVendido?: string;
  codInstRecibido?: string;
  codPais?: string;
  denominacion?: string;
  paisOrigen?: string;
  codConcepto?: string;
  fechaEmbarque?: string;
  codMoneda?: string;
  impMonedaOriginal?: number;
  impEnPesos?: number;
  nroOficializac?: string;
  codDj?: string;
  rectificativa?: string;
  validParalelo?: string;
};

const OpcamPage = () => {
  const estadosContext = React.useContext(OverviewContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [busquedaDelDia, setBusquedaDelDia] = useState<boolean>(true);
  const [filtroOpcam, setFiltroOpcam] = useState<OpcamFiltersAuxiliar>(
    initialStateFilters
  );
  const [opcamList, setOpcamList] = useState<OpcamAuxiliar[]>([]);
  const [initialValue, setInitialValue] = React.useState<any>({});
  const [itemsConceptos, setItemsConceptos] = React.useState<any[]>([]);
  const [itemsMonedas, setItemsMonedas] = React.useState<any[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  const sendFilters = () => {
    setLoading(true);
    if (verificarFiltroOpcam(filtroOpcam)) {
      getAllOpcam(setOpcamList, setLoading, setFiltroOpcam);
      setBusquedaDelDia(true);
    } else {
      prepareFilter(filtroOpcam, setOpcamList, setLoading);
      setBusquedaDelDia(false);
    }
  };

  const handleChange = (value: string, field: string) => {
    setFiltroOpcam(() => ({ ...filtroOpcam, [field]: value }));
  };

  const cleanFilter = (event: any) => {
    event.preventDefault();
    setFiltroOpcam(initialStateFilters);
    setRefresh(true);
  };

  const downloadTable = () => {
    setLoading(true);
    downloadOpcamTable(filtroOpcam, setLoading);
  };

  useEffect(() => {
    setLoading(true);
    getAllOpcam(setOpcamList, setLoading, setFiltroOpcam);
  }, []);

  useEffect(() => {
    if (refresh) {
      setLoading(true);
      getAllOpcam(setOpcamList, setLoading, setFiltroOpcam);
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    setItemsMonedas(buildMonedasList(estadosContext.monedas));
  }, [estadosContext.monedas]);

  useEffect(() => {
    setItemsConceptos(buildConceptosList(estadosContext.conceptos));
  }, [estadosContext.conceptos]);

  useEffect(() => {
    if (filtroOpcam.codConcepto === '') {
      setInitialValue(
        buildConceptoInitialValueFilter(
          estadosContext.conceptos?.find(
            (e: ConceptoDeBoleto) => filtroOpcam.codConcepto === e.codigo
          )
        )
      );
    }
  }, [estadosContext.conceptos, filtroOpcam.codConcepto]);

  useEffect(() => {
    if (filtroOpcam.codMoneda === '') {
      setInitialValue(
        buildMonedasInitialValueFilter(
          estadosContext.monedas?.find(
            (e: Moneda) => filtroOpcam.codMoneda === e.iso
          )
        )
      );
    }
  }, [estadosContext.monedas, filtroOpcam.codMoneda]);

  const filtros = (
    <>
      <FilterContainer>
        <Grid className="h-100 d-flex mt-32">
          {/* FECHA INFORMACION */}
          <Grid.Item sm={3} className="mb-24">
            <DatePicker
              clear={filtroOpcam.fechaInformacion === ''}
              label="Fecha de Información"
              variant="inline"
              placeholder="Fecha de Información"
              value={filtroOpcam.fechaInformacion}
              zIndexDpPopper={2}
              selectYears
              onChangeStartDate={(e: any) => {
                handleChange(e, 'fechaInformacion');
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
              label="Tipo de Operación"
              value={filtroOpcam.tipoOperacion}
              onChange={(e: any) => {
                handleChange(e.target.value, 'tipoOperacion');
              }}
            />
          </Grid.Item>
          {/* Nro Boleto */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Número de Boleto"
              value={filtroOpcam.nroBoleto}
              onChange={(e: any) => {
                handleChange(e.target.value, 'nroBoleto');
              }}
            />
          </Grid.Item>
          {/* Tipo Ident */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Tipo de Identificación"
              value={filtroOpcam.tipoIdent}
              onChange={(e: any) => {
                handleChange(e.target.value, 'tipoIdent');
              }}
            />
          </Grid.Item>
          {/* Nro. Ident */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Numero de Identificación"
              value={filtroOpcam.nroIdent}
              onChange={(e: any) => {
                handleChange(e.target.value, 'nroIdent');
              }}
            />
          </Grid.Item>
          {/* Cod. Concepto */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={itemsConceptos}
              initialValue={initialValue}
              handlerBlur={(e: any) => handleChange(e.value, 'codConcepto')}
              label="Código de Concepto"
            />
          </Grid.Item>
          {/* Cod. Moneda */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={itemsMonedas}
              initialValue={initialValue}
              handlerBlur={(e: any) => handleChange(e.value, 'codMoneda')}
              label="Código de Moneda"
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
            <Button variant="primary" size="small" onClick={downloadTable}>
              Descargar
            </Button>
          </Grid.Item>
        </Grid>
      </FilterContainer>
    </>
  );

  const busquedaTernarioIndependiente = busquedaDelDia
    ? 'Todavía no se cargó ningun archivo Opcam en el día de hoy.'
    : 'No se encontraron resultados que coincidan con los filtros de búsqueda.';

  return (
    <>
      {filtros}
      <div className="d-flex justify-content-center mx-4 my-20">
        {loading ? (
          <LoadingGalicia />
        ) : (
          <OpcamTable
            opcam={opcamList}
            mensajeTablaVacia={busquedaTernarioIndependiente}
          />
        )}
      </div>
    </>
  );
};

export default OpcamPage;
