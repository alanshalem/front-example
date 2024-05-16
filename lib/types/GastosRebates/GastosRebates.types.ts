export type GastosRebatesFilterAuxiliar = {
  periodo?: string;
  idTipoAnalitico?: string;
  idCorresponsal?: string;
  idEstado?: string | number;
  fechaCalendarizada?: string;
  fechaUltimaModificacion?: string;
  referenciaExterna?: string;
  divisa?: string
};

export type GastosRebatesFilterModalAuxiliar = {
  periodo?: string;
  tipo?: number | string;
  corresponsalDivisa?: string ;
  referenciaExterna: string;
  importe?: string | number;
  nroLiquidacion?: string;
  nroBoleto?: string;
  cotizacionBoleto?: string;
  legajoCreacion: string;
};

export type AvanzarCalendaridazadaFilterAuxiliar = {
  nroBoleto? : string;
  cotizacion?: string;
  grupo?: string;
};

export type AvanzarCalendarizadaBody = {
  nroBoleto? : string;
  cotizacion?: number;
  grupo?: string;
  idAnalitico?: string | number;
}

export type FilterGastosRebates = {
  gastosRebatesByFilterDto: GastosRebatesFilterAuxiliar;
};

export type AnaliticoGastoRebate = {
  idAnalitico: number;
  idTipoAnalitico: number;
  nombreTipoAnalitico: string;
  periodo: string;
  referenciaExterna: string | null;
  nroLiquidacion: string;
  swift: string;
  divisa: string;
  importe: number;
  idEstado: number;
  nombreEstado: string;
  corresponsalDivisa: string;
  fechaCalendarizada: string;
  fechaCreacion: string;
}

export type SaveGastoRebateBody = {
  idTipoAnalitico: number | string;
  idCorresponsal: number | string;
  divisa: string; 
  importe: number | string;
  periodo: string;
  referencia: string;
  nroBoleto?: string;
  cotizacion?: number;
  legajoCreacion?: string;
};

export type GastoRebateResponse = {
  idAnalitico?: number;
  idTipoAnalitico?: number;
  nombreTipoAnalitico?: string;
  periodo?: string;
  referenciaExterna?:string;
  nroLiquidacion?: string;
  swift?: string;
  divisa?: string;
  importe?: number;
  idEstado?: number;
  nombreEstado?: string;
  corresponsalDivisa?: string;
  fechaCalendarizada?: string;
  fechaCreacion?: string;
  fechaUltimaModificacion?: string;
};

export type AprobarGastoRebateBody = {
  idTipoAnalitico?: number;
  grupo?: string;
  legajoAprobacion?: string;
};

export type GastosRebatesChecksAprobarRechazar = {
  id?: number;
  idTipoAnalitico?: number;
  estado?: string;
}

export type RowGastoCalendarizado = {
  tipoAnalitico?: string;
  periodo?: string;
  nroReferencia?: string;
  nroLiquidacion?: string;
  corresponsalDivisa?: string;
  importe?: string;
  nombreEstado?: any;
  fechaCalendarizada?: string;
  fechaUltimaModificacion?: string;
  estado?: string;
  idAnalitico?: number;
  idTipoAnalitico?: number;
  id?: number;
};