export type EsquemaContableConciliacionAuxiliar = {
  idCentroDeCosto?: number | string;
  idRubro?: number | string;
  concilia?: string;
};

export type FilterEsquemaContableConciliacion = {
  rubroCentroDivisaRequestDTO: EsquemaContableConciliacionAuxiliar;
};
