import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Button,
  Container,
  Grid,
  Modal,
  SelectInput,
  TextInput,
} from '@brick/core';
import { BoletoPosventaModal } from '@lib/types/Posventa/Posventa.types';
import OverviewContext from '@contexts/Overview';
import {
  buildCorresponsalDivisaInitialValueFilter,
  buildCorresponsalDivisaList,
} from '@lib/helpers/Corresponsal.helpers';
import { Corresponsal } from '@lib/types/Corresponsal/Corresponsa.types';
import {
  guardarBoletoPosventaGenerica,
  validarBoletoPosventaGenerica,
} from '@lib/services/Posventa/Posventa.services';
import { toastCallAux } from '@components/Toast/Toast.helpers';
import { validarCamposNulos } from '@lib/utils/Objetos';

import { useMsal } from '@azure/msal-react';
import {
  convertStringANumberDecimal,
  formatNumberForInput,
  transformNumberForTextInput,
} from '@lib/utils/Importe';
import { CustomTextInputCotizacion } from '@components/Inputs/CustomTextInputCotizacion';

interface PosventaModalBoletosProps {
  isModalActive: boolean;
  closeModal: () => void;
  idPosventaDetalle: number;
  montoImporte: number;
  divisaCuenta: string;
  setMontoImporte: any;
  setDivisaCuenta: any;
  setTipoMovimiento: any;
  tipoMovimiento: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const inititalStateFilterModal: BoletoPosventaModal = {
  nroBoleto: '',
  cotizacionCompra: '',
  cotizacionVenta: '',
  idCorresponsal: '',
  divisa: '',
  importe: '',
};

export const PosventaModalBoletos: React.FC<PosventaModalBoletosProps> = (
  props: PosventaModalBoletosProps
) => {
  const estadosContext = useContext(OverviewContext);

  const [initialValue, setInitialValue] = useState<any>({});
  const [filtroBoletoPosventa, setFiltroBoletoPosventa] = useState<
    BoletoPosventaModal
  >(inititalStateFilterModal);
  const [saveGuardar, setSaveGuardar] = useState<boolean>(false);
  const [montoCuenta, setMontoCuenta] = useState<number | null>(null);
  const [divisaCorresponsal, setDivisaCorresponsal] = useState<string>('');
  const { accounts } = useMsal();
  const [legajoCreacion] = accounts[0].username.split('@');

  const corresponsalDivisaMemo = React.useMemo(() => {
    return buildCorresponsalDivisaList(estadosContext.tiposCorresponsal);
  }, [estadosContext.tiposCorresponsal]);

  const closeToogle = () => {
    props.closeModal();
    setFiltroBoletoPosventa(inititalStateFilterModal);
    setMontoCuenta(null);
    setSaveGuardar(false);
    props.setDivisaCuenta(null);
    props.setMontoImporte(null);
    setDivisaCorresponsal(null);
  };

  const handleChange = (value: any, field: string) => {
    setFiltroBoletoPosventa(prevModal => ({
      ...prevModal,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (
      filtroBoletoPosventa.idCorresponsal === '' ||
      filtroBoletoPosventa.idCorresponsal === ' '
    ) {
      setInitialValue(
        buildCorresponsalDivisaInitialValueFilter(
          estadosContext.tiposCorresponsal?.find(
            (e: Corresponsal) =>
              filtroBoletoPosventa.idCorresponsal === e.corresponsalDivisa
          )
        )
      );
    }
  }, [filtroBoletoPosventa.idCorresponsal]);

  const handleDebounce = useCallback(
    (value: string, field: string) => {
      let newValue = value;

      const decimalCount = value.split(/[.,]/).length - 1;

      if (decimalCount > 1) {
        // Si hay más de un punto o coma, no se actualiza el valor
        return;
      }

      const decimalIndex =
        value.indexOf('.') !== -1 ? value.indexOf('.') : value.indexOf(',');

      if (decimalIndex !== -1) {
        const decimals = value.substring(decimalIndex + 1);

        // Limita a 8 decimales después del punto o coma
        if (decimals.length > 8) {
          newValue = value.substring(0, decimalIndex + 9);
        }
      }

      // Reemplaza el punto por una coma
      newValue = newValue.replace('.', ',');

      setFiltroBoletoPosventa(prevModal => ({
        ...prevModal,
        [field]: newValue,
      }));
    },
    [setFiltroBoletoPosventa]
  );

  const handleValidar = () => {
    const body = {
      boletoStock: {
        ...filtroBoletoPosventa,
        importe: convertStringANumberDecimal(filtroBoletoPosventa.importe),
        cotizacionCompra: filtroBoletoPosventa.cotizacionCompra
          ? Number(filtroBoletoPosventa.cotizacionCompra.replace(',', '.'))
          : null,
        cotizacionVenta: Number(
          filtroBoletoPosventa.cotizacionVenta.replace(',', '.')
        ),
        divisaCuenta: props.divisaCuenta,
        divisaCorresponsal: divisaCorresponsal,
        estadoEnumTipoMoviento: props.tipoMovimiento,
      },
    };
    delete body.boletoStock.divisa
    delete body.boletoStock.idCorresponsal;
    
    // devolucion
    if (props.divisaCuenta === 'ARS' && props.tipoMovimiento === 2) {
      delete body.boletoStock.cotizacionCompra
    }

    // cobro
    if (props.divisaCuenta === 'ARS' && props.tipoMovimiento === 1) {
      delete body.boletoStock.cotizacionVenta
    }

    if (validarCamposNulos(body.boletoStock)) {
      toastCallAux('Hay campos vacios', false);
    } else {
      validarBoletoPosventaGenerica(body)
        .then(result => {
          setMontoCuenta(result.montoCuenta);
          setSaveGuardar(true);
          toastCallAux('Se valido con exito', true);
        })
        .catch(error => {
          toastCallAux(
            error.response.data.errors[0].message.message || 'Error al validar',
            false
          );
        });
    }
  };

  const handleGuardar = () => {
    const body = {
      boletoStock: {
        ...filtroBoletoPosventa,
        idCorresponsal: filtroBoletoPosventa.idCorresponsal.toString(),
        importe: convertStringANumberDecimal(montoCuenta),
        idPosVentaDetalle: props.idPosventaDetalle,
        legajoCreacion: legajoCreacion,
        cotizacionVenta: filtroBoletoPosventa.cotizacionVenta
          ? Number(filtroBoletoPosventa.cotizacionVenta.replace(',', '.'))
          : null,
        cotizacionCompra: filtroBoletoPosventa.cotizacionCompra
          ? Number(filtroBoletoPosventa.cotizacionCompra.replace(',', '.'))
          : null,
        divisa: divisaCorresponsal,
      },
    };

    if (props.divisaCuenta === 'ARS' && props.tipoMovimiento === 2) {
      delete body.boletoStock.cotizacionCompra
    }

    if (props.divisaCuenta === 'ARS' && props.tipoMovimiento === 1) {
      delete body.boletoStock.cotizacionVenta
    }

    if (validarCamposNulos(body.boletoStock)) {
      toastCallAux('Hay campos vacios', false);
    } else {
      guardarBoletoPosventaGenerica(body)
        .then(() => {
          toastCallAux('Guardado con exito', true);
          setMontoCuenta(null);
          closeToogle();
          props.setRefresh(true);
        })
        .catch(error => {
          toastCallAux(
            error.response.data.errors[0].message.message || 'Error al validar',
            false
          );
        });
    }
  };

  useEffect(() => {
    if (props.montoImporte) {
      setFiltroBoletoPosventa({
        ...filtroBoletoPosventa,
        importe: transformNumberForTextInput(props.montoImporte),
      });
    }
  }, [props.montoImporte]);

  return (
    <>
      <Modal active={props.isModalActive} customWidth="1300px">
        <Modal.Title
          iconCloseAction={() => closeToogle()}
          titleText="Cargar Boleto"
        ></Modal.Title>
        <Modal.Body isStatic>
          <Container maxWidth>
            <Grid spacing={12} style={{ marginTop: '20px' }}>
              {/* Nro Boleto */}
              <Grid.Item sm={4}>
                <TextInput
                  label="Nro Boleto"
                  value={filtroBoletoPosventa.nroBoleto}
                  onChange={e => {
                    handleChange(e.target.value, 'nroBoleto');
                  }}
                  placeholder="Nro Boleto"
                  disabled={montoCuenta ? true : false}
                />
              </Grid.Item>

              {/* Importe */}
              <Grid.Item sm={4}>
                <TextInput
                  label="Importe"
                  value={filtroBoletoPosventa.importe}
                  maxLength={16}
                  placeholder="Importe"
                  inputType="currency"
                  onChange={e => {
                    handleChange(e.target.value, 'importe');
                  }}
                />
              </Grid.Item>
              <Grid.Item sm={4}>
                <SelectInput
                  variant="inline"
                  items={corresponsalDivisaMemo}
                  handlerBlur={(e: any) => {
                    handleChange(e.label, 'idCorresponsal');
                    setDivisaCorresponsal(e.nombre);
                  }}
                  label="Corresponsal Divisa"
                  placeholder="Corresponsal Divisa"
                  initialValue={initialValue}
                  disabled={montoCuenta ? true : false}
                  cleanButton={true}
                  onClean={() => handleChange('', 'idCorresponsal')}
                />
              </Grid.Item>
              {/* COBRO */}
              {props.tipoMovimiento === 2 && (
                <Grid.Item sm={4}>
                  <CustomTextInputCotizacion
                    handleDebounce={handleDebounce}
                    cotizacion={filtroBoletoPosventa.cotizacionCompra}
                    field="cotizacionCompra"
                    label="Cotización Compra"
                    esDisabled={props.divisaCuenta === 'ARS' ? true : false}
                  />
                </Grid.Item>
              )}
              {props.tipoMovimiento === 2 && (
                <Grid.Item sm={4}>
                  <CustomTextInputCotizacion
                    handleDebounce={handleDebounce}
                    cotizacion={filtroBoletoPosventa.cotizacionVenta}
                    field="cotizacionVenta"
                    label="Cotización Venta"
                    esDisabled={montoCuenta ? true : false}
                  />
                </Grid.Item>
              )}
              {/* Devolucion */}
              {props.tipoMovimiento === 1 && (
                <Grid.Item sm={4}>
                  <CustomTextInputCotizacion
                    handleDebounce={handleDebounce}
                    cotizacion={filtroBoletoPosventa.cotizacionVenta}
                    field="cotizacionVenta"
                    label="Cotización Venta"
                    esDisabled={props.divisaCuenta === 'ARS' ? true : false}
                  />
                </Grid.Item>
              )}
              {props.tipoMovimiento === 1 && (
                <Grid.Item sm={4}>
                  <CustomTextInputCotizacion
                    handleDebounce={handleDebounce}
                    cotizacion={filtroBoletoPosventa.cotizacionCompra}
                    field="cotizacionCompra"
                    label="Cotización Compra"
                    esDisabled={montoCuenta ? true : false}
                  />
                </Grid.Item>
              )}
              {montoCuenta && (
                <Grid.Item sm={4}>
                  <TextInput
                    variant="inline"
                    value={formatNumberForInput(montoCuenta)}
                    label="Monto Cuenta"
                    placeholder="Monto Cuenta"
                    disabled={true}
                  />
                </Grid.Item>
              )}
            </Grid>
          </Container>
        </Modal.Body>
        <Modal.Footer alingElement="flex-end">
          <div style={{ marginRight: '8px' }}></div>
          {saveGuardar ? (
            <Button size="small" onClick={handleGuardar}>
              Guardar
            </Button>
          ) : (
            <Button size="small" onClick={handleValidar}>
              Validar
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};
