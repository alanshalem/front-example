import { Cliente } from './Cliente.types';

export type ProyectadaFormType = {
  id?: number;
  cuit: string;
  denominacion: string;
  moneda: string;
  concepto: string;
  nroFormulario: string;
  nroInversion: string;
  monto: string;
  beneficiario: string;
  vinculada: string;
};

export type NuevaProyectadaType = {
  proyectada: ProyectadaFormType; 
  isEdition: boolean;
  model: ProyectadaFormType | undefined;
  persona: Cliente | undefined;
  genericFunc: (proyectada: any) => Promise<any>;
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

export type ProyectadaAuxiliar = {
  cuit: string;
  codigoConcepto: string;
  legajoUltimaModificacion: string;
  monto: string;
  raype: string;
  fechaCreacion: string;
  fechaProyectada: string;
};

export type Proyectada = {
  id?: number;
  cuit?: string;
  denominacion?: string;
  codigoConcepto?: string;
  raype?: string;
  moneda?: string;
  montoUsd?: number;
  monto?: number;
  cotizacion?: number;
  desvio?: number;
  fechaProyectada?: string;
  beneficiario?: string;
  vinculada?: string;
  fechaEnvio?: string;
  fechaAprobacion?: string;
  //si bien lo mando siemrpe como lo obtengo del context puede venir undefined hasta obtenerlo
  legajoUltimaModificacion?: string;
  legajoCreacion?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
  idEstado?: number;
};


type ProyectadaCreateMasivoDTO = {
  excelBase64: string,
  legajoCreacion: string;
}


export type CheckProyectada = {
  cuit: string;
  codigoConcepto: string;
  raype?: string;
};

export type NewProyectadaRequest = {
  proyectadaCreateDTO: Proyectada;
};
export type EditProyectadaRequest = {
  proyectadaEditDTO: Proyectada;
};

export type CheckProyectadaRequest = {
  proyectadaCheckDTO: CheckProyectada;
};

export type CheckProyectadaResponse = {
  isDuplicated: boolean;
};

export type FilterProyectadas = {
  proyectadaListDTO: Proyectada;
};

export type CreateMasivo = {
  proyectadaCreateMasivaDTO: ProyectadaCreateMasivoDTO;
};

export type ErrorIconsTypes = 'check' | 'Info' | 'error' | undefined;
