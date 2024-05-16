export type PrevisionFiltersAuxiliar = {
  periodo?: string;
  corresponsal?: string | number;
  divisa?: string;
  estado?: number | string;
};

export type FilterPrevisiones = {
  previsionesByFilterDto: PrevisionFiltersAuxiliar
};

export type PrevisionResponse = {
  idCorresponsal: number;
  idAnalitico: number;
  swift: string;
  divisa: string;
  promedioUltimosPeriodos: number;
  previsionAmortizada: number;
  previsionAprobada: number;
  importePrevisionar: number;
  nombreEstado: string;
  previsiones: previsiones[]
};

type previsiones = {
  swift: string;
  periodo: string;
  divisa: string;
  importe: number;
  nombreEstado: string;
};

export type PrevisionPost = {
  idCorresponsal?: number;
  divisa?: string;
  periodo?: string;
  importePrevisionar?: number;
  idTipoAnalitico?: number;
  legajoCreacion?: string;
};

export type RowsPrevisionesProps = {
  periodo: string,
  corresponsal: string,
  divisa: string,
  promedioUltimosPeriodos: number | string,
  previsionRemanente: number | string,
  previsionAprobada: number | string,
  importePrevisionar: JSX.Element,
  estado: JSX.Element,
  elipse: JSX.Element,
};

export type UserFirmante = {
  grupo?: string,
  legajoAprobacion?: string,
};