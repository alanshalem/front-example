export type CruceOpcamTopsFiltersAuxiliar = {
  fechaCruce?: string;
  nroBoleto?: string;
  tipoOperacion?: string;
  tipoCondicion?: string;
  aplicacion?: string;
  tipoDiferencia?: string;
  valor?: string;
};

export type FilterOpcamTops = {
  ConciliacionBoletoByFilterDTO: CruceOpcamTopsFiltersAuxiliar;
};
