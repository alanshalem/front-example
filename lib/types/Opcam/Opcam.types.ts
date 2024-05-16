export type OpcamFiltersAuxiliar = {
  fechaInformacion?: string;
  tipoOperacion?: string;
  nroBoleto?: string;
  tipoIdent?: string;
  nroIdent?: string;
  codConcepto?: string;
  codMoneda?: string;
};

export type FilterOpcam = {
  preOPCAMByFilterDTO: OpcamFiltersAuxiliar;
};
