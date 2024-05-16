export type AnaliticoDetalle = {
  rubro?: string;
  concepto?: string;
  descripcionRubro?: string;
  importe?: number;
  tipoMovimiento?: string;
  centroCosto?: number;
  divisa?: string;
};

export type Analitico = {
  identificacion?: string;
  idEventoContable?: number;
  fechaContable?: string;
  legajoCreacion?: string;
  observacion?: string;
  detalle?: AnaliticoDetalle[];
};

export type SimulacionDTO = {
  corresponsal?: string;
  importe?: number;
  divisa?: string;
  simulacionAnalitico?: Analitico;
};

type ValidacionesDTO = {
  source?: string;
  message?: string;
};

export type simulacionAnaliticoDTO = {
  value: SimulacionDTO;
  validaciones: ValidacionesDTO;
  success: boolean;
};

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  eventosContables: Evento[];
}

export interface Evento {
  id: number;
  codigo: string;
  descripcion: string;
}

export type SimulacionRequestDTO = {
  generarSimulacionAnalitico: {
    idEvento: number;
    nroOperacion: string;
  };
};
