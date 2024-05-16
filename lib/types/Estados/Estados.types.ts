export type Estado = {
  idEstado: number;
  idEstadoFuncionalidad: number;
  nombreEstado: string;
  descEstado: string;
  text: string;
  value: string;
};

export type FuncionalidadEstados = {
  idFuncionalidad: number;
  funcionalidad: string;
  estados: Estado[];
};
