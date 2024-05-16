/* eslint-disable react-hooks/exhaustive-deps */
// @ts-ignore
import { useMsal } from '@azure/msal-react';
import {
  Button,
  Container,
  Grid,
  Modal,
  SelectInput,
  TextInput,
  Typography,
} from '@brick/core';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import OverviewContext from '@contexts/Overview';
import {
  buildPosventaTipoInitialValueList,
  formatNumber,
  getDivisaFromCuenta,
  handleGuardarPosventa,
  handleSearchNroOperacionSecuenciaIdPosVentaTipo,
  validarCamposCargarNuevaDevolucionModal,
  validarCamposGuardarNuevaDevolucionModal,
} from '@lib/helpers/Posventa.helpers';
import {
  DataCliente,
  DataClienteNuevaPosventaAuxiliar,
  PosVentaDetalle,
} from '@lib/types/Posventa/Posventa.types';
import React, { useContext, useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { ImpuestosTable } from './ImpuestosTable';
import SeleccionConceptoModal from './SeleccionConceptoModal';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';
import NuevoConceptoTable from './NuevoConcepto/NuevoConceptoTable';

interface NuevaDevolucion {
  isModalActive: boolean;
  closeModal: () => void;
  refreshTable: () => void;
}

export const NuevaDevolucionModal: React.FC<NuevaDevolucion> = (
  props: NuevaDevolucion
) => {
  const initialState: DataCliente = {
    nroOperacion: '',
    razonSocial: '',
    cuit: null,
    divisa: '',
    monto: null,
    codigoConcepto: '',
    tipoDeCambio: 0,
    cuentaDebitoComisiones: {
      divisa: null,
      nroCuenta: null,
      sucursal: '',
      tipoCuenta: '',
    },
    cuentaDebitoTransferencia: {
      divisa: null,
      nroCuenta: null,
      sucursal: '',
      tipoCuenta: '',
    },
    posVentaDetalle: [],
  };

  const initialStateNuevaPosventaAuxiliar: DataClienteNuevaPosventaAuxiliar = {
    idPosVentaTipo: '',
    nroOperacion: '',
    secuencia: '',
  };

  const [nuevaPosventaAuxiliar, setNuevaPosventaAuxiliar] = useState<
    DataClienteNuevaPosventaAuxiliar
  >(initialStateNuevaPosventaAuxiliar);

  const [nroOperacion, setNroOperacion] = useState<string>('');

  const [nroOperacionValido, setNroOperacionValido] = useState<boolean>(false);
  const [errorNroOperacion, setErrorNroOperacion] = useState<boolean>(false);
  const [itemsPosventaTipo, setItemsPosventaTipo] = React.useState<
    ItemDropdown[]
  >([]);
  const [dataCliente, setDataCliente] = useState<DataCliente>(initialState);
  const [dataClientePosVentaDetalle, setDataClientePosVentaDetalle] = useState<
    PosVentaDetalle[]
  >([]);
  const [mensajeError, setMensajeError] = useState<string>('');
  const [loading, setLoading] = useState<boolean | null>(null);
  const [respuestaValida, setRespuestaValida] = useState<boolean>(false);

  const [impuestosADevolver, setImpuestosADevolver] = useState<any[]>([]);

  const [esReversa, setEsReversa] = useState<boolean>(false);

  const [nuevoConceptoModal, setNuevoConceptoModal] = useState<boolean>(false);
  const { accounts } = useMsal();
  const legajo = accounts[0].username.slice(0, 8);

  const { tiposPosventa } = useContext(OverviewContext);

  const [selectedConcepts, setSelectedConcepts] = useState<any[]>([]);

  const [idPosVentaTipo, setIdPosVentaTipo] = useState<number>(null);

  const [isFormatting, setIsFormatting] = useState(false);

  const handleFormattingStart = () => {
    setIsFormatting(true);
  };

  const handleFormattingEnd = () => {
    setIsFormatting(false);
  };

  const handleSelectConcepto = (selectedConcept: any) => {
    const conceptExists = selectedConcepts.some(
      concept => concept.concepto === selectedConcept.nombre
    );
    if (!conceptExists) {
      const newConcepto = {
        concepto: selectedConcept.nombre,
        divisa: getDivisaFromCuenta(
          selectedConcept.cuenta,
          dataCliente.cuentaDebitoComisiones.divisa,
          dataCliente.cuentaDebitoTransferencia.divisa
        ),
        idPosVentaTipo: nuevaPosventaAuxiliar.idPosVentaTipo,
        idPosVentaParametria: selectedConcept.id,
        esCobro: selectedConcept.esCobro,
        esDevolucion: selectedConcept.esDevolucion,
      };

      setSelectedConcepts(prevSelectedConcepts => [
        ...prevSelectedConcepts,
        newConcepto,
      ]);

      toast.success('Concepto agregado correctamente.');
    } else {
      toast.error('Concepto Duplicado.');
    }
  };

  useEffect(() => {
    setItemsPosventaTipo(buildPosventaTipoInitialValueList(tiposPosventa));
  }, [tiposPosventa]);

  useEffect(() => {
    setImpuestosADevolver([]);
  }, [props.isModalActive, nroOperacion]);

  // Función para manejar cambios en los Input
  const handleChange = (value: string | any, field: string) => {
    setNuevaPosventaAuxiliar(() => {
      // Si el campo es 'idPosVentaTipo', updateamos el state y seteamos esReversa de manera acorde
      if (field === 'idPosVentaTipo') {
        setIdPosVentaTipo(value);
      }
      if (field === 'idPosVentaTipo' && value === 4) {
        setEsReversa(true);
      } else if (field === 'idPosVentaTipo' && value !== 4) {
        setEsReversa(false);
      }

      // Si el campo es nroOperacion
      if (field === 'nroOperacion') {
        // Convertimos el valor a mayusculas y le removemos los espacios
        const operacionValue = value.toUpperCase().trim();

        const regexT = /^[Tt]\d{6}$/;
        const regexO = /^[Oo]\d{6}$/;

        const isFormatTValid = regexT.test(operacionValue);
        const isFormatOValid = regexO.test(operacionValue);

        if (isFormatTValid) {
          // Si el formato es TNNNNNN seteamos secuencia a 000
          return {
            ...nuevaPosventaAuxiliar,
            [field]: value,
            ['secuencia']: '000',
          };
        } else if (isFormatOValid) {
          // Si el formato es ONNNNNN seteamos secuencia a 001
          return {
            ...nuevaPosventaAuxiliar,
            [field]: value,
            ['secuencia']: '001',
          };
        }
      }
      return {
        ...nuevaPosventaAuxiliar,
        [field]: value,
      };
    });
  };

  const handleImpuestoData = (data: any) => {
    //Agrego concepto nuevo
    if (data.montoADevolver === '' && data.montoACobrar === 0) {
      //Elimino el concepto
      setImpuestosADevolver(prevImpuestos => {
        // Filtramos los que tengan el mismo concepto
        const impuestosFiltrados = prevImpuestos.filter(
          concepto => concepto.index !== data.index
        );
        return [...impuestosFiltrados];
      });
    } else {
      setImpuestosADevolver(prevImpuestos => {
        // Filtramos los que tengan el mismo concepto
        let impuestosFiltrados = Array.isArray(prevImpuestos)
          ? prevImpuestos.filter(concepto => concepto.index !== data.index)
          : [];

        return [...impuestosFiltrados, data];
      });
    }
  };

  const getDataCliente = async () => {
    setLoading(true);

    handleSearchNroOperacionSecuenciaIdPosVentaTipo(nuevaPosventaAuxiliar)
      .then((result: any) => {
        if (result.status.statusCode === 500) {
          toast.error(result.status.desc);
          setRespuestaValida(false);
          setNroOperacionValido(false);
        } else {
          setDataCliente(result);
          setDataClientePosVentaDetalle(result.posVentaDetalle);
          setRespuestaValida(true);
          setNroOperacionValido(true);
          toast.success(result.status.desc);
        }
      })
      .catch(() => {
        toast.error(
          'Se produjo algun error en la carga de los datos. Intenta nuevamente.'
        );
        setRespuestaValida(false);
        setNroOperacionValido(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const validacionGuardarNormal = () => {
    return (
      !validarCamposGuardarNuevaDevolucionModal(nuevaPosventaAuxiliar) ||
      !respuestaValida ||
      !nroOperacionValido
    );
  };

  const guardarPosventa = async () => {
    handleGuardarPosventa(
      dataCliente,
      dataClientePosVentaDetalle,
      impuestosADevolver,
      legajo,
      idPosVentaTipo,
      nuevaPosventaAuxiliar.secuencia,
      setLoading,
      closeToggle,
      props.refreshTable
    );
  };

  const closeToggle = () => {
    setEsReversa(false);
    setNroOperacion('');
    setNroOperacionValido(false);
    setDataCliente(initialState);
    setErrorNroOperacion(false);
    setMensajeError('');
    setImpuestosADevolver([]);
    setSelectedConcepts([]);
    setLoading(false);
    setNuevaPosventaAuxiliar(initialStateNuevaPosventaAuxiliar);
    setRespuestaValida(false);
    setIdPosVentaTipo(null);
    props.closeModal();
  };

  return (
    <>
      <Modal active={props.isModalActive} customWidth="1300px">
        <Modal.Title
          iconCloseAction={() => {
            closeToggle();
          }}
          titleText="Nueva"
        />
        <Modal.Body isStatic={!respuestaValida} customHeight={'90vh'}>
          <Container maxWidth="fluid">
            <Grid>
              <Grid.Item xs={4} direction="row" className="mt-32">
                <TextInput
                  id="nroOperacion"
                  label="Numero de Operación*"
                  placeholder="Ingrese Numero de Operacion"
                  maxLength={7}
                  value={nuevaPosventaAuxiliar.nroOperacion}
                  onChange={(e: any) =>
                    handleChange(e.target.value, 'nroOperacion')
                  }
                  error={errorNroOperacion}
                  success={nroOperacionValido}
                  message={mensajeError}
                  disabled={respuestaValida}
                />
              </Grid.Item>
              <Grid.Item xs={4} direction="row" className="mt-32">
                <TextInput
                  id="secuencia"
                  label="Numero de Secuencia*"
                  placeholder="Ingrese Numero de Secuencia"
                  maxLength={3}
                  value={nuevaPosventaAuxiliar.secuencia}
                  onChange={(e: any) => {
                    handleChange(e.target.value, 'secuencia');
                  }}
                  disabled={respuestaValida}
                />
              </Grid.Item>

              <Grid.Item xs={4} direction="row" className="mt-32">
                {props.isModalActive && (
                  <SelectInput
                    variant="inline"
                    items={itemsPosventaTipo}
                    handlerBlur={(e: any) => {
                      handleChange(e.value, 'idPosVentaTipo');
                    }}
                    label="Tipo de Posventa*"
                    disabled={respuestaValida}
                  />
                )}
              </Grid.Item>
            </Grid>
            {respuestaValida ? (
              <>
                <Grid className={`mb-20`}>
                  <Grid.Item sm={10} direction="row" className="mt-20 mb-20">
                    <Typography variant="s2" bold>
                      Información del cliente
                    </Typography>
                  </Grid.Item>
                  <Grid.Item sm={3} direction="row" className="mt-12">
                    <Typography variant="s4">
                      Razon Social: {dataCliente.razonSocial}
                    </Typography>
                  </Grid.Item>
                  <Grid.Item sm={3} direction="row" className="mt-12">
                    <Typography variant="s4">
                      Cuit: {dataCliente.cuit}
                    </Typography>
                  </Grid.Item>
                  <Grid.Item sm={3} direction="row" className="mt-12">
                    <Typography variant="s4">
                      Divisa: {dataCliente.divisa}
                    </Typography>
                  </Grid.Item>
                  <Grid.Item sm={3} direction="row" className="mt-12">
                    <Typography variant="s4">
                      Monto:{' '}
                      {dataCliente.monto !== null &&
                      dataCliente.monto !== undefined
                        ? formatNumber(dataCliente.monto)
                        : 'N/A'}{' '}
                    </Typography>
                  </Grid.Item>
                  <Grid.Item sm={3} direction="row" className="mt-12">
                    <Typography variant="s4">
                      Codigo concepto: {dataCliente.codigoConcepto}
                    </Typography>
                  </Grid.Item>
                  <Grid.Item sm={3} direction="row" className="mt-12">
                    <Typography variant="s4">
                      Cuenta debito comisiones:{' '}
                      {dataCliente.cuentaDebitoComisiones.divisa}{' '}
                      {dataCliente.cuentaDebitoComisiones.nroCuenta}{' '}
                      {dataCliente.cuentaDebitoComisiones.tipoCuenta}{' '}
                      {dataCliente.cuentaDebitoComisiones.sucursal}
                    </Typography>
                  </Grid.Item>
                  <Grid.Item sm={3} direction="row" className="mt-12">
                    <Typography variant="s4">
                      Cuenta debito transferencia:{' '}
                      {dataCliente.cuentaDebitoTransferencia.divisa}{' '}
                      {dataCliente.cuentaDebitoTransferencia.nroCuenta}{' '}
                      {dataCliente.cuentaDebitoTransferencia.tipoCuenta}{' '}
                      {dataCliente.cuentaDebitoTransferencia.sucursal}
                    </Typography>
                  </Grid.Item>
                </Grid>
                <Grid>
                  <Grid.Item sm={9} direction="row" className="mt-20 mb-20">
                    <Typography variant="s2" bold>
                      Conceptos
                    </Typography>
                  </Grid.Item>
                  <ImpuestosTable
                    datosImpuestos={dataClientePosVentaDetalle}
                    handleImpuestoData={handleImpuestoData}
                    onFormattingStart={handleFormattingStart}
                    onFormattingEnd={handleFormattingEnd}
                  />
                  {idPosVentaTipo === 2 && (
                    <>
                      <Grid.Item sm={9} direction="row" className="mt-20 mb-20">
                        <Typography variant="s2" bold>
                          Conceptos Agregados
                        </Typography>{' '}
                      </Grid.Item>
                      <NuevoConceptoTable
                        montoCliente={dataCliente.monto}
                        datosImpuestos={dataClientePosVentaDetalle}
                        handleImpuestoData={handleImpuestoData}
                        selectedConcepts={selectedConcepts}
                        setSelectedConcepts={setSelectedConcepts}
                        impuestosADevolver={impuestosADevolver}
                        setImpuestosADevolver={setImpuestosADevolver}
                        onFormattingStart={handleFormattingStart}
                        onFormattingEnd={handleFormattingEnd}
                      />
                    </>
                  )}
                </Grid>
                {idPosVentaTipo === 2 && (
                  <Button
                    size="small"
                    onClick={() => {
                      setNuevoConceptoModal(true);
                    }}
                    disabled={!respuestaValida}
                  >
                    Agregar Concepto
                  </Button>
                )}
              </>
            ) : null}
            {loading && <LoadingGalicia />}
          </Container>
        </Modal.Body>
        <Modal.Footer alingElement="flex-end">
          <Button
            size="small"
            onClick={() => {
              getDataCliente();
            }}
            disabled={
              !validarCamposCargarNuevaDevolucionModal(nuevaPosventaAuxiliar) ||
              respuestaValida
            } // Deshabilitar el botón si los campos no están completos
          >
            Cargar
          </Button>
          <div style={{ marginRight: '8px' }}></div>
          <Button
            size="small"
            onClick={() => {
              guardarPosventa();
              // setNuevaPosventaAuxiliar(initialStateNuevaPosventaAuxiliar);
            }}
            disabled={
              esReversa
                ? !respuestaValida || isFormatting
                : validacionGuardarNormal() || isFormatting
            }
          >
            Guardar
          </Button>
        </Modal.Footer>
        <SeleccionConceptoModal
          nroOperacion={nuevaPosventaAuxiliar.nroOperacion}
          idAplicacion={1}
          idPosVentaTipo={nuevaPosventaAuxiliar.idPosVentaTipo}
          isOpen={nuevoConceptoModal}
          closeModal={() => setNuevoConceptoModal(false)}
          onSelectConcepto={handleSelectConcepto}
          selectedConcepts={selectedConcepts}
          datosImpuestos={dataClientePosVentaDetalle}
        />
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
