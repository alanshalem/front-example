import { getProyectadasExportBcra } from '@lib/services/Proyectadas.services';
import {
  ContabilidadesTableResponse,
} from '@lib/types/ContabilidadCruces/ContabilidadCruces.types';
import { formatNumber } from './helpers';

const parseProyectadasExport = (proyectadas: string[]): string[] => {
  const proyectadasParseadas: string[] = [];

  proyectadas.forEach(proy => {
    if (proyectadas.indexOf(proy) === proyectadas.length - 1) {
      proyectadasParseadas.push(proy);
    } else {
      proyectadasParseadas.push(proy + '\r\n');
    }
  });

  return proyectadasParseadas;
};

export const getExportBcra = (
  setLoading: (value: React.SetStateAction<boolean>) => void
) => {
  setLoading(true);
  getProyectadasExportBcra()
    .then((result: any) => {
      descargarProyectadas(parseProyectadasExport(result));
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

const checkHours = (): string => {
  const draft = 'draft.txt';
  const regimenInformativo = 'OPANTICIPO.txt';
  const hora = new Date().getHours();
  const minutos = new Date().getMinutes();

  //despues de las 15:05hs
  if ((hora === 15 && minutos > 5) || hora > 15) {
    return regimenInformativo;
  } else {
    //antes de las 15:05hs
    return draft;
  }
};

const descargarProyectadas = (data: string[]) => {
  const blob = new Blob(data, { type: 'octet-stream' });
  const href = URL.createObjectURL(blob);

  const a = Object.assign(document.createElement('a'), {
    href,
    style: 'display:none',
    download: checkHours(),
  });
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(href);
};

const crearFilaCruce = (cruces: ContabilidadesTableResponse[]): string[][] => {
  let filas: string[][] = [];

  cruces.forEach(cruce => {
    const nroOp = cruce.nroOperacion;
    cruce.contabilidad.forEach(conta => {
      filas.push([
        nroOp,
        conta.rubro,
        conta.descripcionRubro,
        conta.centroCosto,
        formatNumber(conta.monto.toString()),
        conta.divisa,
        conta.tipoMovimiento,
      ]);
    });
  });

  return filas;
};

const descargarContabilidad = (cruces: ContabilidadesTableResponse[]) => {
  const header =
    'Nro. Operacion;Rubro;Descripcion Rubro;Centro de Costo;Monto;Divisa;Tipo de Movimiento\n';

  const filasCruce = crearFilaCruce(cruces);

  const excelResult = header + filasCruce.map(row => row.join(';')).join('\n');
  const blob = new Blob([excelResult], { type: 'text/csv;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), {
    href,
    style: 'display:none',
    download: 'Contabilidad de Cruces.csv',
  });
  a.click();
  URL.revokeObjectURL(href);
  a.remove();
};

export const getExportContabilidad = (
  setLoading: (value: React.SetStateAction<boolean>) => void,
  cruces: ContabilidadesTableResponse[]
) => {
  setLoading(true);
  descargarContabilidad(cruces);
  setLoading(false);
};
