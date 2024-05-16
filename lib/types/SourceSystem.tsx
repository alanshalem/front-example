export enum SourceSystem {
  Secopa = 0,
  Tesin = 1,
}

export const appJSON = 'application/json';

export type FuncionalidadAccion = {
  funcionalidad: string;
  read: boolean;
  manual:boolean;
  masivo:boolean;
  write: boolean;
  delete: boolean;
  import: boolean;
  export: boolean;
  sign: boolean;
};

