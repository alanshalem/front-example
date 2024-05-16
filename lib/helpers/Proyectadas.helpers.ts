import {
  checkProyectada,
  getProyectadasByFilter,
} from '@lib/services/Proyectadas.services';
import { getDatosPersonas } from '@lib/services/TOPS.services';
import { Cliente } from '@lib/types/Cliente.types';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';
import {
  CheckProyectadaRequest,
  EditProyectadaRequest,
  FilterProyectadas,
  NewProyectadaRequest,
  NuevaProyectadaType,
  Proyectada,
  ProyectadaAuxiliar,
  ProyectadaFormType,
} from '@lib/types/Proyectada.types';
import { formatDateUS } from '@lib/utils/Date';
import { conceptosHardcodeados } from '@lib/utils/variables';
import { ConceptoDeBoleto } from '../types/COMEX/ConceptoDeBoleto.types';
import { isEmpty } from './helpers';

const carateresNumericos = 'Solo se permiten caracteres numéricos.';

export const buildConceptosList = (
  conceptos: ConceptoDeBoleto[] | undefined
): ItemDropdown[] => {
  const auxConceptos: ItemDropdown[] = [];
  if (conceptos) {
    conceptos.forEach(p => {
      auxConceptos.push({ text: `${p.codigo} - ${p.descripcion}`, value: p.codigo });
    });
    return auxConceptos;
  }
  return [];
};

export const buildConceptoInitialValueFilter = (
  e: ConceptoDeBoleto | undefined
): ItemDropdown => {
  if (e) {
    return {
      value: e.codigo,
      text: `${e.codigo} - ${e.descripcion}`,
    };
  } else {
    return {
      value: '',
      text: '',
    };
  }
};

export const handleSearchCuit = async (nroCuit: string): Promise<any> => {
  try {
    return await getDatosPersonas(nroCuit);
  } catch {
    return null;
  }
};

export const checkLength = (value: string) => {
  return value.replace(/\./g, '').length > 11;
};

const checkNotZero = (value: string) => {
  return Number(value) === 0;
};

export const handleMonto = (
  value: string,
  setErrorMonto: (value: React.SetStateAction<boolean>) => void,
  setMontoValido: (value: React.SetStateAction<boolean>) => void,
  setMensajeErrorMonto: (value: React.SetStateAction<string>) => void
) => {
  if (value.includes(',')) {
    setErrorMonto(true);
    setMontoValido(false);
    setMensajeErrorMonto('El monto debe ser un número entero.');
  } else if (value.includes('-')) {
    setErrorMonto(true);
    setMontoValido(false);
    setMensajeErrorMonto('El monto debe ser un número positivo.');
  } else if (checkLength(value)) {
    setErrorMonto(true);
    setMontoValido(false);
    setMensajeErrorMonto('El máximo de dígitos es 11.');
  } else if (checkNotZero(value)) {
    setErrorMonto(true);
    setMontoValido(false);
    setMensajeErrorMonto('El monto no puede ser cero.');
  } else {
    setErrorMonto(false);
    setMontoValido(true);
    setMensajeErrorMonto('');
  }
};

export const handleNumeroFormulario = (
  value: string,
  proyectada: ProyectadaFormType,
  setErrorNroFormulario: (value: React.SetStateAction<boolean>) => void,
  setNroFormularioValido: (value: React.SetStateAction<boolean>) => void,
  setMensajeErrorNroFormulario: (value: React.SetStateAction<string>) => void
) => {
  const reg = /^0+$/;
  if (value.length > 0 && proyectada.nroInversion.length === 0) {
    setErrorNroFormulario(true);
    setNroFormularioValido(false);
    setMensajeErrorNroFormulario(
      'El número de inversión es obligatorio si existe el número de formulario.'
    );
  } else {
    setErrorNroFormulario(false);
    setNroFormularioValido(true);
    setMensajeErrorNroFormulario('');
    if (value.length > 6) {
      setErrorNroFormulario(true);
      setNroFormularioValido(false);
      setMensajeErrorNroFormulario('El máximo de caracteres es 6.');
    } else if (value.includes(',') || value.includes('.')) {
      setErrorNroFormulario(true);
      setNroFormularioValido(false);
      setMensajeErrorNroFormulario(carateresNumericos);
    } else if (reg.test(value)) {
      setErrorNroFormulario(true);
      setNroFormularioValido(false);
      setMensajeErrorNroFormulario('Al menos un caracter debe ser mayor a 0.');
    } else {
      setErrorNroFormulario(false);
      setNroFormularioValido(true);
      setMensajeErrorNroFormulario('');
    }
  }
};

export const handleNumeroInversion = (
  value: string,
  proyectada: ProyectadaFormType,
  setErrorNroInversion: (value: React.SetStateAction<boolean>) => void,
  setNroInversionValido: (value: React.SetStateAction<boolean>) => void,
  setMensajeErrorNroInversion: (value: React.SetStateAction<string>) => void
) => {
  const reg = /^0+$/;
  if (value.length > 0 && proyectada.nroFormulario.length === 0) {
    setErrorNroInversion(true);
    setNroInversionValido(false);
    setMensajeErrorNroInversion(
      'El número de formulario es obligatorio si existe el número de inversión.'
    );
  } else {
    setErrorNroInversion(false);
    setNroInversionValido(true);
    setMensajeErrorNroInversion('');
    if (value.length > 10) {
      setErrorNroInversion(true);
      setNroInversionValido(false);
      setMensajeErrorNroInversion('El máximo de caracteres es 10.');
    } else if (value.includes(',') || value.includes('.')) {
      setErrorNroInversion(true);
      setNroInversionValido(false);
      setMensajeErrorNroInversion(carateresNumericos);
    } else if (reg.test(value)) {
      setErrorNroInversion(true);
      setNroInversionValido(false);
      setMensajeErrorNroInversion('Al menos un caracter debe ser mayor a 0.');
    } else {
      setErrorNroInversion(false);
      setNroInversionValido(true);
      setMensajeErrorNroInversion('');
    }
  }
};

export const createRaype = (proyectada: ProyectadaFormType) => {
  if (
    proyectada.nroFormulario.length > 0 &&
    proyectada.nroInversion.length > 0
  ) {
    return (
      proyectada.nroFormulario.padStart(6, '0') +
      proyectada.nroInversion.padStart(10, '0')
    );
  }
  return ''; //devuelvo un string vacio
};

export const returnDenominacion = (persona: Cliente | undefined): string => {
  if (persona?.tipo === 'FISICA') {
    return `${persona?.nombre} ${persona?.apellido}`;
  } else {
    return persona?.razonSocial ?? '';
  }
};

export const isFormValid = (
  montoValido: boolean,
  proyectada: ProyectadaFormType,
  cuitValido: boolean,
  errorNroFormulario: boolean,
  errorNroInversion: boolean,
  errorBeneficiario: boolean,
  concepto: string
): boolean => {
  return !(
    montoValido &&
    !!proyectada.monto &&
    cuitValido &&
    !errorNroFormulario &&
    !errorNroInversion &&
    !errorBeneficiario &&
    proyectada.concepto.length > 0 &&
    concepto.length > 0
  );
};

const checkCuit = async (
  cuitLocal: string,
  setPersona: (value: React.SetStateAction<Cliente | undefined>) => void,
  setExistePersona: (value: React.SetStateAction<boolean>) => void,
  setMensajeError: (value: React.SetStateAction<string>) => void,
  setCuitValido: (value: React.SetStateAction<boolean>) => void,
  setErrorCuit: (value: React.SetStateAction<boolean>) => void
): Promise<any> => {
  handleSearchCuit(cuitLocal).then((res: any) => {
    if (res) {
      setPersona(res); //seteo el cliente
      setExistePersona(true);
      setMensajeError('');
      setCuitValido(true);
      setErrorCuit(false);
    } else {
      setExistePersona(false);
      setMensajeError('El cuit ingresado no existe');
      setCuitValido(false);
      setErrorCuit(true);
    }
  });
};

export const handleChangeError = async (
  cuitAux: string,
  setCuitValido: (value: React.SetStateAction<boolean>) => void,
  setErrorCuit: (value: React.SetStateAction<boolean>) => void,
  setMensajeError: (value: React.SetStateAction<string>) => void,
  setExistePersona: (value: React.SetStateAction<boolean>) => void,
  setPersona: (value: React.SetStateAction<Cliente | undefined>) => void
) => {
  const reg = /^\d+$/;
  if (!reg.test(cuitAux)) {
    setMensajeError(carateresNumericos);
    setCuitValido(false);
    setErrorCuit(true);
  } else {
    if (cuitAux.length === 11 && reg.test(cuitAux)) {
      setMensajeError('');
      setCuitValido(true);
      setErrorCuit(false);
      if (cuitAux.length === 11 && reg.test(cuitAux)) {
        await checkCuit(
          cuitAux,
          setPersona,
          setExistePersona,
          setMensajeError,
          setCuitValido,
          setErrorCuit
        );
      }
    } else {
      setExistePersona(false);
      setMensajeError('El cuit debe contener once caracteres');
      setErrorCuit(true);
      setCuitValido(false);
    }
  }
};

export function newProyectada({
  proyectada,
  isEdition,
  model,
  persona,
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
}: NuevaProyectadaType) {
  setLoading(true);
  let editProyectadaObj: EditProyectadaRequest;
  let newProyectadaObj: NewProyectadaRequest;
  if (isEdition) {
    editProyectadaObj = {
      proyectadaEditDTO: {
        id: model?.id,
        cuit: proyectada.cuit,
        codigoConcepto: proyectada.concepto,
        moneda: proyectada.moneda,
        monto: parseInt(proyectada.monto.replace(/\./g, '')),
        raype: createRaype(proyectada),
        denominacion: returnDenominacion(persona),
        legajoUltimaModificacion: username.slice(0, 8),
        beneficiario: proyectada.beneficiario,
        vinculada: proyectada.vinculada,
      },
    };
  } else {
    newProyectadaObj = {
      proyectadaCreateDTO: {
        cuit: proyectada.cuit,
        codigoConcepto: proyectada.concepto,
        moneda: proyectada.moneda,
        monto: parseInt(proyectada.monto.replace(/\./g, '')),
        raype: createRaype(proyectada),
        denominacion: returnDenominacion(persona),
        legajoCreacion: username.slice(0, 8),
        beneficiario:
          proyectada.beneficiario.length === 0 ? 'NA' : proyectada.beneficiario,
        vinculada: proyectada.vinculada,
      },
    };
  }

  //ACA ACEPTAR ES EL CREATE O EDIT, DEPENDE DE DONDE LLAME AL MODAL
  genericFunc(isEdition ? editProyectadaObj : newProyectadaObj)
    .then((res: any) => {
      proyectada.beneficiario = '';
      setLoading(false);
      setShowToast(true);
      setTitle('Proyectada creada correctamente.');
      setMessage(`Fecha de proyección: ${res.fechaProyectada.slice(0, 10)}`);
      toastCall(
        `Proyectada creada correctamente. Fecha de proyección: ${res.fechaProyectada.slice(
          0,
          10
        )}`,
        true
      );
      closeModal();
      clearForm();
      refreshTable();
    })
    .catch((errs: any) => {
      setLoading(false);
      setShowToast(true);
      setTitle('Error al crear la proyectada...');
      setMessage(
        JSON.parse(errs.response.data.errors[0].description)[
          'ProyectadaCreateDTO.Cuit'
        ][0]
      );
      toastCall(
        `Error al crear la proyectada...  ${
          JSON.parse(errs.response.data.errors[0].description)[
            'ProyectadaCreateDTO.Cuit'
          ][0]
        }`,
        false
      );
    });
}

export function checkDuplicatedProyectada(
  proyectada: ProyectadaFormType
): Promise<any> {
  const proy: CheckProyectadaRequest = {
    proyectadaCheckDTO: {
      cuit: proyectada.cuit,
      codigoConcepto: proyectada.concepto,
      raype: createRaype(proyectada),
    },
  };

  return checkProyectada(proy);
}

export function compareConceptos(a: ConceptoDeBoleto, b: ConceptoDeBoleto) {
  // Use toUpperCase() to ignore character casing
  const codA = a.codigo ?? ''.toUpperCase();
  const codB = b.codigo ?? ''.toUpperCase();

  let comparison = 0;
  if (codA > codB) {
    comparison = 1;
  } else if (codA < codB) {
    comparison = -1;
  }
  return comparison;
}

// TRAIGO TODAS LAS PROYECTADAS DEL DIA
export const getAllProyectadas = (
  setProyectadasList: (value: React.SetStateAction<Proyectada[]>) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void
) => {
  const filtroProyectadaObj: FilterProyectadas = {
    proyectadaListDTO: {
      cuit: null,
      codigoConcepto: null,
      legajoUltimaModificacion: null,
      monto: null,
      raype: null,
      fechaCreacion: formatDateUS(new Date()),
      fechaProyectada: null,
    },
  };
  getProyectadasByFilter(filtroProyectadaObj)
    .then((result: any) => {
      setProyectadasList(result);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

export const prepareFilter = (
  filtroProyectada: ProyectadaAuxiliar,
  setProyectadasList: (value: React.SetStateAction<Proyectada[]>) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void
) => {
  // preparo el filtro
  const filtroProyectadaObj: FilterProyectadas = {
    proyectadaListDTO: {
      cuit: filtroProyectada.cuit ? filtroProyectada.cuit : null,
      codigoConcepto: filtroProyectada.codigoConcepto
        ? filtroProyectada.codigoConcepto
        : null,
      legajoUltimaModificacion: filtroProyectada.legajoUltimaModificacion
        ? filtroProyectada.legajoUltimaModificacion
        : null,
      monto: filtroProyectada.monto
        ? parseInt(filtroProyectada.monto.replace(/\./g, ''))
        : null,
      raype: filtroProyectada.raype ? filtroProyectada.raype : null,
      fechaCreacion: filtroProyectada.fechaCreacion
        ? filtroProyectada.fechaCreacion
        : null,
      fechaProyectada: filtroProyectada.fechaProyectada
        ? filtroProyectada.fechaProyectada
        : null,
    },
  };
  getProyectadasByFilter(filtroProyectadaObj)
    .then((result: any) => {
      setProyectadasList(result);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

//devuelve true si todos los campos del filtro estan vacios
export const verificarFiltro = (
  filtroProyectada: ProyectadaAuxiliar
): boolean => {
  return (
    isEmpty(filtroProyectada.cuit) &&
    isEmpty(filtroProyectada.codigoConcepto) &&
    isEmpty(filtroProyectada.legajoUltimaModificacion) &&
    isEmpty(filtroProyectada.monto) &&
    isEmpty(filtroProyectada.raype) &&
    isEmpty(filtroProyectada.fechaCreacion) &&
    isEmpty(filtroProyectada.fechaProyectada)
  );
};

//esto tiene que devolver si/no/opcional
const checkLlevaBeneficiario = (conceptoAux: string): string => {
  const concepto = conceptosHardcodeados.find(
    concepto => concepto.codigo === conceptoAux
  );
  return concepto?.llevaBeneficiario || 'SI';
};

export const handleCheckChange = (
  value: boolean,
  field: string,
  persona: Cliente,
  proyectada: ProyectadaFormType,
  setProyectada: (value: React.SetStateAction<ProyectadaFormType>) => void
): void => {
  setProyectada(() => ({
    ...proyectada,
    [field]: value === true ? 'S' : 'N',
    razonSocial: persona?.razonSocial,
  }));
};

export const handleChange = (
  value: string,
  field: string,
  persona: Cliente,
  proyectada: ProyectadaFormType,
  setProyectada: (value: React.SetStateAction<ProyectadaFormType>) => void,
  setLlevaBeneficiario?: React.Dispatch<React.SetStateAction<string>>
) => {
  if (field === 'cuit' && persona?.tipo === 'FISICA') {
    setProyectada(() => ({
      ...proyectada,
      [field]: value,
      nombre: persona.nombre,
      apellido: persona.apellido,
    }));
  } else {
    setProyectada(() => ({
      ...proyectada,
      [field]: value,
      razonSocial: persona?.razonSocial,
    }));
  }
  if (field === 'concepto') {
    setLlevaBeneficiario(checkLlevaBeneficiario(value));
    if (checkLlevaBeneficiario(value) === 'SI') {
      setProyectada(() => ({
        ...proyectada,
        [field]: value,
      }));
    } else {
      setProyectada(() => ({
        ...proyectada,
        [field]: value,
        beneficiario: '',
      }));
    }
  }
};

function process(date) {
  let parts = date.split('/');
  return new Date(parts[2], parts[1] - 1, parts[0]);
}
export const ordenarFecha = (a: string, b: string, order: string) => {
  if (order === 'asc') {
    if (process(a) < process(b)) {
      return 1;
    } else {
      return -1;
    }
  } else {
    if (process(a) > process(b)) {
      return 1;
    } else {
      return -1;
    }
  }
};

export const handleBeneficiarioValido = (
  value: string,
  setErrorBeneficiario: (value: React.SetStateAction<boolean>) => void,
  setBeneficiarioValido: (value: React.SetStateAction<boolean>) => void,
  setMensajeErrorBeneficiario: (value: React.SetStateAction<string>) => void,
  llevaBeneficiario: string
) => {
  const trimmedValue = value.trim();

  if (trimmedValue.length === 0 && llevaBeneficiario === 'SI') {
    setErrorBeneficiario(true);
    setBeneficiarioValido(false);
    setMensajeErrorBeneficiario('El beneficiario es obligatorio.');
  } else {
    setErrorBeneficiario(false);
    setBeneficiarioValido(true);
    setMensajeErrorBeneficiario('');
  }
};

export function arrayProyectadaToCSV(data: any, fecha: string) {  
  const fechaDate = new Date(fecha)
  const fechaNombre = fechaDate.toISOString().split('T')[0];

  const csvContent = data.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const fileName = `Proyectada_${fechaNombre}.csv`;
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};