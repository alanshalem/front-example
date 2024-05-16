import { Cliente } from '../Cliente.types';

export type ContabilidadFormType = {
  id?: number;
  cuit: string;
  denominacion: string;
  moneda: string;
  concepto: string;
  nroFormulario: string;
  nroInversion: string;
  monto: string;
};
export type EventoFormType = {
  tipoEvento?: string;
};

export type NuevaContabilidadType = {
  contabilidad: ContabilidadFormType;
  isEdition: boolean;
  model: ContabilidadFormType | undefined;
  persona: Cliente | undefined;
  genericFunc: (contabilidad: any) => Promise<any>;
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

export type Contabilidad = {
  id?: number;
  numOp1?: string;
  numOp2?: string;
  origen?: string;
  secuencia?: string;
  diferencia?: string;
  corte?: string;
  codcta?: string;
  debe?: number;
  haber?: number;
  legajoUltimaModificacion?: string;
  legajoCreacion?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
  fechaProceso?: string;
  fechaContable?: string;
  idEstado?: number;
};

export type CheckContabilidad = {
  cuit: string;
  codigoConcepto: string;
  raype?: string;
};

export type NewContabilidadRequest = {
  contabilidadCreateDTO: Contabilidad;
};
export type EditContabilidadRequest = {
  contabilidadEditDTO: Contabilidad;
};

export type CheckContabilidadRequest = {
  contabilidadCheckDTO: CheckContabilidad;
};

export type CheckContabilidadResponse = {
  isDuplicated: boolean;
};

export type FilterContabilidad = {
  crucesContablesByFilterDTO: Contabilidad;
};

export type CreateMasivo = {
  excelBase64: string | ArrayBuffer | [];
};

export type EstadoType = {
  text: string;
  state: string;
};

export type EventosContablesContabilidadManualTypes = {
  id: number;
  codigo: string;
  descripcion: string;
  esGenerico: boolean;
};

export type ReferenciasContablesContabilidadManualTypes = {
  id: number;
  nombre: string;
};
export interface initialStateDataAuxiliarInicialInterface {
  idEventoContable: string;
  idTipoReferencia: string;
  tipoDocumento: string;
  nroDocumento: string;
  idCorresponsal: string;
  identificacion: string;
  fechaValor: string;
}

export interface initialStateDataAuxiliarIntermediaInterface {
  cotizacion: string;
  divisa: string;
  importe: string;
  centroCosto: string;
}
