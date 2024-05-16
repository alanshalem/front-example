import { useMsal } from '@azure/msal-react';
import {
  Body,
  Button,
  Container,
  Grid,
  Modal,
  SelectInput,
  TextInput,
} from '@brick/core';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import {
  getConceptosByIdPosVentaTipo,
  optionAplicacion,
  optionDevolucionCobro,
  optionMoneda,
  validarCamposCargar,
  validarCamposGuardar,
  validarSecuencia,
} from '@lib/helpers/Posventa.helpers';
import {
  getSolicitudesPosventaGenericas,
  postGuardarPosventaGenerica,
} from '@lib/services/Posventa/Posventa.services';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';
import { DataClientePosventaGenericaAuxiliar } from '@lib/types/Posventa/Posventa.types';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { createRadioButtonGroup } from './NuevaDevolucionGenericaModal.styles';
import { transformNumberString } from '@lib/utils/Numbers';

interface NuevaDevolucionGenerica {
  isModalActive: boolean;
  closeModal: () => void;
  setModel?: (evento: any) => void;
  refreshTable: () => void;
  setModalBoletos: any;
  setTipoMovimiento: any;
  setIdPosventaDetalle: any;
  setMontoImporte: any;
  setDivisaCuenta: any;
  setRefresh: any;
}

const NuevaDevolucionGenericaModal: React.FC<NuevaDevolucionGenerica> = ({
  isModalActive,
  closeModal,
  setModel,
  setModalBoletos,
  setIdPosventaDetalle,
  setDivisaCuenta,
  setMontoImporte,
  setTipoMovimiento,
  setRefresh,
}: NuevaDevolucionGenerica) => {
  const { accounts } = useMsal();
  const legajo = accounts[0].username.slice(0, 8);

  const initialStateDataClientePosventaGenericaAuxiliar: DataClientePosventaGenericaAuxiliar = {
    idPosVentaTipo: '',
    divisa: '',
    idAplicacion: '',
    nroOperacion: '',
    secuencia: '',
    idPosVentaParametria: '',
    cuit: '',
  };

  const [secuenciaValida, setSecuenciaValida] = useState<boolean>(false);
  const [errorSecuencia, setErrorSecuencia] = useState<boolean>(false);
  const [, setIsSelectInputEnabled] = useState(false);
  const [mensajeErrorSecuencia, setMensajeErrorSecuencia] = useState<string>(
    ''
  );
  const [nroOperacionValido] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [initialValue] = React.useState<any>({
    value: '',
    text: '',
  });

  const [respuestaValida, setRespuestaValida] = useState<boolean>(false);
  const [posventaGenericaAuxiliar, setPosventaGenericaAuxiliar] = useState<
    DataClientePosventaGenericaAuxiliar
  >(initialStateDataClientePosventaGenericaAuxiliar);

  const [itemsCuentasCliente, setItemsCuentasCliente] = React.useState<
    ItemDropdown[]
  >([]);
  const [conceptos, setConceptos] = useState<any>([]);
  const [nroOp, setNroOP] = useState('');

  const getDataCliente = () => {
    setLoading(true);

    const posVentaGetSolicitudesGenericDTO = {
      posVentaGetSolicitudesGenericDTO: posventaGenericaAuxiliar,
    };

    getSolicitudesPosventaGenericas(posVentaGetSolicitudesGenericDTO)
      .then((result: any) => {
        if (result.status.hasErrors === true) {
          toast.error(result.status.desc);
          return;
        }
        // Seteo la data faltante del usuario
        posventaGenericaAuxiliar.razonSocial = result.razonSocial;
        posventaGenericaAuxiliar.alicuota = result.alicuota;
        posventaGenericaAuxiliar.idPosVentaParametriaTipo =
          result.idPosVentaParametriaTipo;
        posventaGenericaAuxiliar.legajoCreacion = legajo;

        // Cargo las cuentas del cliente
        setItemsCuentasCliente(
          result.cuentas.map(cuenta => {
            return {
              text: `${cuenta.tipoCuenta} - ${cuenta.nroCuenta} - ${
                cuenta.divisa
              } ${cuenta.saldo || ''}`,
              value: cuenta.nroCuenta,
              sucursal: cuenta.sucursal,
            };
          })
        );

        setRespuestaValida(true);
        toast.success('Cliente válido');
      })
      .catch(() => {
        toast.error(
          'Se produjo algun error en la carga de los datos. Intenta nuevamente.'
        );
        setRespuestaValida(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    validarSecuencia(
      setMensajeErrorSecuencia,
      setSecuenciaValida,
      setErrorSecuencia,
      posventaGenericaAuxiliar.idAplicacion,
      posventaGenericaAuxiliar.secuencia,
      nroOp
    );
  }, [posventaGenericaAuxiliar]);

  const guardarPosventaGenerica = () => {
    setLoading(true);

    delete posventaGenericaAuxiliar.idAplicacion;
    delete posventaGenericaAuxiliar.idPosVentaParametria;

    posventaGenericaAuxiliar.monto = transformNumberString(
      posventaGenericaAuxiliar.monto
    );

    const posVentaCreateGenericDTO = {
      posVentaCreateGenericDTO: {
        ...posventaGenericaAuxiliar,
        idPosVentaTipo: Number(posventaGenericaAuxiliar.idPosVentaTipo),
      },
    };

    postGuardarPosventaGenerica(posVentaCreateGenericDTO)
      .then(result => {
        toast.success('Guardado correctamente');
        if (result.generaBoleto === true) {
          setIdPosventaDetalle(result.idPosVentaDetalle);
          setLoading(false);
          setDivisaCuenta(posventaGenericaAuxiliar.divisa);
          setMontoImporte(posventaGenericaAuxiliar.monto);
          setTipoMovimiento(result.estadoEnumTipoMoviento);
          setModalBoletos(true);
          closeToggle();
        } else {
          setLoading(false);
          closeToggle();
          setRefresh(true);
        }
      })
      .catch(() => {
        toast.error(
          'Se produjo algun error en la carga de los datos. Intenta nuevamente.'
        );
        setLoading(false);
      })
      .finally(() => {
        setRespuestaValida(false);
        delete posventaGenericaAuxiliar.alicuota;
        delete posventaGenericaAuxiliar.cuenta;
        delete posventaGenericaAuxiliar.monto;
        delete posventaGenericaAuxiliar.legajoCreacion;
        delete posventaGenericaAuxiliar.nroCuenta;
        delete posventaGenericaAuxiliar.sucursal;
      });
  };

  const closeToggle = () => {
    setPosventaGenericaAuxiliar(
      initialStateDataClientePosventaGenericaAuxiliar
    );
    setRespuestaValida(false);
    setSecuenciaValida(false);
    setErrorSecuencia(false);
    setMensajeErrorSecuencia('');
    setIsSelectInputEnabled(false);
    setModel?.(undefined);
    closeModal();
  };

  // Función para manejar cambios en los TextInput
  const handleChange = (value: string | any, field: string) => {
    setPosventaGenericaAuxiliar(prevState => ({
      ...prevState,
      [field]: value,
    }));

    let nroOpAux = '';
    if (
      field === 'nroOperacion' ||
      field === 'idAplicacion' ||
      field === 'idPosVentaTipo'
    ) {
      if (field === 'nroOperacion') {
        setNroOP(value);
        nroOpAux = value;
        // Chequeamos que nroOperacion tenga el formato esperado 0NNNNNN
        const regexT = /^[Tt]\d{6}$/;
        const regexO = /^[Oo]\d{6}$/;

        const isFormatTValid = regexT.test(nroOpAux);
        const isFormatOValid = regexO.test(nroOpAux);

        if (isFormatTValid) {
          setPosventaGenericaAuxiliar(prevState => ({
            ...prevState,
            secuencia: '000',
          }));
        } else if (isFormatOValid) {
          // Si el formato es valido, seteamos secuencia a '001'
          setPosventaGenericaAuxiliar(prevState => ({
            ...prevState,
            secuencia: '001',
          }));
        } else {
          // Si el formato no es valido, reseteamos secuencia
          setPosventaGenericaAuxiliar(prevState => ({
            ...prevState,
            secuencia: '',
          }));
        }
      }
      const areFieldsFilled =
        nroOpAux !== '' &&
        nroOpAux.length === 7 &&
        posventaGenericaAuxiliar.idAplicacion !== '';

      // Habilitamos o deshabilitamos el SelectInput segun la condicion
      setIsSelectInputEnabled(areFieldsFilled);
      if (areFieldsFilled) {
        getConceptosByIdPosVentaTipo(
          nroOpAux,
          posventaGenericaAuxiliar.idAplicacion,
          posventaGenericaAuxiliar.idPosVentaTipo,
          true,
          setLoading,
          setConceptos
        );
      }
    }

    if (field === 'idAplicacion' && value === '1') {
      posventaGenericaAuxiliar.secuencia = '000';
      setErrorSecuencia(false);
      setMensajeErrorSecuencia('');
    } else if (field === 'nroCuenta') {
      // Obtener la cuenta correspondiente al valor seleccionado
      const selectedCuenta = itemsCuentasCliente.find(
        cuenta => cuenta.value === value
      );

      posventaGenericaAuxiliar.nroCuenta = value;

      if (selectedCuenta) {
        // Setear 'tipoCuenta' con el valor de cuenta.tipoCuenta
        handleChange(selectedCuenta.text.split(' ')[0], 'tipoCuenta');
        handleChange(selectedCuenta.sucursal, 'sucursal');
        posventaGenericaAuxiliar.tipoCuenta = selectedCuenta.text.split(' ')[0];
        posventaGenericaAuxiliar.sucursal = selectedCuenta.sucursal;
      }
    }
  };

  const handleRadioChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    opcion: string
  ) => {
    const value = e.target.value;
    if (opcion === 'idAplicacion') {
      posventaGenericaAuxiliar.idAplicacion = value;
    }
    if (opcion === 'divisa') {
      posventaGenericaAuxiliar.divisa = value;
    }
    if (opcion === 'idPosVentaTipo') {
      posventaGenericaAuxiliar.idPosVentaTipo = value;
    }
    handleChange(value, opcion);
  };

  return (
    <>
      <Modal active={isModalActive} customWidth="1300px">
        <Modal.Title
          iconCloseAction={() => {
            closeToggle();
          }}
          titleText="Nueva Devolución/Cobro Genérico"
        />
        <Modal.Body isStatic>
          <Container maxWidth="fluid">
            <Grid justify="center" alignContent="center">
              <Grid.Item xs={4}>
                {/* DEVOLUCION/COBRO */}
                <Body element="p" variant="h3">
                  Devolucion/Cobro:
                </Body>
                {createRadioButtonGroup(
                  posventaGenericaAuxiliar.idPosVentaTipo,
                  optionDevolucionCobro,
                  handleRadioChange,
                  'idPosVentaTipo',
                  respuestaValida
                )}
              </Grid.Item>
              <Grid.Item xs={4}>
                {/* MONEDA */}
                <Body element={'p'} variant={'s5'}>
                  Moneda
                </Body>
                {createRadioButtonGroup(
                  posventaGenericaAuxiliar.divisa,
                  optionMoneda,
                  handleRadioChange,
                  'divisa',
                  respuestaValida
                )}
              </Grid.Item>
              <Grid.Item xs={4}>
                {/* APLICACION */}
                <Body element={'p'} variant={'s5'}>
                  Aplicacion
                </Body>
                {createRadioButtonGroup(
                  posventaGenericaAuxiliar.idAplicacion,
                  optionAplicacion,
                  handleRadioChange,
                  'idAplicacion',
                  respuestaValida
                )}
              </Grid.Item>
            </Grid>
            <Grid justify="center" alignContent="center">
              <Grid.Item xs={6}>
                {/* OPERACION */}
                <TextInput
                  id="nroOperacion"
                  label="Numero de Operación"
                  placeholder="Ingrese Numero de Operacion"
                  value={posventaGenericaAuxiliar.nroOperacion}
                  onChange={(e: any) => {
                    handleChange(e.target.value, 'nroOperacion');
                  }}
                  success={nroOperacionValido}
                  disabled={respuestaValida}
                />
              </Grid.Item>
              <Grid.Item xs={6}>
                {' '}
                <TextInput
                  id="secuencia"
                  label="Numero de Secuencia"
                  placeholder="Ingrese Numero de Secuencia"
                  value={posventaGenericaAuxiliar.secuencia}
                  onChange={(e: any) => {
                    handleChange(e.target.value, 'secuencia');
                    validarSecuencia(
                      setMensajeErrorSecuencia,
                      setSecuenciaValida,
                      setErrorSecuencia,
                      posventaGenericaAuxiliar.idAplicacion,
                      e.target.value,
                      posventaGenericaAuxiliar.nroOperacion
                    );
                  }}
                  error={errorSecuencia}
                  success={secuenciaValida}
                  message={mensajeErrorSecuencia}
                  disabled={respuestaValida}
                />
              </Grid.Item>
            </Grid>
            <Grid>
              {/* Evento */}
              <Grid.Item sm={3} className="mb-24">
                <SelectInput
                  variant="inline"
                  items={conceptos}
                  initialValue={initialValue}
                  handlerBlur={(e: any) =>
                    handleChange(e.value, 'idPosVentaParametria')
                  }
                  label="Evento"
                  disabled={respuestaValida}
                />
              </Grid.Item>
              <Grid.Item sm={3} className="mb-24">
                <TextInput
                  size="normal"
                  label="CUIT"
                  maxLength={11}
                  value={posventaGenericaAuxiliar.cuit}
                  onChange={e => {
                    const re = /^[0-9\b]+$/;
                    if (e.target.value === '' || re.test(e.target.value)) {
                      handleChange(e.target.value, 'cuit');
                    }
                  }}
                  disabled={respuestaValida}
                />
              </Grid.Item>
            </Grid>
            {/* INFORMACION DEL USUARIO SEGUN EL CUIL */}
            {respuestaValida && (
              <Grid justify="center" alignContent="center">
                <Grid.Item xs={4}>
                  <Body element={'p'} variant="s2">
                    {`${posventaGenericaAuxiliar.razonSocial}`}
                  </Body>
                </Grid.Item>
                {/* CUENTAS */}
                <Grid.Item xs={4}>
                  <SelectInput
                    variant="inline"
                    items={itemsCuentasCliente}
                    initialValue={initialValue}
                    handlerBlur={(e: any) => {
                      handleChange(e.value, 'nroCuenta');
                    }}
                    label="Cuentas"
                  />
                </Grid.Item>
                {/* Monto */}
                <Grid.Item sm={3} className="mb-24">
                  <TextInput
                    size="normal"
                    label="Monto"
                    value={posventaGenericaAuxiliar.monto}
                    inputType="currency"
                    onChange={(e: any) => {
                      handleChange(e.target.value, 'monto');
                    }}
                    thousandDelimiter="."
                    decimalDelimiter=","
                  />
                </Grid.Item>
              </Grid>
            )}
          </Container>
        </Modal.Body>
        <Modal.Footer alingElement="flex-end">
          <Button
            size="small"
            onClick={() => {
              getDataCliente();
            }}
            disabled={
              !validarCamposCargar(posventaGenericaAuxiliar) || respuestaValida
            } // Deshabilitar el botón si los campos no están completos
          >
            Cargar
          </Button>
          <div style={{ marginRight: '8px' }}></div>

          <Button
            size="small"
            onClick={() => {
              guardarPosventaGenerica();
              setPosventaGenericaAuxiliar(
                initialStateDataClientePosventaGenericaAuxiliar
              );
            }}
            disabled={
              !validarCamposGuardar(posventaGenericaAuxiliar) ||
              !respuestaValida
            } // Deshabilitar el botón si los campos no están completos
          >
            Guardar
          </Button>

          <div style={{ marginRight: '8px' }}></div>
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

export default NuevaDevolucionGenericaModal;
