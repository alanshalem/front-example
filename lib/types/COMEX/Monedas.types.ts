export class Moneda {
  descripcion?: string;
  habilitadaParaCanal?: boolean;
  iso?: string;
  nroSwift?: string;
  sml?: boolean;
  bcra?: string;
  stock?: string;
  sap?: string;
  calypso?: string;
  calypsoUSD?: string;
  afip?: string;
}

export class Documento {
  id?: number;
  nombre?: string;
}

export class CentroDeCosto {
  id?: number;
  nombre?: string;
}

export class Rubro {
  id?: number;
  rubro?: string;
}

export class Aplicaciones {
  id?: number;
  nombre?: string;
  descripcion?: string;
}
