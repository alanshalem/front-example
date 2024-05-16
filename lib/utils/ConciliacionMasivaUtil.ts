export interface ArrInterface {
  sector: string;
  codcta: string;
  origen: string;
  secuencia: string;
  fhcontable: string;
  numop1: string;
  numop2: string;
  corte: string;
  debe: string;
  haber: string;
  diferencia: string;
  observacion: null;
  fhproceso: string;
}

export const transformArray = (arr: any) => {
  return arr.map(obj => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (key === 'debe' || key === 'haber' || key === 'diferencia') {
        acc[key] = parseFloat(
          (value as string).replace('.', '').replace(',', '.')
        );
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
  });
};
