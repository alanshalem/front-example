import { toastCallAux } from '@components/Toast/Toast.helpers';
import {
  guardarAnalitico,
  simularAnalitico,
} from '@lib/services/ContabilidadCruces/ContabilidadCruces.services';
import {
  Evento,
  simulacionAnaliticoDTO,
  SimulacionDTO,
  SimulacionRequestDTO,
} from '@lib/types/Contabilidad/Eventos/Inventario/EventoInventario.types';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';

const mensajeErrorNroOperacion =
  'Introduzca un número de operación con el formato correcto.';

const handleSearchOperacion = async (
  nroOperacion: string,
  idEvento: number
): Promise<any> => {
  const bodyRequest: SimulacionRequestDTO = {
    generarSimulacionAnalitico: {
      idEvento,
      nroOperacion,
    },
  };

  try {
    return await simularAnalitico(bodyRequest);
  } catch {
    return null;
  }
};

const checkNroOperacion = async (
  nroOperacionLocal: string,
  idEvento: number,
  setOperacion: (value: React.SetStateAction<SimulacionDTO>) => void,
  setExisteNroOperacion: (value: React.SetStateAction<boolean>) => void,
  setMensajeError: (value: React.SetStateAction<string>) => void,
  setNroOperacionValido: (value: React.SetStateAction<boolean>) => void,
  setErrorNroOperacion: (value: React.SetStateAction<boolean>) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void,
  setDisableInput: (value: React.SetStateAction<boolean>) => void
): Promise<any> => {
  handleSearchOperacion(nroOperacionLocal, idEvento).then(
    (res: simulacionAnaliticoDTO) => {
      if (res.success) {
        setOperacion(res.value);
        setExisteNroOperacion(true);
      } else if (res.value !== null) {
        setOperacion(res.value);
        setNroOperacionValido(true);
        setExisteNroOperacion(true);
        setMensajeError(res.validaciones[0].message);
        setErrorNroOperacion(false);
      } else {
        setNroOperacionValido(false);
        setExisteNroOperacion(false);
        setMensajeError(res.validaciones[0].message);
        setErrorNroOperacion(true);
      }
      setLoading(false);
      setDisableInput(false);
    }
  );
}; //tipar la promesa

export const handleChangeError = async (
  nroOperacion: string,
  idEvento: number,
  setNroOperacionValido: (value: React.SetStateAction<boolean>) => void,
  setErrorNroOperacion: (value: React.SetStateAction<boolean>) => void,
  setMensajeError: (value: React.SetStateAction<string>) => void,
  setExisteNroOperacion: (value: React.SetStateAction<boolean>) => void,
  setOperacion: (
    value: React.SetStateAction<SimulacionDTO | undefined>
  ) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void,
  setDisableInput: (value: React.SetStateAction<boolean>) => void
) => {
  const regex = /^[OTot]\d{6}$/;

  if (!regex.test(nroOperacion)) {
    setMensajeError(mensajeErrorNroOperacion);
    setNroOperacionValido(false);
    setErrorNroOperacion(true);
    setExisteNroOperacion(false);
  } else {
    setMensajeError('');
    setNroOperacionValido(true);
    setErrorNroOperacion(false);
    setLoading(true);
    setDisableInput(true);
    await checkNroOperacion(
      nroOperacion,
      idEvento,
      setOperacion,
      setExisteNroOperacion,
      setMensajeError,
      setNroOperacionValido,
      setErrorNroOperacion,
      setLoading,
      setDisableInput
    );
  }
};

export function extraerCodigosEventos(eventosContables: Evento[]): string[] {
  const codigosEventos: string[] = [];
  eventosContables.forEach(evento => {
    codigosEventos.push(evento.codigo);
  });
  return codigosEventos;
}

export function crearItem(evento: Evento): ItemDropdown {
  return {
    text: `${evento.codigo} - ${evento.descripcion}`,
    value: evento.codigo,
  };
}

export async function handleGuardarAnalitico(
  operacion: SimulacionDTO,
  setLoading: (value) => void,
  closeToggle: () => void,
  refreshTable: () => void
) {
  setLoading(true);
  await guardarAnalitico(operacion)
    .then(() => {
      setLoading(false);
      toastCallAux('Creado correctamente', true);
      refreshTable();
      closeToggle();
    })
    .catch(error => {
      setLoading(false);
      toastCallAux(error.error, false);
      closeToggle();
    });
}
