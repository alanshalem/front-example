export type ContabilidadCruces = {
  analiticoId?: string;
  rubro?: string;
  concepto?: string;
  descripcionRubro?: string;
  centroCosto?: string;
  monto?: number;
  divisa?: string;
  tipoMovimiento?: string;
  legajoCreacion?: string;
  legajoAprobacion?: string;
  legajoUltimaModificacion?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
  fechaAprobacin?: string;
  fechaProcesoBatch?: string;
  idEstado?: number;
};

export type FilterContabilidadCruces = {
  contabilidadByFilterDTO: ContabilidadCruces;
};

export type ContabilidadesTableResponse = {
  nroOperacion?: string;
  fechaCreacion?: string;
  divisa?: string; 
  monto?: number;
  idEstado?: number;
  descEstado?: string;
  descEvento?: string;
  contabilidad?: ContabilidadCruces[];
};


type ContabilidadRow = {
  id: number;
  nroOperacion: string;
  monto: number;
  divisa: string;
  estado: string;
  idEstado: number;
  expandible: JSX.Element;
};

export type ContabilidadRows = {
  checked: boolean;
  row: ContabilidadRow | ContabilidadRow[];
  rowIndex: number | string;
};

type ContabilidadesFirmadasList = {
  idContabilidad: string[];
  legajoFirma: string;
};

export type ContabilidadesAFirmar = {
  contabilidadesAFirmarDTO: ContabilidadesFirmadasList;
};
