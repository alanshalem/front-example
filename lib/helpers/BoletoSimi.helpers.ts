import {
  checkBoletoSimi,
  getBoletoSimiByFilter,
} from '@lib/services/BoletoSimi/Boletosimi.services';
import {
  BoletoSimi,
  BoletoSimiFormType,
  CheckBoletoRequest,
  EditBoletoSimiRequest,
  FilterBoletoSimi,
  NewBoletoSimiRequest,
} from '@lib/types/BoletoSimi/BoletoSimi.types';
import { ExcepcionBoletoSimi } from '@lib/types/Excepciones/Excepciones.types';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';
import { validarNumeroDeDespachoDeImportacion } from '@lib/utils/DespachoValidator';
import { esNumero } from '@lib/utils/StringUtils';
import { isEmpty } from './helpers';

export type NuevoBoletoSimiType = {
  boletoSimi: BoletoSimiFormType;
  conExcepcion: boolean;
  isEdition: boolean;
  model: BoletoSimiFormType | undefined;
  genericFunc: (boletoSimi: any) => Promise<any>;
  setLoading: (value: React.SetStateAction<boolean>) => void;
  setShowToast: (value: React.SetStateAction<boolean>) => void;
  setMessage: (value: React.SetStateAction<string>) => void;
  setTitle: (value: React.SetStateAction<string>) => void;
  closeModal: () => void;
  clearForm: () => void;
  refreshTable: () => void;
  toastCall: (title: string, success: boolean) => void;
  username: string;
};

export const buildExcepcionInitialValue = (
  e: ExcepcionBoletoSimi | undefined
): any => {
  if (e) {
    return {
      value: e.idExcepcion,
      text: e.descExcepcion,
    };
  } else {
    return {
      value: 'Régimen de Reimportación',
      text: 'Régimen de Reimportación',
    };
  }
};

export const buildExcepcionesList = (
  conceptos: ExcepcionBoletoSimi[] | undefined
): ItemDropdown[] => {
  const auxExcepciones: ItemDropdown[] = [];
  if (conceptos) {
    conceptos.forEach(p => {
      auxExcepciones.push({ text: p.descExcepcion, value: p.idExcepcion });
    });
    return auxExcepciones;
  }
  return [];
};

const checkEsConExcepcion = (
  conEx: boolean,
  simiValido: boolean,
  ccuceValido: boolean,
  boletoSimi: BoletoSimiFormType
): boolean => {
  if (conEx) {
    return (
      boletoSimi.idExcepcion.length > 0 && boletoSimi.descExcepcion.length > 0
    );
  } else {
    if (ccuceValido && isEmpty(boletoSimi.nroSimi)) {
      // CCUCE VALIDO YYY SIMI VACIO
      return boletoSimi.ccuce.length > 0;
    } else if (ccuceValido && simiValido) {
      // CCUCE VALIDO YYY SIMI VALIDO
      return boletoSimi.nroSimi.length > 0 && boletoSimi.ccuce.length > 0;
    } else if (isEmpty(boletoSimi.ccuce) && simiValido) {
      // CCUCE VACIO Y SIMI VALIDO
      return boletoSimi.nroSimi.length > 0;
    }
    return false;
  }
};

/**
 * Comprueba si el formulario es válido y si el botón "Guardar" debe estar habilitado o deshabilitado.
 *
 * @param simiValido - Indica si el campo SIMI es válido.
 * @param ccuceValido - Indica si el campo CCUCE es válido.
 * @param boletoSimi - Datos del formulario para Boleto SIMI.
 * @param boletoValido - Indica si el campo Boleto es válido.
 * @param conExcepcion - Indica si el formulario tiene una excepción.
 * @returns Si el botón "Guardar" debe estar habilitado o deshabilitado.
 */
export const isFormValid = (
  simiValido: boolean,
  ccuceValido: boolean,
  boletoSimi: BoletoSimiFormType,
  boletoValido: boolean,
  conExcepcion: boolean
): boolean => {
  const { nroSimi, secuenciaBoletoMultiple } = boletoSimi;
  let formularioInvalido: boolean = true;

  // 1 caso: SI nroSimi - SI/NO ccuce - SI secuenciaBoletoMultiple && secuenciaBoletoMultiple === 0
  // 2 caso: NO nroSimi - SI ccuce - SI secuenciaBoletoMultiple && secuenciaBoletoMultiple >= 0
  // 3 caso: NO nroSimi - NO ccuce - secuenciaBoletoMultiple === 0 - Entra al caso CON EXCEPCION

  // Caso 1
  if (!isEmpty(nroSimi) && secuenciaBoletoMultiple === '0') {
    formularioInvalido = false; // El botón debe estar deshabilitado en este caso
  }

  // Caso 2
  if (!nroSimi && !isEmpty(secuenciaBoletoMultiple)) {
    const secuenciaNumero = Number(secuenciaBoletoMultiple);
    formularioInvalido = !(!isNaN(secuenciaNumero) && secuenciaNumero >= 0);
  }

  // Caso por defecto: Comprobar si otros campos son válidos
  return !(
    boletoValido &&
    !formularioInvalido &&
    boletoSimi.nroBoleto.length > 0 &&
    checkEsConExcepcion(conExcepcion, simiValido, ccuceValido, boletoSimi)
  );
};

export function newBoletoSimi({
  boletoSimi,
  conExcepcion,
  isEdition,
  model,
  genericFunc,
  setLoading,
  setShowToast,
  setMessage,
  setTitle,
  closeModal,
  clearForm,
  refreshTable,
  toastCall,
  username,
}: NuevoBoletoSimiType) {
  setLoading(true);
  let editSimiObj: EditBoletoSimiRequest;
  let newSimiObj: NewBoletoSimiRequest;
  if (isEdition) {
    editSimiObj = {
      simiEditDTO: {
        id: model?.id,
        nroBoleto: boletoSimi.nroBoleto,
        nroSimi: !conExcepcion ? boletoSimi.nroSimi : '',
        ccuce: !isEmpty(boletoSimi.ccuce) ? boletoSimi.ccuce : '',
        secuenciaBoletoMultiple: !isEmpty(boletoSimi.secuenciaBoletoMultiple)
          ? boletoSimi.secuenciaBoletoMultiple
          : '0',
        codigoExcepcion: conExcepcion ? boletoSimi.idExcepcion : '',
        descExcepcion: conExcepcion ? boletoSimi.descExcepcion : '',
        legajoUltimaModificacion: username.slice(0, 8),
      },
    };
  } else {
    newSimiObj = {
      simiCreateDTO: {
        nroBoleto: boletoSimi.nroBoleto,
        nroSimi: !conExcepcion ? boletoSimi.nroSimi : '',
        ccuce: !isEmpty(boletoSimi.ccuce) ? boletoSimi.ccuce : '',
        secuenciaBoletoMultiple: !isEmpty(boletoSimi.secuenciaBoletoMultiple)
          ? boletoSimi.secuenciaBoletoMultiple
          : '0',
        codigoExcepcion: conExcepcion ? boletoSimi.idExcepcion : '',
        descExcepcion: conExcepcion ? boletoSimi.descExcepcion : '',
        legajoCreacion: username.slice(0, 8),
      },
    };
  }

  //ACA ACEPTAR ES EL CREATE O EDIT, DEPENDE DE DONDE LLAME AL MODAL
  genericFunc(isEdition ? editSimiObj : newSimiObj)
    .then(() => {
      setLoading(false);
      setShowToast(true);
      setTitle('Boleto creado correctamente.');
      setMessage('');
      toastCall('Boleto creado correctamente.', true);
      closeModal();
      clearForm();
      refreshTable();
    })
    .catch((_errs: any) => {
      setLoading(false);
      setShowToast(true);
      setTitle('Error al crear el boleto...');
      setMessage('Error al crear el boleto');
      toastCall('Error al crear el boleto...', false);
    });
}
export const checkSimiLength = (value: string) => {
  return value.replace(/\./g, '').length === 16;
};

export const checkSecBolMultipleLength = (value: string) => {
  return value.replace(/\./g, '').length <= 5;
};

export const checkCcuceLength = (value: string) => {
  return value.replace(/\./g, '').length <= 36;
};

export const returnEstado = (idEstado: number): string | null => {
  switch (idEstado) {
    case 0:
      return 'Eliminado';
    case 1:
      return 'Activo';
    case 2:
      return 'Exportado';
    default:
      break;
  }
  return 'Desconocido';
};

export const returnExcepcion = (
  codExepcion: string,
  descExcepcion: string
): string => {
  return `${codExepcion}-${descExcepcion}`;
};

export function checkDuplicatedBoleto(
  boletoSimi: BoletoSimiFormType
): Promise<any> {
  const boleto: CheckBoletoRequest = {
    simiCheckDTO: {
      nroBoleto: boletoSimi.nroBoleto,
      secuenciaBoletoMultiple: boletoSimi.secuenciaBoletoMultiple,
    },
  };

  return checkBoletoSimi(boleto);
}

export function validarTesin(boleto: string): boolean {
  const regex = /^[0-9]*$/; //solo numeros

  if (
    (boleto.startsWith('8') || boleto.startsWith('7')) &&
    regex.test(boleto) &&
    parseInt(boleto.slice(1, 20)) > 0
  ) {
    return true;
  }
  return false;
}

export function validarTops(boleto: string): boolean {
  const regexFecha = /^\d{4}(0?[1-9]|1[012])(0?[1-9]|[12]\d|3[01])$/;
  const regexNumeros = /^[0-9]*$/; //solo numeros

  const fecha = boleto.slice(0, 8);
  const letra = boleto.slice(8, 9);
  if (
    regexFecha.test(fecha) &&
    fecha.startsWith('20') &&
    (letra.toLowerCase() === 't' || letra.toLowerCase() === 'o') &&
    regexNumeros.test(boleto.slice(9, 20)) &&
    parseInt(boleto.slice(9, 20)) > 0
  ) {
    return true;
  }
  return false;
}

export function validarBankTrade(boleto: string): boolean {
  //letras de cada tipo de producto
  // I-Carta de Crédito de Importación , E- Carta de Crédito de Exportación, C-Cobranzas de Importación, O-Cobranzas de Exportación, F-Préstamos Activos, P-Préstamos Pasivos)
  const letrasProducto = 'iecofp';
  const eventoOperacion = ['pay', 'mat', 'iss'];

  const regexNumeros = /^[0-9]*$/; //solo numeros
  const regexHora = /^(?:(?:([01]?\d|2[0-3]))?([0-5]?\d))?([0-5]?\d)$/;

  const transBankTrade = boleto.slice(1, 7);

  const secuenciaBankTrade = boleto.slice(7, 10);
  const eventoBankTrade = boleto.slice(10, 13);
  const horaMinSeg = boleto.slice(13, 19);
  const secuencialNroBoleto = boleto.slice(19, 20);

  if (
    letrasProducto.includes(boleto[0].toLowerCase()) &&
    regexNumeros.test(transBankTrade) &&
    parseInt(transBankTrade) > 0 &&
    regexNumeros.test(secuenciaBankTrade) &&
    parseInt(secuenciaBankTrade) > 0 &&
    eventoOperacion.indexOf(eventoBankTrade.toLowerCase()) >= 0 &&
    parseInt(secuencialNroBoleto) > 0 &&
    parseInt(secuencialNroBoleto) <= 9 &&
    regexHora.test(horaMinSeg)
  ) {
    return true;
  }
  return false;
}
export const prepareFilter = (
  filtroSimi: BoletoSimi,
  setBoletosSimiList: (value: React.SetStateAction<BoletoSimi[]>) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void
) => {
  // preparo el filtro
  const filtroSimiObj: FilterBoletoSimi = {
    simiListDTO: {
      fechaExportacion: filtroSimi.fechaExportacion
        ? filtroSimi.fechaExportacion
        : null,
      fechaCreacion: filtroSimi.fechaCreacion ? filtroSimi.fechaCreacion : null,
      nroBoleto: filtroSimi.nroBoleto ? filtroSimi.nroBoleto : null,
      nroSimi: filtroSimi.nroSimi ? filtroSimi.nroSimi : null,
      ccuce: filtroSimi.ccuce ? filtroSimi.ccuce : null,
    },
  };
  //cambiar al de boletosimi
  getBoletoSimiByFilter(filtroSimiObj)
    .then((result: any) => {
      setBoletosSimiList(result);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

//devuelve true si todos los campos del filtro estan vacios
export const verificarFiltro = (filtroSimi: BoletoSimi): boolean => {
  return (
    isEmpty(filtroSimi.fechaExportacion) &&
    isEmpty(filtroSimi.fechaCreacion) &&
    isEmpty(filtroSimi.nroBoleto) &&
    isEmpty(filtroSimi.nroSimi) &&
    isEmpty(filtroSimi.ccuce)
  );
};

export const cleanFilter = (
  event: any,
  setFiltroSimi: (value: React.SetStateAction<BoletoSimi>) => void,
  initialState: BoletoSimi
) => {
  event.preventDefault();
  setFiltroSimi(initialState);
};

export const validarBoleto = (
  boleto: string,
  setMensajeErrorBoleto: (value: React.SetStateAction<string>) => void,
  setBoletoValido: (value: React.SetStateAction<boolean>) => void,
  setErrorBoleto: (value: React.SetStateAction<boolean>) => void
): boolean => {
  //validar si es de TOPS: aaaammddT/Onnnnnnsssbb EJ: 20211012T00000002701 / 20211012O00000002701

  //validar si es de tesin: SOLO NUMEROS COMENZANDO CON 8

  //validar si es de banktrade:

  // del 1-7: comienza con E, siguen todos numeros EJ: E002725
  // del 8-10: caracteres numericos tenga al menos 1 numero distinto de 0
  // del 11-13: letras
  // del 14-20:
  // *Los seis primeros por hhmmss, donde hh=hora, mm=minuto y ss=segundo (checkear que hora no sea mayor a 24, etc)
  // *El último dígito es un secuencial que inicia en 1, cuando este dígito llega a 0 (es decir hay más de 9 boletos), se suma uno al segundo y la secuencia arranca desde 0.

  // todos numeros

  if (boleto.length === 20) {
    setMensajeErrorBoleto('');

    //valido si es de tesin
    if (validarTesin(boleto)) {
      setBoletoValido(true);
      setErrorBoleto(false);
      setMensajeErrorBoleto('Boleto de TESIN válido.');
      return true;
    }
    //valido si es de TOPS
    if (validarTops(boleto)) {
      setBoletoValido(true);
      setErrorBoleto(false);
      setMensajeErrorBoleto('Boleto de TOPS válido.');
      return true;
    }
    // valido si es de banktrade
    if (validarBankTrade(boleto)) {
      setBoletoValido(true);
      setErrorBoleto(false);
      setMensajeErrorBoleto('Boleto de BANKTRADE válido.');
      return true;
    }
    //sino tiene ningun formato devuelvo error
    setBoletoValido(false);
    setErrorBoleto(true);
    setMensajeErrorBoleto('Introduzca un formato de boleto válido.');
    return true;
  } else {
    setBoletoValido(false);
    setErrorBoleto(true);
    setMensajeErrorBoleto(
      'El boleto debe contener 20 caracteres alfanuméricos.'
    );
    return false;
  }
};

export const validarNroDeDespachoDeImportacion = (
  boleto: string,
  setMensajeErrorSimi: (value: React.SetStateAction<string>) => void,
  setSimiValido: (value: React.SetStateAction<boolean>) => void,
  setErrorSimi: (value: React.SetStateAction<boolean>) => void
): boolean => {
  if (checkSimiLength(boleto)) {
    const resultado = validarNumeroDeDespachoDeImportacion(boleto);
    if (resultado) {
      setSimiValido(true);
      setErrorSimi(false);
      setMensajeErrorSimi('');
      return true;
    } else {
      setSimiValido(false);
      setErrorSimi(true);
      setMensajeErrorSimi('Introduzca un número SIMI válido.');
      return false;
    }
  } else {
    setSimiValido(false);
    setErrorSimi(true);
    setMensajeErrorSimi('El SIMI debe contener 16 caracteres.');
    return false;
  }
};

export const validarSimi = (
  simi: string,
  setMensajeErrorSimi: (value: React.SetStateAction<string>) => void,
  setSimiValido: (value: React.SetStateAction<boolean>) => void,
  setErrorSimi: (value: React.SetStateAction<boolean>) => void
): boolean => {
  const simiPattern = /^(\d{5})(SIMI|SIRA)(\d{6})([A-Z])$/i;

  if (simiPattern.test(simi)) {
    setSimiValido(true);
    setErrorSimi(false);
    setMensajeErrorSimi('');
    return true;
  } else {
    setSimiValido(false);
    setErrorSimi(true);
    setMensajeErrorSimi(
      'El SIMI debe tener el formato correcto (ejemplo: 23017SIRA028426P).'
    );
    return false;
  }
};

export const validarCcuce = (
  ccuce: string,
  setMensajeErrorCcuce: (value: React.SetStateAction<string>) => void,
  setCcuceValido: (value: React.SetStateAction<boolean>) => void,
  setErrorCcuce: (value: React.SetStateAction<boolean>) => void
): boolean => {
  if (!/^\d+$/.test(ccuce)) {
    setCcuceValido(false);
    setErrorCcuce(true);
    setMensajeErrorCcuce('El CCUCE debe contener solo números.');
    return false;
  } else if (ccuce.length !== 36) {
    setCcuceValido(false);
    setErrorCcuce(true);
    setMensajeErrorCcuce('El CCUCE debe tener 36 caracteres.');
    return false;
  } else {
    setCcuceValido(true);
    setErrorCcuce(false);
    setMensajeErrorCcuce('');
    return true;
  }
};

export const validarSecBolMultiple = (
  nroSimi: string,
  ccuce: string,
  secuenciaBoletoMultiple: string,
  setMensajeErrorSecBolMultiple: (value: React.SetStateAction<string>) => void,
  setSecBolMultipleValido: (value: React.SetStateAction<boolean>) => void,
  setErrorSecBolMultiple: (value: React.SetStateAction<boolean>) => void
): boolean => {
  if (checkSecBolMultipleLength(secuenciaBoletoMultiple)) {
    if (esNumero(secuenciaBoletoMultiple)) {
      // Valido que simi tenga algo
      if (
        nroSimi !== '' &&
        Number(secuenciaBoletoMultiple) !== 0 &&
        /^\d{1,5}$/.test(secuenciaBoletoMultiple)
      ) {
        setSecBolMultipleValido(false);
        setErrorSecBolMultiple(true);
        setMensajeErrorSecBolMultiple(
          'La secuencia del boleto debe ser 0 si el boleto tiene un número de SIMI valido.'
        );
        return false;
      }
      if (ccuce !== '' && !/^\d{1,5}$/.test(secuenciaBoletoMultiple)) {
        setSecBolMultipleValido(false);
        setErrorSecBolMultiple(true);
        setMensajeErrorSecBolMultiple(
          'La secuencia de boleto debe contener al menos un número si CCUCE tiene valor.'
        );
        return false;
      }
      setSecBolMultipleValido(true);
      setErrorSecBolMultiple(false);
      setMensajeErrorSecBolMultiple('');
      return true;
    } else {
      setSecBolMultipleValido(false);
      setErrorSecBolMultiple(true);
      setMensajeErrorSecBolMultiple(
        'La secuencia de Boletos Multiple solo acepta caracteres numericos.'
      );
      return false;
    }
  } else {
    setSecBolMultipleValido(false);
    setErrorSecBolMultiple(true);
    setMensajeErrorSecBolMultiple(
      'La secuencia de Boletos Multiple debe contener maximo 5 caracteres.'
    );
    return false;
  }
};
