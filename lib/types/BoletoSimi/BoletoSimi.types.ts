export type BoletoSimiFormType = {
  id?: number;
  nroBoleto: string;
  nroSimi?: string;
  ccuce?: string;
  secuenciaBoletoMultiple?: string;
  idExcepcion?: string;
  descExcepcion?: string;
};

export type BoletoSimi = {
  id?: number;
  nroBoleto?: string;
  nroSimi?: string;
  ccuce?: string;
  secuenciaBoletoMultiple?: string;
  codigoExcepcion?: string;
  descExcepcion?: string;
  idEstado?: number; //para permitir que tenga mas de 2 estados
  legajoCreacion?: string;
  legajoAutorizador?: string;
  legajoUltimaModificacion?: string;
  legajoBaja?: string; //una baja es una modificacion
  fechaCreacion?: string;
  fechaAutorizacion?: string;
  fechaModificacion?: string; //una baja es una modificacion
  fechaExportacion?: string;
};

export type CheckBoleto = {
  nroBoleto: string;
  secuenciaBoletoMultiple: string;
};

export type NewBoletoSimiRequest = {
  simiCreateDTO: BoletoSimi;
};
export type EditBoletoSimiRequest = {
  simiEditDTO: BoletoSimi;
};

export type FilterBoletoSimi = {
  simiListDTO: BoletoSimi;
};

export type CheckBoletoRequest = {
  simiCheckDTO: CheckBoleto;
};
