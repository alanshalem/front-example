export type GestionDeResultadosFiltersAuxiliar = {
  periodo?: string;
  tipoResultado?: string | number;
  divisa?: string;
  estado?: number | string;
};

export type BodyFilterGestionDeResultados = {
  periodo: string;
  tipoResultado?: string | number;
  divisa?: string;
  estado?: number | string; 
};