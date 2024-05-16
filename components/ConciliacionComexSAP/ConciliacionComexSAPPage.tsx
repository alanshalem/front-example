import { Button, DatePicker, Grid, SelectInput, TextInput } from '@brick/core';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import OverviewContext from '@contexts/Overview';
import {
  buildAplicacionesInitialValueFilter,
  buildAplicacionesList,
} from '@lib/helpers/Aplicaciones.helpers';
import {
  buildTipoDiferenciaInitialValueFilter,
  buildTipoDiferenciaList,
  downloadConciliacionComexSapTable,
  initialStateFilters,
  prepareFilterConciliacionComexSAP,
} from '@lib/helpers/ConciliacionComexSAP.helpers';
import {
  buildMonedasInitialValueFilter,
  buildMonedasList,
} from '@lib/helpers/Monedas.helpers';
import { Moneda } from '@lib/types/COMEX/Monedas.types';
import {
  ConciliacionComexSAPFilterAuxiliar,
  TipoDiferenciaTypes,
} from '@lib/types/ConciliacionComexSAP/ConciliacionComexSAP.types';
import { Estado } from '@lib/types/Estados/Estados.types';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { FilterContainer } from 'styles/CommonStyles';
import { funcionalidades } from '../../config/ConfigurationService';
import ConciliacionComexSAPTable from './ConciliacionComexSAPTable';
import {
  buildEstadosConciliacionComexSAPList,
  buildEstadosConciliacionComexSAPListInitialValueFilter,
  getEstadosConciliacionComexSAPFuncionalidad,
} from './EstadosConciliacionComexSAP.helper';

const ConciliacionComexSAPPage: React.FC = () => {
  const estadosContext = useContext(OverviewContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [conciliacionesComexSAP, setConciliacionesComexSAP] = useState<any>();
  const [initialValue, setInitialValue] = useState<any>({});
  const [initialValueEstados, setInitialValueEstados] = React.useState<any>({});
  const [filtroConciliacionComexSAP, setFiltroConciliacionComexSAP] = useState<
    ConciliacionComexSAPFilterAuxiliar
  >(initialStateFilters);

  const divisasMemo = useMemo(() => {
    return buildMonedasList(estadosContext.monedas);
  }, [estadosContext.monedas]);

  const estadosMemo = useMemo(() => {
    if (estadosContext.funcionalidades) {
      return buildEstadosConciliacionComexSAPList(
        getEstadosConciliacionComexSAPFuncionalidad(
          estadosContext.funcionalidades,
          funcionalidades.conciliacionComexSAP
        )
      );
    }
  }, [estadosContext.funcionalidades]);

  const aplicacionesMemo = React.useMemo(() => {
    return buildAplicacionesList(estadosContext.tiposAplicaciones);
  }, [estadosContext.tiposAplicaciones]);

  const diferenciasMemo = React.useMemo(() => {
    return buildTipoDiferenciaList(estadosContext.tipoDiferencia);
  }, [estadosContext.tipoDiferencia]);

  useEffect(() => {
    if (filtroConciliacionComexSAP.idAplicacion === '') {
      setInitialValue(
        buildAplicacionesInitialValueFilter(
          estadosContext.tiposAplicaciones?.find(
            (e: any) => filtroConciliacionComexSAP.idAplicacion === e.text
          )
        )
      );
    }
  }, [
    filtroConciliacionComexSAP.idAplicacion,
    estadosContext.tiposAplicaciones,
  ]);

  useEffect(() => {
    if (filtroConciliacionComexSAP.divisa === '') {
      setInitialValue(
        buildMonedasInitialValueFilter(
          estadosContext.monedas?.find(
            (e: Moneda) => filtroConciliacionComexSAP.divisa === e.iso
          )
        )
      );
    }
  }, [filtroConciliacionComexSAP.divisa, estadosContext.monedas]);

  useEffect(() => {
    if (filtroConciliacionComexSAP.idAplicacion === '') {
      setInitialValue(
        buildAplicacionesInitialValueFilter(
          estadosContext.tiposAplicaciones?.find(
            (e: any) => filtroConciliacionComexSAP.idAplicacion === e.text
          )
        )
      );
    }
  }, [
    filtroConciliacionComexSAP.idAplicacion,
    estadosContext.tiposAplicaciones,
  ]);

  useEffect(() => {
    if (filtroConciliacionComexSAP.idEstado === '') {
      if (estadosContext.funcionalidades) {
        setInitialValueEstados(
          buildEstadosConciliacionComexSAPListInitialValueFilter(
            getEstadosConciliacionComexSAPFuncionalidad(
              estadosContext.funcionalidades,
              funcionalidades.conciliacionComexSAP
            )?.find(
              (e: Estado) =>
                filtroConciliacionComexSAP.idEstado ===
                e.idEstadoFuncionalidad.toString()
            )
          )
        );
      }
    }
  }, [filtroConciliacionComexSAP.idEstado, estadosContext.funcionalidades]);

  useEffect(() => {
    if (filtroConciliacionComexSAP.idTipoDiferencia === '') {
      setInitialValue(
        buildTipoDiferenciaInitialValueFilter(
          estadosContext.tipoDiferencia?.find(
            (e: TipoDiferenciaTypes) =>
              filtroConciliacionComexSAP.idTipoDiferencia === e.nombre
          )
        )
      );
    }
  }, [
    filtroConciliacionComexSAP.idTipoDiferencia,
    estadosContext.tipoDiferencia,
  ]);

  const handleChange = (value: string, field: string) => {
    setFiltroConciliacionComexSAP(() => ({
      ...filtroConciliacionComexSAP,
      [field]: value,
    }));
  };

  const cleanFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setFiltroConciliacionComexSAP(initialStateFilters);
  };

  const sendFilters = () => {
    setLoading(true);
    prepareFilterConciliacionComexSAP(
      filtroConciliacionComexSAP,
      setConciliacionesComexSAP,
      setLoading
    );
  };

  const downloadTable = () => {
    setLoading(true);
    downloadConciliacionComexSapTable(filtroConciliacionComexSAP, setLoading);
  };

  useEffect(() => {
    sendFilters();
  }, []);

  const filtros = (
    <>
      <FilterContainer>
        <Grid className="h-100 d-flex mt-40">
          {/* FECHA */}
          <Grid.Item sm={3} className="mb-24">
            <DatePicker
              variant="inline"
              label="Fecha"
              placeholder="Fecha"
              value={filtroConciliacionComexSAP.fecha}
              zIndexDpPopper={2}
              selectYears
              onChangeStartDate={(e: string) => {
                handleChange(e, 'fecha');
              }}
              clear={filtroConciliacionComexSAP.fecha === ''}
              dateFormat="dd/MM/yyyy"
              divider
              popperPlacement="bottom-end"
            />
          </Grid.Item>
          {/* ESTADO */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={estadosMemo}
              initialValue={initialValueEstados}
              handlerBlur={(e: any) => handleChange(e.value, 'idEstado')}
              label="Estado"
            />
          </Grid.Item>
          {/* LEGAJO ASIGNADO*/}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Legajo Asignado"
              value={filtroConciliacionComexSAP.legajoAsignado}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(e.target.value, 'legajoAsignado');
              }}
            />
          </Grid.Item>
          {/* LEGAJO FINALIZADO*/}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Legajo Finalizado"
              value={filtroConciliacionComexSAP.legajoFinalizado}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(e.target.value, 'legajoFinalizado');
              }}
            />
          </Grid.Item>
          {/* TIPO DE DIFERENCIA */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={diferenciasMemo}
              initialValue={initialValue}
              handlerBlur={(e: any) =>
                handleChange(e.value, 'idTipoDiferencia')
              }
              label="Tipo de Diferencia"
            />
          </Grid.Item>
          {/* APLICACION */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={aplicacionesMemo}
              initialValue={initialValue}
              handlerBlur={(e: any) => handleChange(e.value, 'idAplicacion')}
              label="Aplicación"
            />
          </Grid.Item>
          {/* CUENTA */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Cuenta"
              value={filtroConciliacionComexSAP.nroCuenta}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(e.target.value, 'nroCuenta');
              }}
            />
          </Grid.Item>
          {/* MONEDA */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={divisasMemo}
              initialValue={initialValue}
              handlerBlur={(e: any) => handleChange(e.value, 'divisa')}
              label="Divisa"
            />
          </Grid.Item>
          {/* NRO OPERACION */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Nro. Operación"
              value={filtroConciliacionComexSAP.nroOperacion}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(e.target.value, 'nroOperacion');
              }}
            />
          </Grid.Item>
          {/* NRO REF OPER PAGO */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Nro. de Referencia de Operación de Pago"
              value={filtroConciliacionComexSAP.nroRefOperPago}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(e.target.value, 'nroRefOperPago');
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
            <Button variant="terciary" size="small" onClick={cleanFilter}>
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

  return (
    <>
      {filtros}
      <div className="d-flex justify-content-center mx-4 my-20">
        {loading ? (
          <LoadingGalicia />
        ) : (
          <ConciliacionComexSAPTable
            refreshTable={sendFilters}
            setLoading={setLoading}
            conciliacionesComexSAP={conciliacionesComexSAP}
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

export default ConciliacionComexSAPPage; 