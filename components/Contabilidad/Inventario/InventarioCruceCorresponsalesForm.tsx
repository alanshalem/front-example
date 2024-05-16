import { useMsal } from '@azure/msal-react';
import { Grid, Textarea, TextInput, Typography } from '@brick/core';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import { handleChangeError } from '@lib/helpers/ContabilidadCruces/InventarioCruces.helpers';
import { formatNumber } from '@lib/helpers/helpers';
import { SimulacionDTO } from '@lib/types/Contabilidad/Eventos/Inventario/EventoInventario.types';
import _ from 'lodash';
import React, { useState } from 'react';
import { AsientosContables } from './AsientosContables';

interface InventarioForm {
  nroOperacion: string;
  observaciones: string;
}

interface Props {
  idEventoContable: number;
  setOperacion: React.Dispatch<React.SetStateAction<SimulacionDTO>>;
  operacion: SimulacionDTO;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setExisteNroOperacion: React.Dispatch<React.SetStateAction<boolean>>;
  existeNroOperacion: boolean;
}

export const InventarioCruceCorresponsalesForm = ({
  idEventoContable,
  setOperacion,
  operacion,
  setLoading,
  loading,
  setExisteNroOperacion,
  existeNroOperacion,
}: Props) => {
  const initialState = {
    nroOperacion: '',
    observaciones: '',
  };
  const [inventarioForm, setInventarioForm] = useState<InventarioForm>(
    initialState
  );
  const debounceFn = React.useCallback(_.debounce(handleDebounce, 750), []);
  const [nroOperacionValido, setNroOperacionValido] = useState<boolean>(false);
  const [errorNroOperacion, setErrorNroOperacion] = useState<boolean>(false);
  const [disableInput, setDisableInput] = useState<boolean>(false);
  const [mensajeError, setMensajeError] = useState<string>('');
  const { accounts } = useMsal();

  async function handleDebounce(e: string) {
    await handleChangeError(
      e,
      idEventoContable,
      setNroOperacionValido,
      setErrorNroOperacion,
      setMensajeError,
      setExisteNroOperacion,
      setOperacion,
      setLoading,
      setDisableInput
    );
  }

  async function handleDebounceChange(e: any) {
    handleChange(e.target.value, 'nroOperacion');
    await debounceFn(e.target.value);
  }

  const handleChange = (value: string, field: string): void => {
    setInventarioForm(() => ({
      ...inventarioForm,
      [field]: value,
    }));
  };

  React.useEffect(() => {
    setOperacion(() => ({
      ...operacion,
      simulacionAnalitico: {
        ...operacion?.simulacionAnalitico,
        identificacion: inventarioForm.nroOperacion,
        observacion: inventarioForm.observaciones,
        legajoCreacion: accounts[0].username.slice(0, 8),
      },
    }));
  }, [existeNroOperacion, inventarioForm.observaciones]);

  return (
    <div>
      <Grid className="h-100 d-flex mt-32" alignItems="end" justify="between">
        <Grid.Item sm={4}>
          <TextInput
            size="normal"
            label="Nro. Operación"
            value={inventarioForm.nroOperacion}
            onChange={async (e: any) => {
              await handleDebounceChange(e);
            }}
            error={errorNroOperacion}
            success={nroOperacionValido}
            message={mensajeError}
            disabled={disableInput}
          />
        </Grid.Item>
        <Grid.Item sm={6}>
          <Textarea
            label="Observaciones"
            value={inventarioForm.observaciones}
            onChange={(e: any) => {
              handleChange(e.target.value, 'observaciones');
            }}
            height="3rem"
          />
        </Grid.Item>
      </Grid>
      <Grid className={`mb-20 ${!existeNroOperacion && 'd-none'}`}>
        <Grid.Item sm={10} direction="row" className="mt-20 mb-20">
          <Typography variant="s2" bold>
            Información de la solicitud/operación
          </Typography>
        </Grid.Item>
        <Grid.Item sm={3} direction="row" className="mt-12">
          <Typography variant="s4">
            Fecha Contable: 
            {new Date(
              operacion?.simulacionAnalitico?.fechaContable
            ).toLocaleDateString()}
          </Typography>
        </Grid.Item>
        <Grid.Item sm={3} direction="row" className="mt-12">
          <Typography variant="s4">
            Corresponsal: {operacion?.corresponsal}
          </Typography>
        </Grid.Item>
        <Grid.Item sm={3} direction="row" className="mt-12">
          <Typography variant="s4">
            Monto: {formatNumber(operacion?.importe?.toString() ?? '0')}
          </Typography>
        </Grid.Item>
        <Grid.Item sm={3} direction="row" className="mt-12">
          <Typography variant="s4">Divisa: {operacion?.divisa}</Typography>
        </Grid.Item>
      </Grid>
      <Grid className={!existeNroOperacion && 'd-none'}>
        <Grid.Item sm={10} direction="row" className="mt-20 mb-20">
          <Typography variant="s2" bold>
            Asientos contables de la solicitud/operación
          </Typography>
        </Grid.Item>
        <AsientosContables
          datosAsientos={operacion?.simulacionAnalitico?.detalle}
        />
      </Grid>
      {loading && <LoadingGalicia />}
    </div>
  );
};
