/* eslint-disable react-hooks/exhaustive-deps */
import { useMsal } from '@azure/msal-react';
import {
  Button,
  Checkbox,
  Container,
  Divider,
  Grid,
  Modal,
  SelectInput,
  TextInput,
  Typography,
} from '@brick/core';
import { ConfirmationModalSimi } from '@components/ConfirmationModal/simi/ConfirmationModalSimi';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import OverviewContext from '@contexts/Overview';
import {
  buildExcepcionesList,
  buildExcepcionInitialValue,
  checkDuplicatedBoleto,
  isFormValid,
  newBoletoSimi,
  validarBoleto,
  validarSimi,
  validarCcuce,
  validarSecBolMultiple,
} from '@lib/helpers/BoletoSimi.helpers';
import { BoletoSimiFormType } from '@lib/types/BoletoSimi/BoletoSimi.types';
import { ExcepcionBoletoSimi } from '@lib/types/Excepciones/Excepciones.types';
import React from 'react';

interface NuevoBoletoSimi {
  isModalActive: boolean;
  closeModal: () => void;
  model?: BoletoSimiFormType;
  setModel?: (boletoSimi: any) => void;
  genericFunc: (boleto: any) => Promise<any>;
  isEdition: boolean;
  refreshTable: () => void;
  toastCall: (title: string, success: boolean) => void;
}

const initialState: BoletoSimiFormType = {
  nroBoleto: '',
  nroSimi: '',
  ccuce: '',
  secuenciaBoletoMultiple: '',
  idExcepcion: '1',
  descExcepcion: 'Régimen de Reimportación',
};

export const NuevoBoletoSimiModal: React.FC<NuevoBoletoSimi> = (
  props: NuevoBoletoSimi
) => {
  //#region States
  const estadosContext = React.useContext(OverviewContext);
  const [
    showConfirmationModalBoleto,
    setShowConfirmationModalBoleto,
  ] = React.useState<boolean>(false);
  const [excepcionesFetch, setExcepcionesFetch] = React.useState<
    ExcepcionBoletoSimi[] | undefined
  >([]);
  const [boletoSimi, setBoletoSimi] = React.useState<BoletoSimiFormType>(
    initialState
  );
  const [mensajeErrorBoleto, setMensajeErrorBoleto] = React.useState<string>(
    ''
  );
  const [errorBoleto, setErrorBoleto] = React.useState<boolean>(false);
  const [boletoValido, setBoletoValido] = React.useState<boolean>(false);
  const [mensajeErrorSimi, setMensajeErrorSimi] = React.useState<string>('');
  const [errorSimi, setErrorSimi] = React.useState<boolean>(false);
  const [simiValido, setSimiValido] = React.useState<boolean>(false);

  const [mensajeErrorCcuce, setMensajeErrorCcuce] = React.useState<string>('');
  const [errorCcuce, setErrorCcuce] = React.useState<boolean>(false);
  const [ccuceValido, setCcuceValido] = React.useState<boolean>(false);

  const [
    mensajeErrorSecBolMultiple,
    setMensajeErrorSecBolMultiple,
  ] = React.useState<string>('');
  const [errorSecBolMultiple, setErrorSecBolMultiple] = React.useState<boolean>(
    false
  );
  const [secBolMultipleValido, setSecBolMultipleValido] = React.useState<
    boolean
  >(false);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [, setShowToast] = React.useState<boolean>();
  const [, setMessage] = React.useState<string>('');
  const [, setTitle] = React.useState<string>('');
  const [conExcepcion, setConExcepcion] = React.useState<boolean>(false);
  const { accounts } = useMsal();
  //#endregion

  //cuil 20117352456
  //cuit 30714128309

  const handleChange = (value: string, field: string) => {
    // Si el campo es ccuce, lleno secuenciaBoletoMultiple con 0
    if (field === 'nroSimi' || field === 'ccuce') {
      boletoSimi.secuenciaBoletoMultiple = '0';
    }

    if (field === 'idExcepcion') {
      setBoletoSimi(() => ({
        ...boletoSimi,
        [field]: value,
        descExcepcion: excepcionesFetch.find(
          (e: ExcepcionBoletoSimi) => e.idExcepcion === value
        ).descExcepcion,
      }));
    } else {
      setBoletoSimi(() => ({
        ...boletoSimi,
        [field]: value,
      }));
    }
  };

  const clearForm = () => {
    setBoletoSimi(initialState); //limpia el formulario, asignandole los valores por defecto
    setConExcepcion(false);
    setMensajeErrorBoleto('');
    setBoletoValido(false);
    setErrorBoleto(false);
    setBoletoValido(false);
    setErrorBoleto(false);
    setMensajeErrorBoleto('');
    setMensajeErrorSimi('');
    setErrorSimi(false);
    setSimiValido(false);
    setMensajeErrorCcuce('');
    setErrorCcuce(false);
    setCcuceValido(false);
    setMensajeErrorSecBolMultiple('');
    setErrorSecBolMultiple(false);
    setSecBolMultipleValido(false);
  };

  React.useEffect(() => {
    setExcepcionesFetch(estadosContext.excepciones);
  }, [estadosContext.excepciones]);

  const closeToggle = () => {
    clearForm();
    props.closeModal();
    props.setModel?.(undefined);
  };

  const createEditSimi = async () => {
    setLoading(true);
    const resultado =
      (await checkDuplicatedBoleto(boletoSimi)) === 'false' ? false : true;

    if (resultado) {
      setLoading(false);
      setShowConfirmationModalBoleto(true);
    } else {
      //esta funcion esta en el helper, crea o edita la boletoSimi
      newBoletoSimi({
        boletoSimi,
        conExcepcion,
        isEdition: props?.isEdition,
        model: props?.model,
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

  return (
    <>
      <Modal
        active={props.isModalActive}
        customWidth="900px"
        customHeight="400px"
      >
        <Modal.Title
          iconCloseAction={() => {
            closeToggle();
          }}
          titleText={
            props?.isEdition ? 'Actualizar Boleto Simi' : 'Nuevo Boleto'
          }
        />
        <Modal.Body isStatic>
          <Container maxWidth="fluid" className="w-100 mx-auto">
            <Grid>
              <Grid.Item sm={6} direction="row" className="mt-32">
                <TextInput
                  label="Nro. Boleto*"
                  onChange={(e: any) => {
                    handleChange(e.target.value, 'nroBoleto');
                    validarBoleto(
                      e.target.value,
                      setMensajeErrorBoleto,
                      setBoletoValido,
                      setErrorBoleto
                    );
                  }}
                  value={boletoSimi.nroBoleto}
                  error={errorBoleto}
                  success={boletoValido}
                  message={mensajeErrorBoleto}
                />
              </Grid.Item>
              <Grid.Item sm={6} direction="row" className="mt-32">
                <Checkbox
                  checked={conExcepcion}
                  label="Con Excepcion"
                  onChange={(e: any) => {
                    setConExcepcion(e.target.checked);
                    handleChange('0', 'secuenciaBoletoMultiple');
                  }}
                />
              </Grid.Item>
            </Grid>
            <Divider />

            {conExcepcion ? (
              <Grid>
                <Grid.Item sm={7} direction="row" className="mt-32">
                  <SelectInput
                    variant="inline"
                    initialValue={buildExcepcionInitialValue(
                      excepcionesFetch?.find(
                        (e: ExcepcionBoletoSimi) =>
                          boletoSimi.idExcepcion === e.idExcepcion
                      )
                    )}
                    items={buildExcepcionesList(excepcionesFetch)}
                    handlerBlur={(e: any) => {
                      handleChange(e.value, 'idExcepcion');
                    }}
                    label="Excepcion*"
                  />
                </Grid.Item>
              </Grid>
            ) : (
              <Container>
                <Grid>
                  <Grid.Item sm={6} direction="row" className="mt-32">
                    <TextInput
                      size="normal"
                      label="Nro. Simi*"
                      value={boletoSimi.nroSimi}
                      onChange={(e: any) => {
                        handleChange(e.target.value, 'nroSimi');
                        validarSimi(
                          e.target.value,
                          setMensajeErrorSimi,
                          setSimiValido,
                          setErrorSimi
                        );
                      }}
                      error={errorSimi}
                      success={simiValido}
                      message={mensajeErrorSimi}
                    />
                  </Grid.Item>
                </Grid>
                <Grid>
                  <Grid.Item sm={6} direction="row" className="mt-32">
                    <TextInput
                      size="normal"
                      label="CCUCE*"
                      value={boletoSimi.ccuce}
                      onChange={(e: any) => {
                        handleChange(e.target.value, 'ccuce');
                        validarCcuce(
                          e.target.value,
                          setMensajeErrorCcuce,
                          setCcuceValido,
                          setErrorCcuce
                        );
                      }}
                      error={errorCcuce}
                      success={ccuceValido}
                      message={mensajeErrorCcuce}
                    />
                  </Grid.Item>
                  <Grid.Item sm={6} direction="row" className="mt-32">
                    <TextInput
                      inputType="number"
                      size="normal"
                      label="Secuencia Boletos Multiples"
                      value={boletoSimi.secuenciaBoletoMultiple}
                      onChange={(e: any) => {
                        handleChange(e.target.value, 'secuenciaBoletoMultiple');
                        validarSecBolMultiple(
                          boletoSimi.nroSimi,
                          boletoSimi.ccuce,
                          e.target.value,
                          setMensajeErrorSecBolMultiple,
                          setSecBolMultipleValido,
                          setErrorSecBolMultiple
                        );
                      }}
                      error={errorSecBolMultiple}
                      success={secBolMultipleValido}
                      message={mensajeErrorSecBolMultiple}
                    />
                  </Grid.Item>
                </Grid>
              </Container>
            )}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Grid justify="between">
            <Grid.Item sm={6}>
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
                className="mr-16"
                size="small"
                variant="primary"
                onClick={createEditSimi}
                disabled={isFormValid(
                  simiValido,
                  ccuceValido,
                  boletoSimi,
                  boletoValido,
                  conExcepcion
                )}
              >
                {props?.isEdition ? 'Actualizar' : 'Guardar'}
              </Button>
              <Button
                size="small"
                variant="secondary"
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
      <ConfirmationModalSimi
        visible={showConfirmationModalBoleto}
        close={() => setShowConfirmationModalBoleto(false)}
        message={
          'Ya existe un registro creado con ese número de boleto, no se puede crear uno nuevo.'
        }
      />
    </>
  );
};
