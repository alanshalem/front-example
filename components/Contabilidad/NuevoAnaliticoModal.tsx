import { useMsal } from '@azure/msal-react';
import {
  Button,
  Container,
  DatePicker,
  Grid,
  Modal,
  SelectInput,
  Switcher,
  TextInput,
  Textarea,
} from '@brick/core';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import OverviewContext from '@contexts/Overview';
import {
  handleCargarContabilidad,
  handleGuardarContabilidad,
  handleSimularContabilidad,
  initialValueOptions,
  transformarArrayEventosContablesContabilidadManual,
  transformarArrayReferenciasContablesContabilidadManual,
  validateFieldsGuardar,
  validateFieldsSimular,
} from '@lib/helpers/Contabilidad.helpers';
import { buildCorresponsalList } from '@lib/helpers/Corresponsal.helpers';
import { buildMonedasList } from '@lib/helpers/Monedas.helpers';
import {
  initialStateDataAuxiliarInicialInterface,
  initialStateDataAuxiliarIntermediaInterface,
} from '@lib/types/Contabilidad/Contabilidad.types';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';
import React, { useContext, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import styled from 'styled-components';
import NuevoAnaliticoModalTable from './NuevoAnaliticoModalTable';

interface NuevoAnalitico {
  isModalActive: boolean;
  closeModal: () => void;
  setModel?: (evento: any) => void;
  refreshTable: () => void;
}
export const FormularioContainer = styled.div`
  height: 'fit-content';
  background-color: '#f4f4f5';
  border-radius: '4px';
  padding: '17px 17px 0px 17px';
`;

export const NuevoAnaliticoModal: React.FC<NuevoAnalitico> = (
  props: NuevoAnalitico
) => {
  // Eventos Contables y Tipos de Corresponsal para SelectInput
  const {
    monedas,
    eventosContablesContabilidadManual,
    referencias,
    tiposCorresponsal,
  } = useContext(OverviewContext);

  const [observaciones, setObservaciones] = useState<string>('');
  const [esGenerica, setEsGenerica] = useState<string>('');
  const [
    eventosContablesSelectInputList,
    setEventosContablesSelectInputList,
  ] = useState<ItemDropdown[]>();

  const [loading, setLoading] = useState<boolean>(false);
  const [respuestaValida, setRespuestaValida] = useState<boolean>(false);
  const [referenciasSelectInputList, setReferenciasSelectInputList] = useState<
    ItemDropdown[]
  >();
  const [tipoDocumento, setTipoDocumento] = useState<string>('CUIT');
  const [referenciaODocumento, setReferenciaODocumento] = useState<string>(
    'documento'
  );
  const [renderTableSimular, setRenderTableSimular] = useState<boolean>(false);
  const { accounts } = useMsal();
  const legajo = accounts[0].username.slice(0, 8);

  useEffect(() => {
    if (eventosContablesContabilidadManual) {
      setEventosContablesSelectInputList(
        transformarArrayEventosContablesContabilidadManual(
          eventosContablesContabilidadManual
        )
      );
    }
  }, [eventosContablesContabilidadManual]);
  useEffect(() => {
    if (referencias) {
      setReferenciasSelectInputList(
        transformarArrayReferenciasContablesContabilidadManual(referencias)
      );
    }
  }, [referencias]);

  // Eventos Contables para la Tabla
  const [eventosContablesList, setEventosContablesList] = useState<any>();
  const [
    eventosContablesOriginalList,
    setEventosContablesOriginalList,
  ] = useState<any>();
  const [respuestaInicial, setRespuestaInicial] = useState<any>();
  const [, setMostrarTabla] = useState<boolean>(false);
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const año = fecha.getFullYear();
  const fechaActual = `${dia}/${mes}/${año}`;
  const initialStateDataInicialAuxiliar: initialStateDataAuxiliarInicialInterface = {
    idEventoContable: '',
    idTipoReferencia: '',
    nroDocumento: '',
    tipoDocumento: 'CUIT',
    idCorresponsal: '',
    identificacion: '',
    fechaValor: fechaActual,
  };

  const initialStateDataIntermediaAuxiliar: initialStateDataAuxiliarIntermediaInterface = {
    cotizacion: '',
    divisa: '',
    importe: '',
    centroCosto: '',
  };

  const [costoVisible, setCostoVisible] = useState<boolean>(false);
  const [importeVisible, setImporteVisible] = useState<boolean>(false);
  const [divisaVisible, setDivisaVisible] = useState<boolean>(false);
  const [cotizacionVisible, setCotizacionVisible] = useState<boolean>(false);

  const [nuevoAnaliticoData, setNuevoAnaliticoData] = useState(
    initialStateDataInicialAuxiliar
  );
  const [
    nuevoAnaliticoIntermedioData,
    setNuevoAnaliticoIntermedioData,
  ] = useState(initialStateDataIntermediaAuxiliar);

  // Función para manejar cambios en los TextInput
  const handleChange = (value: string | any, field: string) => {
    setNuevoAnaliticoData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleChangeEventoContable = (selectedEvent: ItemDropdown) => {
    // Buscar el evento en eventosContablesContabilidadManual por su id
    const selectedEvento = eventosContablesContabilidadManual.find(
      evento => evento.id === selectedEvent.value
    );
    // Actualizar el estado de esGenerica con la propiedad correspondiente del evento
    if (selectedEvento) {
      setEsGenerica(selectedEvento.esGenerico ? 'generica' : 'no-generica');
    }
  };

  const handleChangeIntermedio = (value: string | any, field: string) => {
    setNuevoAnaliticoIntermedioData(prevState => ({
      ...prevState,
      [field]: value,
    }));
    setValidarGuardar(false);
  };

  const corresponsalMemo = React.useMemo(() => {
    return buildCorresponsalList(tiposCorresponsal);
  }, [tiposCorresponsal]);

  const closeToggle = () => {
    setNuevoAnaliticoData(initialStateDataInicialAuxiliar);
    setNuevoAnaliticoIntermedioData(initialStateDataIntermediaAuxiliar);
    setRespuestaValida(false);
    setTipoDocumento('CUIT');
    setReferenciaODocumento('documento');
    props.closeModal();
    setEventosContablesList([]);
    setEventosContablesOriginalList([]);
    setRespuestaInicial(undefined);
    setValidarSimular(false);
    setRenderTableSimular(false);
    setCostoVisible(false);
    setImporteVisible(false);
    setDivisaVisible(false);
    setCotizacionVisible(false);
    setObservaciones('');
    setEsGenerica('');
  };

  const [validarGuardar, setValidarGuardar] = useState<boolean>(false);
  const [validarSimular, setValidarSimular] = useState<boolean>(false);

  useEffect(() => {
    setValidarGuardar(validateFieldsGuardar(eventosContablesList));
  }, [eventosContablesList]);
  useEffect(() => {
    handleChange('CUIT', 'tipoDocumento');
    setTipoDocumento('CUIT');
    setReferenciaODocumento('documento');
    setValidarSimular(false);
  }, []);

  useEffect(() => {
    setRenderTableSimular(false);
    setValidarSimular(
      validateFieldsSimular(respuestaInicial, nuevoAnaliticoIntermedioData)
    );
  }, [respuestaInicial, nuevoAnaliticoIntermedioData]);

  const divisasMemo = React.useMemo(() => {
    return buildMonedasList(monedas);
  }, [monedas]);

  const FormularioInicial: JSX.Element = (
    <FormularioContainer>
      <Grid className="h-100 d-flex">
        <Grid.Item sm={12} direction="row" className="mt-32">
          {props.isModalActive && (
            <SelectInput
              variant="inline"
              items={eventosContablesSelectInputList}
              initialValue={initialValueOptions}
              handlerBlur={(e: any) => {
                handleChange(e.value, 'idEventoContable');
                handleChangeEventoContable(e);
              }}
              label="Evento*"
              disabled={respuestaValida}
            />
          )}
        </Grid.Item>
        <Grid.Item sm={2} direction="row" className="mt-32">
          {props.isModalActive && (
            <Switcher
              value={
                referenciaODocumento === 'referencia'
                  ? 'referencia'
                  : 'documento'
              }
              label="Tipo identificación"
              capitalization="capitalize"
              className="mb-16"
              onChange={e => {
                setReferenciaODocumento(
                  e.status === true ? 'referencia' : 'documento'
                );
                handleChange('CUIT', 'tipoDocumento');
                handleChange('', 'nroDocumento');
                handleChange('', 'idCorresponsal');
              }}
              //checked={switcherStatus}
              disabled={respuestaValida}
            />
          )}{' '}
        </Grid.Item>
        {referenciaODocumento === 'documento' ? (
          <>
            <Grid.Item sm={4} direction="row" className="mt-32">
              {props.isModalActive && (
                <Switcher
                  value={tipoDocumento === 'CUIT' ? 'CUIT' : 'CUIL'}
                  label="Es CUIL"
                  capitalization="capitalize"
                  className="mb-16"
                  onChange={e => {
                    setTipoDocumento(e.status === true ? 'CUIL' : 'CUIT');
                    handleChange(
                      e.status === true ? 'CUIL' : 'CUIT',
                      'tipoDocumento'
                    );
                  }}
                  disabled={respuestaValida}
                />
              )}
            </Grid.Item>
            <Grid.Item sm={6} direction="row" className="mt-32">
              <TextInput
                variant="inline"
                inputType="cuit"
                label={`Ingrese su ${
                  tipoDocumento === 'CUIT' ? 'CUIT' : 'CUIL'
                }`}
                message="Sólo números"
                size="normal"
                error={false}
                success={false}
                value={nuevoAnaliticoData.nroDocumento}
                onChange={(e: any) => {
                  handleChange(e.target.value, 'nroDocumento');
                }}
                disabled={respuestaValida}
              />
            </Grid.Item>
          </>
        ) : (
          <Grid.Item sm={10} direction="row" className="mt-32">
            {props.isModalActive && (
              <SelectInput
                variant="inline"
                items={corresponsalMemo}
                initialValue={initialValueOptions}
                handlerBlur={(e: any) =>
                  handleChange(e.value, 'idCorresponsal')
                }
                label="Corresponsal*"
                disabled={respuestaValida}
              />
            )}
          </Grid.Item>
        )}
        <Grid.Item sm={4} direction="row" className="mt-32">
          {props.isModalActive && (
            <SelectInput
              variant="inline"
              items={referenciasSelectInputList}
              initialValue={initialValueOptions}
              handlerBlur={(e: any) =>
                handleChange(e.value, 'idTipoReferencia')
              }
              label="Referencia*"
              disabled={respuestaValida}
            />
          )}
        </Grid.Item>
        <Grid.Item sm={4} direction="row" className="mt-32">
          <TextInput
            variant="inline"
            inputType="text"
            label="Número de Operación*"
            size="normal"
            error={false}
            success={false}
            maxLength={20}
            value={nuevoAnaliticoData.identificacion}
            onChange={(e: any) => {
              handleChange(e.target.value, 'identificacion');
            }}
            disabled={respuestaValida}
          />
        </Grid.Item>
        <Grid.Item sm={4} direction="row" className="mt-32">
          <DatePicker
            label="Elegir Fecha/Valor"
            variant="inline"
            placeholder="Seleccionar fecha"
            value={nuevoAnaliticoData.fechaValor}
            onChangeStartDate={(e: any) => {
              handleChange(e, 'fechaValor');
            }}
            dateFormat="dd/MM/yyyy"
            divider
            popperPlacement="bottom-end"
            selectYears
            maxDate={new Date()}
            disabled={respuestaValida}
          />
        </Grid.Item>
      </Grid>
    </FormularioContainer>
  );

  const handleDisableFields = (field: string) => {
    // Verificar si el campo debe estar deshabilitado según la respuesta del backend
    return (
      respuestaInicial &&
      respuestaInicial[field] !== undefined &&
      !respuestaInicial[field]
    );
  };
  const FormularioIntermedio: JSX.Element = (
    <FormularioContainer>
      <Grid className="h-100 d-flex">
        <Grid.Item sm={3} direction="row" className="mt-32">
          <TextInput
            variant="inline"
            inputType="currency"
            thousandDelimiter="."
            decimalDelimiter=","
            label="Cotización"
            size="normal"
            value={nuevoAnaliticoIntermedioData.cotizacion}
            onChange={(e: any) => {
              handleChangeIntermedio(e.target.value, 'cotizacion');
            }}
            disabled={
              handleDisableFields('cotizacionVisible') || cotizacionVisible
            }
          />
        </Grid.Item>
        <Grid.Item sm={3} direction="row" className="mt-32">
          <SelectInput
            variant="inline"
            items={divisasMemo}
            initialValue={initialValueOptions}
            handlerBlur={(e: any) => handleChangeIntermedio(e.value, 'divisa')}
            label="Divisa"
            disabled={handleDisableFields('divisaVisible') || divisaVisible}
          />
        </Grid.Item>
        <Grid.Item sm={3} direction="row" className="mt-32">
          <TextInput
            variant="inline"
            inputType="currency"
            thousandDelimiter="."
            decimalDelimiter=","
            label="Importe"
            size="normal"
            value={nuevoAnaliticoIntermedioData.importe}
            onChange={(e: any) => {
              handleChangeIntermedio(e.target.value, 'importe');
            }}
            disabled={handleDisableFields('importeVisible') || importeVisible}
          />
        </Grid.Item>
        <Grid.Item sm={3} direction="row" className="mt-32">
          <TextInput
            variant="inline"
            inputType="text"
            label="Centro de Costo"
            size="normal"
            value={nuevoAnaliticoIntermedioData.centroCosto}
            onChange={(e: any) => {
              handleChangeIntermedio(e.target.value, 'centroCosto');
            }}
            disabled={handleDisableFields('centroCostoVisible') || costoVisible}
          />
        </Grid.Item>
      </Grid>
    </FormularioContainer>
  );

  return (
    <>
      <Modal active={props.isModalActive} customWidth="1300px">
        <Modal.Title
          iconCloseAction={() => {
            closeToggle();
          }}
          titleText="Nuevo Analítico"
        />
        <Modal.Body isStatic={!respuestaValida} customHeight={'100vh'}>
          <Container maxWidth="fluid">
            {FormularioInicial}

            {respuestaValida &&
              !respuestaInicial?.esGenerica &&
              FormularioIntermedio}
          </Container>
          {respuestaValida && respuestaInicial?.esGenerica && (
            <>
              <NuevoAnaliticoModalTable
                eventosContablesOriginales={eventosContablesOriginalList}
                eventosContables={eventosContablesList}
                setEventosContables={setEventosContablesList}
                setEventosContablesOriginales={setEventosContablesOriginalList}
              />
              <Textarea
                label="Observaciones"
                id="observaciones"
                value={observaciones}
                onChange={e => setObservaciones(e.target.value)}
              />
            </>
          )}
          {respuestaValida &&
            !respuestaInicial?.esGenerica &&
            renderTableSimular && (
              <>
                <NuevoAnaliticoModalTable
                  eventosContablesOriginales={eventosContablesOriginalList}
                  eventosContables={eventosContablesList}
                  setEventosContables={setEventosContablesList}
                  setEventosContablesOriginales={
                    setEventosContablesOriginalList
                  }
                />
                {props.isModalActive && (
                  <Textarea
                    label="Observaciones"
                    id="observaciones"
                    value={observaciones}
                    onChange={e => setObservaciones(e.target.value)}
                  />
                )}
              </>
            )}
        </Modal.Body>
        <Modal.Footer alingElement="flex-end">
          <Button
            size="small"
            onClick={() =>
              handleCargarContabilidad(
                setLoading,
                nuevoAnaliticoData,
                setEventosContablesList,
                setEventosContablesOriginalList,
                setMostrarTabla,
                setRespuestaInicial,
                setRespuestaValida,
                setCostoVisible,
                setImporteVisible,
                setDivisaVisible,
                setCotizacionVisible
              )
            }
            disabled={respuestaValida}
          >
            Cargar
          </Button>
          <div style={{ marginRight: '8px' }}></div>
          <Button
            size="small"
            onClick={() =>
              handleSimularContabilidad(
                setLoading,
                nuevoAnaliticoData,
                nuevoAnaliticoIntermedioData,
                setEventosContablesList,
                setEventosContablesOriginalList,
                setMostrarTabla,
                setRespuestaInicial,
                setRespuestaValida,
                setRenderTableSimular
              )
            }
            disabled={
              !respuestaValida || !validarSimular || esGenerica === 'generica'
            }
          >
            Simular
          </Button>
          <div style={{ marginRight: '8px' }}></div>
          <Button
            size="small"
            onClick={() =>
              handleGuardarContabilidad(
                setLoading,
                nuevoAnaliticoData,
                nuevoAnaliticoIntermedioData,
                eventosContablesList,
                observaciones,
                legajo,
                closeToggle,
                props.refreshTable,
                esGenerica
              )
            }
            disabled={!respuestaValida || !validarGuardar}
          >
            Guardar
          </Button>
        </Modal.Footer>
        {loading && <LoadingGalicia />}
      </Modal>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </>
  );
};
