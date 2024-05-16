export type EsquemaContableAuxiliar = {
  aplicacion?: string | number;
  idEventoContable?: string | number;
  divisa?: string;
  centroCosto?: string;
  descripcion?: string;
  rubro?: string;
  concilia?: string;
};

export type FilterEsquemaContable = {
  eventoContableAplicacionFilterRequestDTO: EsquemaContableAuxiliar;
};

export interface DataEsquemaContableNuevoEsquemaContableConciliacion {
  idRubro: string;
  descripcion: string;
  idCentroDeCosto: string;
  concilia: boolean;
}

export interface DataEsquemaContableEditarEsquemaContableConciliacion {
  idRubroCentroDivisa: string;
  rubro: string;
  descripcion?: string;
  centroDeCosto?: string;
  concilia?: boolean;
}
