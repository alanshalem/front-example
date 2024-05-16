/* eslint-disable react-hooks/exhaustive-deps */
import { useMsal } from '@azure/msal-react';
import { Button, DatePicker, Grid, SelectInput, TextInput } from '@brick/core';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import { FilterContainer } from '@components/Proyectadas/BusquedaProyectadas.style';
import { toastCallAux } from '@components/Toast/Toast.helpers';
import AuthContext from '@contexts/Auth/AuthContext';
import OverviewContext from '@contexts/Overview';
import { tienePermisos } from '@lib/helpers/Auth.helpers';
import {
  buildEstadosInitialValueFilter,
  buildEstadosList,
  getEstadosFuncionalidad,
} from '@lib/helpers/Estados.helpers';
import {
  buildMonedasInitialValueFilter,
  buildMonedasList,
} from '@lib/helpers/Monedas.helpers';
import {
  buildNombresConceptosList,
  buildPosventaTipoInitialValueList,
  downloadPosventaTable,
  prepareActualizacionDePosventas,
  prepareFilterPosventa,
} from '@lib/helpers/Posventa.helpers';
import { buildConceptoInitialValueFilter } from '@lib/helpers/Proyectadas.helpers';
import { ConceptoDeBoleto } from '@lib/types/COMEX/ConceptoDeBoleto.types';
import { Moneda } from '@lib/types/COMEX/Monedas.types';
import { Estado } from '@lib/types/Estados/Estados.types';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';
import { PosventaAuxiliar } from '@lib/types/Posventa/Posventa.types';
import React, { useEffect, useState } from 'react';
import { acciones, funcionalidades } from '../../config/ConfigurationService';
import NuevaDevolucionGenericaModal from './NuevaDevolucionGenericaModal';
import { NuevaDevolucionModal } from './NuevaDevolucionModal';
import { PosventaTable } from './PosventaTable';
import { PosventaModalBoletos } from './PosventaModalBoletos'

const date = new Date();
const dd = date.getDate();
const mm = date.getMonth() + 1;
const yyyy = date.getFullYear();

const PosventaPage: React.FC = () => {
  const initialState: PosventaAuxiliar = {
    fechaCreacion: `${dd}/${mm.toString().padStart(2, '0')}/${yyyy}`,
    nroOperacion: '',
    razonSocial: '',
    divisa: '',
    estado: '',
    cuit: '',
    concepto: '',
    tipoPosventa: '',
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [posventasActualizadas, setPosventasActualizadas] = useState<number[]>(
    []
  );
  const [filtroPosventa, setFiltroPosventa] = useState<PosventaAuxiliar>({
    ...initialState,
  });
  const [items, setItems] = useState<ItemDropdown[]>([]);
  const [initialValue, setInitialValue] = useState<any>({});
  const [initialValueEstados, setInitialValueEstados] = useState<any>({});
  const [itemsPosventaTipo, setItemsPosventaTipo] = useState<ItemDropdown[]>(
    []
  );
  const [nuevaDevolucionModal, setNuevaDevolucionModal] = useState<boolean>(
    false
  );
  const { accounts } = useMsal();
  const authContext = React.useContext(AuthContext);
  const [
    nuevaDevolucionGenericaModal,
    setNuevaDevolucionGenericaModal,
  ] = useState<boolean>(false);
  const [posventaTable, setPosventaTable] = useState<any[]>([]);
  const estadosContext = React.useContext(OverviewContext);
  const { tiposPosventa } = estadosContext;
  const [refresh, setRefresh] = useState<boolean>(false);
  const [modalBoletos, setModalBoletos] = useState<boolean>(false);
  const [idPosventaDetalle, setIdPosventaDetalle] = useState<number>();
  const [divisaCuenta, setDivisaCuenta] = useState<string | null> ();
  const [montoImporte, setMontoImporte] = useState<number | null>();
  const [tipoMovimiento, setTipoMovimiento] = useState<number | null>();


  const divisasMemo = React.useMemo(
    () => buildMonedasList(estadosContext.monedas),
    [estadosContext.monedas]
  );

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
    if (filtroPosventa.divisa === '') {
      setInitialValue(
        buildMonedasInitialValueFilter(
          estadosContext.monedas?.find(
            (e: Moneda) => filtroPosventa.divisa === e.iso
          )
        )
      );
    }
  }, [estadosContext.monedas, filtroPosventa.divisa]);

  useEffect(() => {
    setLoading(true);
    prepareFilterPosventa(filtroPosventa, setPosventaTable, setLoading);
  }, []);

  useEffect(() => {
    if (refresh) {
      setLoading(true);
      prepareFilterPosventa(filtroPosventa, setPosventaTable, setLoading);
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    setItemsPosventaTipo(buildPosventaTipoInitialValueList(tiposPosventa));
  }, [tiposPosventa]);

  const sendFilters = () => {
    setLoading(true);
    prepareFilterPosventa(filtroPosventa, setPosventaTable, setLoading);
    setPosventasActualizadas([]);
  };

  const downloadTable = () => {
    setLoading(true);
    downloadPosventaTable(filtroPosventa, setLoading);
  };

  useEffect(() => {
    setItems(buildNombresConceptosList(estadosContext.nombresConceptos));
  }, [estadosContext.nombresConceptos]);

  useEffect(() => {
    if (filtroPosventa.divisa === '') {
      setInitialValue(
        buildMonedasInitialValueFilter(
          estadosContext.monedas?.find(
            (e: Moneda) => filtroPosventa.divisa === e.iso
          )
        )
      );
    }
  }, [filtroPosventa.divisa, estadosContext.monedas]);

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

  useEffect(() => {
    if (filtroPosventa.estado === '') {
      if (estadosContext.funcionalidades) {
        setInitialValueEstados(
          buildEstadosInitialValueFilter(
            getEstadosFuncionalidad(
              estadosContext.funcionalidades,
              funcionalidades.posventa
            )?.find(
              (e: Estado) => filtroPosventa.estado === e.idEstado.toString()
            )
          )
        );
      }
    }
  }, [filtroPosventa.estado, estadosContext.funcionalidades]);

  const botonNuevaDevolucion = (
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
          onClick={() => setNuevaDevolucionModal(!nuevaDevolucionModal)}
        >
          Nueva
        </Button>
      </Grid.Item>
      <Grid.Item className="mb-24">
        <Button
          variant="primary"
          size="small"
          onClick={() =>
            setNuevaDevolucionGenericaModal(!nuevaDevolucionGenericaModal)
          }
        >
          Nueva Devolucion/Cobro Genérico
        </Button>
      </Grid.Item>
    </Grid>
  );

  const handleChange = (value: string, field: string) => {
    setFiltroPosventa(() => ({ ...filtroPosventa, [field]: value }));
  };

  const legajo = accounts[0].username.slice(0, 8);
  const grupo = (accounts[0].idTokenClaims.groups[0] as string) || '';

  const handleButtonAction = async (action: 'aprobar' | 'rechazar') => {
    if (posventasActualizadas.length > 0) {
      tienePermisos(
        funcionalidades.posventa,
        acciones.sign,
        authContext.permisos,
        async () => {
          setLoading(true);
          await prepareActualizacionDePosventas(
            posventasActualizadas,
            action,
            setLoading,
            sendFilters,
            legajo,
            grupo
          );
          setIsButtonDisabled(true);
          setTimeout(() => {
            setIsButtonDisabled(false);
          }, 10000);
        }
      );
    } else {
      toastCallAux(`No hay impuestos seleccionados para ${action}.`, false);
    }
  };

  const cleanFilter = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setFiltroPosventa(initialState);
    setRefresh(true);
  };

  const filtros = (
    <>
      {botonNuevaDevolucion}
      <FilterContainer>
        <Grid className="h-100 d-flex mt-40">
          <Grid.Item sm={3} className="mb-24">
            <DatePicker
              label="Fecha de Posventa"
              variant="inline"
              placeholder="Fecha de Posventa"
              value={filtroPosventa.fechaCreacion}
              zIndexDpPopper={2}
              selectYears
              onChangeStartDate={(e: any) => handleChange(e, 'fechaCreacion')}
              dateFormat="dd/MM/yyyy"
              divider
            />
          </Grid.Item>
          {/* NRO OPERACION */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Nro. Operación"
              value={filtroPosventa.nroOperacion}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e.target.value, 'nroOperacion')
              }
            />
          </Grid.Item>
          {/* RAZON SOCIAL */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Razón Social"
              value={filtroPosventa.razonSocial}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e.target.value, 'razonSocial')
              }
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
          {/* ESTADO */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={estadosMemo}
              initialValue={initialValueEstados}
              handlerBlur={(e: any) => handleChange(e.value, 'estado')}
              label="Estado"
            />
          </Grid.Item>
          {/* CUIT */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="CUIT"
              maxLength={11}
              value={filtroPosventa.cuit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const re = /^[0-9\b]+$/;
                if (e.target.value === '' || re.test(e.target.value)) {
                  handleChange(e.target.value, 'cuit');
                }
              }}
            />
          </Grid.Item>
          {/* CONCEPTO */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={items}
              initialValue={initialValue}
              handlerBlur={(e: any) => handleChange(e.value, 'concepto')}
              label="Concepto"
            />
          </Grid.Item>
          {/* TIPO DE POSVENTA */}
          <Grid.Item sm={3} className="mb-24">
            <SelectInput
              variant="inline"
              items={itemsPosventaTipo}
              initialValue={initialValue}
              handlerBlur={(e: any) => handleChange(e.value, 'tipoPosventa')}
              label="Tipo de Posventa"
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

  const botones = (
    <>
      <Grid direction="row" alignItems="center" className="ml-12">
        <Grid.Item xs={1}>
          <Button
            onClick={() => handleButtonAction('aprobar')}
            variant="primary"
            size="small"
            iconAlign="right"
            iconType="check"
            disabled={isButtonDisabled}
          >
            Aprobar
          </Button>
        </Grid.Item>
        <Grid.Item xs={1}>
          <Button
            onClick={() => handleButtonAction('rechazar')}
            variant="secondary"
            size="small"
            iconAlign="right"
            iconType="close"
            disabled={isButtonDisabled}
          >
            Rechazar
          </Button>
        </Grid.Item>
      </Grid>
    </>
  );

  return (
    <>
      {filtros}

      {loading ? (
        <LoadingGalicia />
      ) : (
        <div>
          {botones}
          <PosventaTable
            refreshTable={sendFilters}
            setLoading={setLoading}
            posventaTable={posventaTable}
            posventasActualizadas={posventasActualizadas}
            setPosventasActualizadas={setPosventasActualizadas}
            setModalBoletos={setModalBoletos}
            setDivisaCuenta={setDivisaCuenta}
            setTipoMovimiento={setTipoMovimiento}
            setIdPosventaDetalle={setIdPosventaDetalle}
          />
        </div>
      )}

      <div className="d-flex justify-content-center mx-4 my-20">
        <>
          <NuevaDevolucionModal
            isModalActive={nuevaDevolucionModal}
            closeModal={() => setNuevaDevolucionModal(false)}
            refreshTable={sendFilters}
          />
          <NuevaDevolucionGenericaModal
            isModalActive={nuevaDevolucionGenericaModal}
            closeModal={() => setNuevaDevolucionGenericaModal(false)}
            refreshTable={sendFilters}
            setModalBoletos={setModalBoletos}
            setIdPosventaDetalle={setIdPosventaDetalle}
            setMontoImporte={setMontoImporte}
            setDivisaCuenta={setDivisaCuenta}
            setTipoMovimiento={setTipoMovimiento}
            setRefresh={setRefresh}
          />
          <PosventaModalBoletos
            isModalActive={modalBoletos}
            closeModal={() => setModalBoletos(false)}
            idPosventaDetalle={idPosventaDetalle}
            setMontoImporte={setMontoImporte}
            montoImporte={montoImporte}
            setDivisaCuenta={setDivisaCuenta}
            divisaCuenta={divisaCuenta}
            setTipoMovimiento={setTipoMovimiento}
            tipoMovimiento={tipoMovimiento}
            setRefresh={setRefresh}
          />
        </>
      </div>
    </>
  );
};

export default PosventaPage;
