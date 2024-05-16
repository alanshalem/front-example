export type ConciliacionComexSAPFilterAuxiliar = {
  fecha?: string;
  idEstado?: number | string;
  legajoAsignado?: string;
  legajoFinalizado?: string;
  idTipoDiferencia?: number | string;
  idAplicacion?: number | string;
  nroCuenta?: string;
  divisa?: string;
  nroOperacion?: string;
  nroRefOperPago?: string;
};

export type TipoDiferenciaTypes = {
  id: number;
  nombre: string;
};