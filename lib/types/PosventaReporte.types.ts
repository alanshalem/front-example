export type PosventaReporteAuxiliar = {
  fechaCreacion?: string;
  nroOperacion?: string;
  razonSocial?: string;
  idEstado: string;
  cuit: string;
  idPosVentaTipo: string;
  moneda: string;
  concepto: string; // concepto === idPosVentaParametria
  idAplicacion: string;
};

export interface PosventaTableItem {
  nroOperacion: string;
  cuit: string;
  monto: number;
  divisa: string;
  concepto: string;
  razonSocial: string;
  descEstado: string;
  fechaCreacion: Date;
  numeroCuentaDebitoTransferencia: string;
  posVentaDetalle: PosVentaDetalle[];
  detalleWorkflow: DetalleWorkflow[];
}
export interface PosVentaDetalle {
  impuesto: string;
  idPosVentaParametriaTipo: number;
  idPosVentaTipo: number;
  montoOriginal: number;
  montoADevolver: number;
  divisa: string;
  alicuota: number;
}

export interface DetalleWorkflow {
  workflow: string;
  descripcion: string;
  resultado: boolean;
  status: string;
  descEstado: string;
  fechaProceso: string;
}

export interface DataClienteGenerica {
  cliente?: string;
  nroOperacion: string;
  razonSocial: string;
  cuit: string;
  divisa: string;
  monto: number;
  sucursal: string;
  tipoCuenta: string;
  tipoDeCambio: number;
  codigoConcepto: string;
  cuentaDebitoComisiones: string;
  cuentaDebitoTransferencia: string;
  posVentaDetalle: PosVentaDetalle[];
}
