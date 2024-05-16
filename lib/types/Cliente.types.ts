export type Cliente = {
  apellido?: string;
  codigoPais: string;
  documentos: Documentos;
  domicilio: string;
  hostId: string;
  localidad: string;
  nombre?: string;
  telefono: string;
  tipo: string;
  razonSocial?: string;
};

export type Documentos = {
  descripcion: string;
  id: string;
  tipo: string;
};
export type PosicionCliente = {
  cantidadProductos: number;
  empleado: boolean;
  posicionPropia: boolean;
  productos: Productos;
};
export type Productos = {
  cuentas: CuentasCliente[];
};
export type CuentasCliente = {
  codigo: string;
  codigoSubsistema: string;
  descripcion: string;
  moneda: number;
  monedaIso: string;
  numero: string;
  saldo: number;
  sucursalAdministradora: number;
};
