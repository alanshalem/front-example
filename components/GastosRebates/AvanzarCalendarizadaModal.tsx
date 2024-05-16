import React, { useState, useCallback, useContext } from 'react';
import { Button, Container, Grid, Modal, TextInput } from '@brick/core';
import { AvanzarCalendaridazadaFilterAuxiliar, RowGastoCalendarizado } from '@lib/types/GastosRebates/GastosRebates.types';
import { initialStateFiltersAvanzar, prepararAvanzarCalendarizada } from '@lib/helpers/GastosRebates.helpers';
import { useMsal } from '@azure/msal-react';
import { tienePermisos } from '@lib/helpers/Auth.helpers'
import { acciones, funcionalidades } from '../../config/ConfigurationService';
import AuthContext from '@contexts/Auth/AuthContext';
import { CustomTextInputCotizacion } from '@components/Inputs/CustomTextInputCotizacion'


interface AvanzarCalendarizaModalProps {
  isModalActive: boolean;
  closeModal: () => void;
  gastosRebatesParaCalendarizar: RowGastoCalendarizado[]
  setLoading: (value: React.SetStateAction<boolean>) => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  setGastoParaCalendarizar: React.Dispatch<React.SetStateAction<RowGastoCalendarizado[]>>,
};

export const AvanzarCalendarizaModal: React.FC<AvanzarCalendarizaModalProps> = (
  props: AvanzarCalendarizaModalProps
) => {
  const authContext = useContext(AuthContext);
  const [filtroAvanzarCalendarizada, setFiltroAvanzarCalendarizada] = useState<
    AvanzarCalendaridazadaFilterAuxiliar
  >(initialStateFiltersAvanzar);
  const { accounts } = useMsal();


  const closeToogle = () => {
    setFiltroAvanzarCalendarizada(initialStateFiltersAvanzar);
    props.setGastoParaCalendarizar([]);
    props.closeModal();
  };

  const handleChange = (value: string, field: string) => {
    setFiltroAvanzarCalendarizada(prevModal => ({
      ...prevModal,
      [field]: value,
    }));
  };

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

      setFiltroAvanzarCalendarizada(prevModal => ({
        ...prevModal,
        [field]: newValue,
      }));
    },
    [setFiltroAvanzarCalendarizada]
  );

  const handleGuardarCalendarizada = () => {
    tienePermisos(
      funcionalidades.gastosRebates,
      acciones.sign,
      authContext.permisos,
      async () => {
        const grupo = (accounts[0].idTokenClaims.groups[0] as string) || '';
        props.setLoading(true);
        prepararAvanzarCalendarizada(
          props.gastosRebatesParaCalendarizar[0].idAnalitico,
          filtroAvanzarCalendarizada,
          props.setLoading,
          props.closeModal,
          props.setRefresh,
          grupo,
          props.setGastoParaCalendarizar
        );
      }
    );
  };

  return (
    <>
      <Modal active={props.isModalActive} customWidth="1300px">
        <Modal.Title
          iconCloseAction={() => closeToogle()}
          titleText="Avanzar Calendarizada"
        ></Modal.Title>
        <Modal.Body isStatic>
          {props.gastosRebatesParaCalendarizar.length > 0 && (
            <Container maxWidth="fluid">
              <Grid spacing={12} justify="between">
                <Grid.Item sm={4}>
                  <TextInput
                    label="Periodo"
                    value={props.gastosRebatesParaCalendarizar[0].periodo}
                    disabled={true}
                  />
                </Grid.Item>
                <Grid.Item sm={4}>
                  <TextInput
                    label="Tipo Analitico"
                    value={props.gastosRebatesParaCalendarizar[0].tipoAnalitico}
                    disabled={true}
                  />
                </Grid.Item>
                <Grid.Item sm={4}>
                  <TextInput
                    label="Corresponsal Divisa"
                    value={
                      props.gastosRebatesParaCalendarizar[0].corresponsalDivisa
                    }
                    disabled={true}
                  />
                </Grid.Item>
                <Grid.Item sm={4}>
                  <TextInput
                    label="Referencia Externa"
                    disabled={true}
                    value={props.gastosRebatesParaCalendarizar[0].nroReferencia}
                  />
                </Grid.Item>
                <Grid.Item sm={4}></Grid.Item>
                <Grid.Item sm={4}>
                  <TextInput
                    label="Importe"
                    value={props.gastosRebatesParaCalendarizar[0].importe}
                    disabled={true}
                  />
                </Grid.Item>
                <Grid.Item sm={4}>
                  <TextInput
                    label="Nro Boleto"
                    value={filtroAvanzarCalendarizada.nroBoleto}
                    onChange={e => handleChange(e.target.value, 'nroBoleto')}
                    maxLength={30}
                    placeholder="Nro Boleto"
                  />
                </Grid.Item>
                <Grid.Item sm={4}>
                  <CustomTextInputCotizacion
                    handleDebounce={handleDebounce}
                    cotizacion={filtroAvanzarCalendarizada.cotizacion}
                    field="cotizacion"
                    label="Cotización"
                  />
                </Grid.Item>
              </Grid>
            </Container>
          )}
        </Modal.Body>
        <Modal.Footer alingElement="flex-end">
          <div style={{ marginRight: '8px' }}></div>
          <Button size="small" onClick={handleGuardarCalendarizada}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
