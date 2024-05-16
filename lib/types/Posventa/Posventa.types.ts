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

export interface PosventaGenericaTableItem {
  nroOperacion: string;
  cuit: string;
  monto: number;
  concepto: string;
  razonSocial: string;
  estado: string;
  fechaAprobacion: Date;
  legajoCreacion: string;
  aplicacion: string;
  secuencia: string;
  tipoPosventa: string;
}
export interface DataCliente {
  razonSocial?: string;
  nroOperacion: string;
  cuit: string;
  divisa: string;
  monto: number;
  tipoDeCambio: number;
  codigoConcepto: string;
  cuentaDebitoComisiones: CuentaComisionesOTransferencia;
  cuentaDebitoTransferencia: CuentaComisionesOTransferencia;
  posVentaDetalle: PosVentaDetalle[];
}

interface CuentaComisionesOTransferencia {
  divisa: string;
  nroCuenta: string;
  sucursal: string;
  tipoCuenta: string;
}

export interface PosVentaDetalle {
  impuesto: string;
  idPosVentaParametriaTipo: number;
  idPosVentaTipo: number;
  montoOriginal: number;
  montoADevolver: number;
  divisa: string;
  alicuota: number;
  idImpuesto: string | null;
}

export interface DetalleWorkflow {
  workflow: string;
  descripcion: string;
  resultado: boolean;
  status: string;
  descEstado: string;
  fechaProceso: string;
}

export type PosventaAuxiliar = {
  fechaCreacion: string | Date;
  nroOperacion: string;
  razonSocial: string;
  divisa: string;
  estado: string;
  cuit: string;
  concepto: string;
  tipoPosventa: string;
};

export type PosventaGenericaAuxiliar = {
  fechaCreacion: string;
  nroOperacion: string;
  razonSocial: string;
  divisa: string;
  estado: string;
  cuit: string;
  concepto: string;
};

// CAMBIAR ESTO
type PosventaRow = {
  idPosVentaDetalle: number;
  nroOperacion: string;
  cuit: string;
  razonSocial: string;
  divisaOperacion: string;
  montoOperacion: number;
  concepto: string;
  impuesto: string;
  divisa: string;
  montoOriginal: number;
  monto: number;
  fechaAprobacion: string;
  descEstado: string;
};

export type PosventaRows = {
  checked: boolean;
  row: PosventaRow | PosventaRow[];
  rowIndex: number | string;
};

type PosventasModificadasList = {
  idPosVentaDetalle: number[];
  legajoUltimaModificacion?: string;
  legajoAprobacion?: string;
  grupo?: string;
};

export type PosventasAAprobar = {
  posVentaApprove: PosventasModificadasList;
};

export type PosventasARechazar = {
  posVentaReject: PosventasModificadasList;
};

export interface DataClientePosventaGenericaAuxiliar {
  idAplicacion: string;
  idPosVentaTipo?: string;
  idPosVentaParametriaTipo?: string;
  divisa: string;
  idPosVentaParametria?: string;
  cuit: string;
  nroOperacion: string;
  secuencia: string;
  cuenta?: string;
  monto?: number;
  razonSocial?: string;
  nroCuenta?: string;
  alicuota?: string;
  sucursal?: string;
  sucursalAdministradora?: string;
  tipoCuenta?: string;
  legajoCreacion?: string;
}

export interface DataClienteNuevaPosventaAuxiliar {
  nroOperacion: string;
  secuencia: string;
  idPosVentaTipo?: string;
}

export interface ValidationParameters {
  nroOperacion: string;
  secuencia: string;
  idPosVentaTipo: string;
  setNroOperacionValido: (value: React.SetStateAction<boolean>) => void;
  setErrorNroOperacion: (value: React.SetStateAction<boolean>) => void;
  setMensajeError: (value: React.SetStateAction<string>) => void;
  setDataCliente: (
    value: React.SetStateAction<DataCliente | undefined>
  ) => void;
  setLoading: (value: React.SetStateAction<boolean>) => void;
}

export interface PosventaTipo {
  id?: number;
  nombre?: string;
  esCobro?: boolean;
  esDevolucion?: boolean;
}

export interface ConceptoTipo {
  id?: number;
  nombre?: string;
}

export interface ConceptoNombre {
  nombre?: string;
}

export interface BoletoPosventaModal {
  nroBoleto: string;
  idCorresponsal: string | number;
  cotizacionVenta: string;
  cotizacionCompra: string;
  divisa: string;
  importe: string | number
}

export interface BoletoPosventaValidar {

}

/*
  guardar
  {
  "boletoStock": {
    "idPosVentaDetalle": 3742,
    "nroBoleto": "weqeqw",
    "idCorresponsal": "dsa",
    "divisa": "ars",
    "importe": 10,
    "cotizacionVenta": 10,
    "cotizacionCompra": 10,
    "legajoCreacion": "l1002974"
  }
}

*/