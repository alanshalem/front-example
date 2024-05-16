/* eslint-disable react-hooks/exhaustive-deps */
import { useMsal } from '@azure/msal-react';
import {
  Button,
  Checkbox,
  Container,
  Divider,
  Grid,
  IconSvg,
  Modal,
  SelectInput,
  TextInput,
  Tooltip,
  Typography
} from '@brick/core';
import { ConfirmationModalProyectada } from '@components/ConfirmationModal/ConfirmationModalProyectada';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import OverviewContext from '@contexts/Overview';
import {
  buildConceptosList,
  checkDuplicatedProyectada,
  handleBeneficiarioValido,
  handleChange,
  handleChangeError,
  handleCheckChange,
  handleMonto,
  handleNumeroFormulario,
  handleNumeroInversion,
  isFormValid,
  newProyectada
} from '@lib/helpers/Proyectadas.helpers';
import { Cliente } from '@lib/types/Cliente.types';
import { ProyectadaFormType } from '@lib/types/Proyectada.types';
import _ from 'lodash';
import React, { useCallback } from 'react';

interface NuevaProyectada {
  isModalActive: boolean;
  closeModal: () => void;
  model?: ProyectadaFormType;
  setModel?: (proyectada: any) => void;
  genericFunc: (comision: any) => Promise<any>;
  isEdition: boolean;
  refreshTable: () => void;
  toastCall: (title: string, success: boolean) => void;
}

const initialState: ProyectadaFormType = {
  denominacion: '',
  moneda: 'USD',
  cuit: '',
  concepto: '', //esto lo obtengo desde el endpoint common.concepto/GetAll
  nroFormulario: '', //primera parte del numero de RAYPE
  nroInversion: '', //segunda parte del numero RAYPE
  monto: '', // este campo es un numero que representa el monto en dolares
  beneficiario: '', //beneficiario de la transferencia, se completa solo en algunos casos dependiendo del codigo de concepto
  vinculada: 'N', // S o N, lo completa el usuario
};

export const NuevaProyectadaModal: React.FC<NuevaProyectada> = (
  props: NuevaProyectada
) => {
  //#region States
  const [proyectada, setProyectada] = React.useState<ProyectadaFormType>(
    initialState
  );
  const estadosContext = React.useContext(OverviewContext);
  const [mensajeError, setMensajeError] = React.useState<string>('');
  const [errorCuit, setErrorCuit] = React.useState<boolean>(false);
  const [
    showConfirmationModalProyectada,
    setShowConfirmationModalProyectada,
  ] = React.useState<boolean>(false);
  const [cuitValido, setCuitValido] = React.useState<boolean>(false);
  const [mensajeErrorMonto, setMensajeErrorMonto] = React.useState<string>('');
  const [errorMonto, setErrorMonto] = React.useState<boolean>(false);
  const [montoValido, setMontoValido] = React.useState<boolean>(false);
  const [
    mensajeErrorNroFormulario,
    setMensajeErrorNroFormulario,
  ] = React.useState<string>('');
  const [errorNroFormulario, setErrorNroFormulario] = React.useState<boolean>(
    false
  );
  const [nroFormularioValido, setNroFormularioValido] = React.useState<boolean>(
    false
  );
  const [
    mensajeErrorNroInversion,
    setMensajeErrorNroInversion,
  ] = React.useState<string>('');
  const [errorNroInversion, setErrorNroInversion] = React.useState<boolean>(
    false
  );
  const [nroInversionValido, setNroInversionValido] = React.useState<boolean>(
    false
  );
  const [
    mensajeErrorBeneficiario,
    setMensajeErrorBeneficiario,
  ] = React.useState<string>('');
  const [errorBeneficiario, setErrorBeneficiario] = React.useState<boolean>(
    false
  );
  const [beneficiarioValido, setBeneficiarioValido] = React.useState<boolean>(
    false
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [, setShowToast] = React.useState<boolean>();
  const [, setMessage] = React.useState<string>('');
  const [, setTitle] = React.useState<string>('');
  const [persona, setPersona] = React.useState<Cliente | undefined>();
  const [existePersona, setExistePersona] = React.useState<boolean>(false);
  const [llevaBeneficiario, setLlevaBeneficiario] = React.useState<
    'SI' | 'NO' | 'OPCIONAL' | ''
  >('');
  const [items, setItems] = React.useState<any[]>([]);
  const debounceFn = useCallback(_.debounce(handleDebounce, 1000), []);

  const { accounts } = useMsal();
  const messageTooltip = `Para la integración del campo "RAYPE" se utilizará el formato "RRRRRRNNNNNNNNNN", 
    donde RRRRRR es el número del formulario registrado en AFIP y NNNNNNNNNN corresponde al número de inversión con el cual se declaro la operación.`;
  const messageTooltipBeneficiario = `Si el campo "Beneficiario" no aplica, dejar el campo en blanco.`;
  const conceptosFiltrados =
    estadosContext.conceptos?.filter(con => con.codigo !== 'A10') || [];
  //#endregion

  //cuil 20117352456
  //cuit 30714128309

  const clearForm = () => {
    setProyectada(initialState); //limpia el formulario, asignandole los valores por defecto
    setExistePersona(false);
    setMensajeError('');
    setCuitValido(false);
    setErrorCuit(false);
    setMensajeErrorNroFormulario('');
    setMensajeErrorNroInversion('');
    setErrorNroFormulario(false);
    setErrorNroInversion(false);
    setNroFormularioValido(false);
    setNroInversionValido(false);
    setMensajeErrorMonto('');
    setMensajeErrorBeneficiario('');
    setLlevaBeneficiario('');
    setBeneficiarioValido(false);
    setErrorBeneficiario(false);
    setMontoValido(false);
    setErrorMonto(false);
    setItems(buildConceptosList(conceptosFiltrados));
    handleBeneficiarioValido(
      proyectada.beneficiario,
      setErrorBeneficiario,
      setBeneficiarioValido,
      setMensajeErrorBeneficiario,
      llevaBeneficiario
    );
  };

  React.useEffect(() => {
    setItems(buildConceptosList(conceptosFiltrados));
  }, [estadosContext.conceptos]);

  const closeToggle = () => {
    clearForm();
    props.closeModal();
    props.setModel && props.setModel(undefined);
  };

  const createEditProyectada = async () => {
    if (await checkDuplicatedProyectada(proyectada)) {
      setShowConfirmationModalProyectada(true);
    } else {
      //esta funcion esta en el helper, crea o edita la proyectada
      newProyectada({
        proyectada,
        isEdition: props?.isEdition,
        model: props?.model,
        persona,
        genericFunc: props?.genericFunc,
        setLoading,
        setShowToast,
        setMessage,
        setTitle,
        closeModal: props?.closeModal,
        clearForm,
        refreshTable: props?.refreshTable,
        toastCall: props?.toastCall,
        username: accounts[0].username.slice(0, 8),
      });
    }
  };

  async function handleDebounce(e: string) {
    await handleChangeError(
      e,
      setCuitValido,
      setErrorCuit,
      setMensajeError,
      setExistePersona,
      setPersona
    );
  }

  async function handleDebounceChange(e: any) {
    handleChange(e.target.value, 'cuit', persona, proyectada, setProyectada);
    await debounceFn(e.target.value);
  }
  //#region Validaciones

  React.useEffect(() => {
    handleNumeroInversion(
      proyectada.nroInversion,
      proyectada,
      setErrorNroInversion,
      setNroInversionValido,
      setMensajeErrorNroInversion
    );
  }, [proyectada.nroFormulario]);

  React.useEffect(() => {
    handleNumeroFormulario(
      proyectada.nroFormulario,
      proyectada,
      setErrorNroFormulario,
      setNroFormularioValido,
      setMensajeErrorNroFormulario
    );
  }, [proyectada.nroInversion]);
  //#endregion

  React.useEffect(() => {
    handleBeneficiarioValido(
      proyectada.beneficiario,
      setErrorBeneficiario,
      setBeneficiarioValido,
      setMensajeErrorBeneficiario,
      llevaBeneficiario
    );
  }, [proyectada.concepto, proyectada.beneficiario]);

  let validacionLlevaBeneficiario: string;

  if (llevaBeneficiario === 'SI') {
    validacionLlevaBeneficiario = 'Beneficiario*';
  } else if (llevaBeneficiario === 'NO') {
    validacionLlevaBeneficiario = 'Beneficiario';
  } else if (llevaBeneficiario === ''){
    validacionLlevaBeneficiario = 'Beneficiario';
  } else {
    validacionLlevaBeneficiario = 'Beneficiario (opcional)';
  }
  return (
    <>
      <Modal active={props.isModalActive} customWidth="900px">
        <Modal.Title
          iconCloseAction={() => {
            closeToggle();
          }}
          titleText={props?.isEdition ? 'Actualizar' : 'Guardar'}
        />
        <Modal.Body isStatic>
          <Container maxWidth="fluid" className="w-100">
            <Grid className={!existePersona && 'mb-32'}>
              <Grid.Item sm={4} direction="row" className="mt-32">
                <TextInput
                  label="CUIL/CUIT*"
                  onChange={async (e: any) => {
                    await handleDebounceChange(e);
                  }}
                  value={proyectada.cuit}
                  error={errorCuit}
                  success={cuitValido}
                  message={mensajeError}
                />
              </Grid.Item>
            </Grid>
            <Grid>
              <Grid.Item
                sm={4}
                direction="row"
                className={`mt-40 ${!existePersona && 'd-none'}`}
              >
                <Typography variant="s3">
                  {persona?.tipo === 'FISICA'
                    ? 'Nombre y Apellido:'
                    : 'Razón Social:'}
                </Typography>
              </Grid.Item>
              <Grid.Item
                sm={8}
                direction="row"
                className={`mt-40 ${!existePersona && 'd-none'}`}
              >
                <Typography variant="s4">
                  {persona?.tipo === 'FISICA'
                    ? `${persona?.nombre} ${persona?.apellido}`
                    : persona?.razonSocial}
                </Typography>
              </Grid.Item>
            </Grid>
            <Divider />
            <Grid className={!existePersona && 'd-none'}>
              <Grid.Item sm={6} direction="row" className="mt-32">
                <SelectInput
                  variant="inline"
                  items={items}
                  handlerBlur={(e: any) =>
                    handleChange(
                      e.value,
                      'concepto',
                      persona,
                      proyectada,
                      setProyectada,
                      setLlevaBeneficiario
                    )
                  }
                  label="Concepto*"
                />
              </Grid.Item>
              <Grid.Item sm={6} direction="row" className="mt-32">
                <TextInput
                  size="normal"
                  label="Monto*"
                  value={proyectada.monto}
                  inputType="currency"
                  onChange={(e: any) => {
                    handleChange(
                      e.target.value,
                      'monto',
                      persona,
                      proyectada,
                      setProyectada
                    );
                    handleMonto(
                      e.target.value,
                      setErrorMonto,
                      setMontoValido,
                      setMensajeErrorMonto
                    );
                  }}
                  thousandDelimiter="."
                  decimalDelimiter=","
                  error={errorMonto}
                  success={montoValido}
                  message={mensajeErrorMonto}
                />
              </Grid.Item>
              <Grid >
                <Grid.Item sm={8} direction="row" className="mt-32 pl-20">
                  <Tooltip
                    message={messageTooltipBeneficiario}
                    width="500px"
                    className="mb-32"
                  >
                    <IconSvg type="userQuestion" size="xs" color="black" />
                  </Tooltip>
                  <TextInput
                    label={validacionLlevaBeneficiario}
                    onChange={(e: any) => {
                      handleChange(
                        e.target.value,
                        'beneficiario',
                        persona,
                        proyectada,
                        setProyectada
                      );
                    }}
                    value={proyectada.beneficiario}
                    disabled={llevaBeneficiario === 'NO' || llevaBeneficiario === ''}
                    error={errorBeneficiario}
                    success={beneficiarioValido}
                    message={mensajeErrorBeneficiario}
                  />
                </Grid.Item>
                <Grid.Item sm={4} direction="row" className="mt-32 mb-32">
                    <Checkbox
                      checked={proyectada.vinculada === 'S'}
                      label="Vinculada"
                      onChange={(e: any) => {
                        handleCheckChange(
                          e.target.checked,
                          'vinculada',
                          persona,
                          proyectada,
                          setProyectada
                        );
                      }}
                    />
                </Grid.Item>
              </Grid>
            </Grid>
            <Grid className={!existePersona && 'd-none'}>
              <Divider />

              <Grid.Item sm={5}>
                <Typography variant="s3">Número RAyPE (Opcional):</Typography>
              </Grid.Item>
              <Grid.Item sm={7} className="ml-n4">
                <Tooltip message={messageTooltip} width="500px">
                  <IconSvg type="userQuestion" size="xs" color="black" />
                </Tooltip>
              </Grid.Item>
            </Grid>
            <Grid className={!existePersona && 'd-none'}>
              <Grid.Item sm={6} direction="row" className="mt-32">
                <TextInput
                  size="normal"
                  label="Nro. Formulario AFIP"
                  value={proyectada.nroFormulario}
                  inputType="number"
                  onChange={(e: any) => {
                    handleChange(
                      e.target.value,
                      'nroFormulario',
                      persona,
                      proyectada,
                      setProyectada
                    );
                    handleNumeroFormulario(
                      e.target.value,
                      proyectada,
                      setErrorNroFormulario,
                      setNroFormularioValido,
                      setMensajeErrorNroFormulario
                    );
                  }}
                  error={errorNroFormulario}
                  success={nroFormularioValido}
                  message={mensajeErrorNroFormulario}
                />
              </Grid.Item>
              <Grid.Item sm={6} direction="row" className="mt-32">
                <TextInput
                  size="normal"
                  label="Nro. Inversión"
                  value={proyectada.nroInversion}
                  inputType="number"
                  onChange={(e: any) => {
                    handleChange(
                      e.target.value,
                      'nroInversion',
                      persona,
                      proyectada,
                      setProyectada
                    );
                    handleNumeroInversion(
                      e.target.value,
                      proyectada,
                      setErrorNroInversion,
                      setNroInversionValido,
                      setMensajeErrorNroInversion
                    );
                  }}
                  error={errorNroInversion}
                  success={nroInversionValido}
                  message={mensajeErrorNroInversion}
                />
              </Grid.Item>
            </Grid>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Grid justify="between">
            <Grid.Item sm={6} className="mt-12 pl-48">
              <Typography
                variant="s7"
                color="grey_text_dark"
                weight="bold"
                aling="left"
              >
                Los campos marcados con (*) son obligatorios.
              </Typography>
            </Grid.Item>
            <Grid.Item sm={4}>
              <Button
                size="small"
                variant="primary"
                className="m-2 mr-32"
                onClick={createEditProyectada}
                disabled={isFormValid(
                  montoValido,
                  proyectada,
                  cuitValido,
                  errorNroFormulario,
                  errorNroInversion,
                  errorBeneficiario,
                  proyectada.concepto
                )}
              >
                {props?.isEdition ? 'Actualizar' : 'Guardar'}
              </Button>
              <Button
                size="small"
                variant="secondary"
                className="m-2"
                onClick={closeToggle}
                disabled={loading}
              >
                Cancelar
              </Button>
            </Grid.Item>
          </Grid>
        </Modal.Footer>
        {loading && <LoadingGalicia />}
      </Modal>

      <ConfirmationModalProyectada
        visible={showConfirmationModalProyectada}
        close={() => setShowConfirmationModalProyectada(false)}
        message={
          'Ya existe una proyectada con ese CUIT, CONCEPTO, RAYPE y BENEFICIARIO. ¿Desea continuar?'
        }
        dataProyectada={{
          proyectada,
          isEdition: props?.isEdition,
          model: props?.model,
          persona,
          genericFunc: props?.genericFunc,
          setLoading,
          setShowToast,
          setMessage,
          setTitle,
          closeModal: props?.closeModal,
          clearForm,
          refreshTable: props?.refreshTable,
          toastCall: props?.toastCall,
          username: accounts[0].username.slice(0, 8),
        }}
      />
    </>
  );
};
