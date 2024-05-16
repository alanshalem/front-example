export type AlertasFiltersAuxiliar = {
  aplicacion?: number | string;
  fecha?: string;
  tipo?: string | string;
};

export type AlertasTableProps = {
  alertasConciliacionList: AvisosResponse[];
  handleModal: (e: any) => void;
};

export type AvisosModalDetalleProps = {
  isModalActive: boolean;
  closeModal: () => void;
  alertasConciliacionList: AvisosResponse[];
  dataModal: number | null;
  setDataModal: any
};

export type DetalleAviso = {
  id: number;
  rubro: string;
  centroDeCosto: string;
  tipoMovimiento: string;
  divisa: string;
  importe: number;
  fechaValor: string;
};

export type AvisosResponse = {
  id: number;
  nroOperacionSecuencia: string;
  aplicacion: string;
  fecha: string;
  tipoAlerta: string;
  esquemaContable: string;
  detalle: DetalleAviso[];
};

export type AvisosRequestBody = {
  avisoRequest: {
    idAplicacion?: number | null;
    idTipoAlerta?: number | null;
    fecha?: string | Date;
  };
};

export type TipoDeAlertas = {
  id: number;
  nombre: string;
  descripcion: string;
  identificador: null | string;
};
