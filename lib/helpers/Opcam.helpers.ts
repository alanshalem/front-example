import { OpcamAuxiliar } from '@components/Opcam/OpcamPage';
import {
  downloadOpcamTableByFilter,
  getOpcam,
  getOpcamByFilter,
} from '@lib/services/Opcam/Opcam.services';
import {
  FilterOpcam,
  OpcamFiltersAuxiliar,
} from '@lib/types/Opcam/Opcam.types';
import { isEmpty } from './helpers';
import { transformarFormato } from './Posventa.helpers';
import { getMonthName } from '@lib/utils/Date';

export const initialStateFilters: OpcamFiltersAuxiliar = {
  fechaInformacion: '',
  tipoOperacion: '',
  nroBoleto: '',
  tipoIdent: '',
  nroIdent: '',
  codConcepto: '',
  codMoneda: '',
};

//devuelve true si todos los campos del filtro estan vacios
export const verificarFiltroOpcam = (
  filtroOPCAM: OpcamFiltersAuxiliar
): boolean => {
  return (
    isEmpty(filtroOPCAM.fechaInformacion) &&
    isEmpty(filtroOPCAM.tipoOperacion) &&
    isEmpty(filtroOPCAM.nroBoleto) &&
    isEmpty(filtroOPCAM.tipoIdent) &&
    isEmpty(filtroOPCAM.nroIdent) &&
    isEmpty(filtroOPCAM.codConcepto) &&
    isEmpty(filtroOPCAM.codMoneda)
  );
};

export const prepareFilter = (
  filtroOpcam: OpcamFiltersAuxiliar,
  setOpcamList: (value: React.SetStateAction<OpcamAuxiliar[]>) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void
) => {
  // preparo el filtro
  const filtroOpcamObj: FilterOpcam = {
    preOPCAMByFilterDTO: {
      fechaInformacion: filtroOpcam.fechaInformacion
        ? transformDateString(filtroOpcam.fechaInformacion)
        : null,
      tipoOperacion: filtroOpcam.tipoOperacion
        ? filtroOpcam.tipoOperacion
        : null,
      nroBoleto: filtroOpcam.nroBoleto ? filtroOpcam.nroBoleto : null,
      tipoIdent: filtroOpcam.tipoIdent ? filtroOpcam.tipoIdent : null,
      nroIdent: filtroOpcam.nroIdent ? filtroOpcam.nroIdent : null,
      codConcepto: filtroOpcam.codConcepto ? filtroOpcam.codConcepto : null,
      codMoneda: filtroOpcam.codMoneda ? filtroOpcam.codMoneda : null,
    },
  };
  getOpcamByFilter(filtroOpcamObj)
    .then((result: any) => {
      setOpcamList(result);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

export const getAllOpcam = (
  setOpcamList: (value: React.SetStateAction<OpcamAuxiliar[]>) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void,
  setFiltroOpcam?: (value: React.SetStateAction<OpcamFiltersAuxiliar>) => void
) => {
  getOpcam()
    .then((result: any) => {
      setOpcamList(result);
      const initialStateConFecha = {
        ...initialStateFilters,
        fechaInformacion: result[0].fechaInformacion,
      };
      setFiltroOpcam(initialStateConFecha);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

export const addEllipsisIfNeeded = (str: string): string => {
  if (str.length > 22) {
    return str.slice(0, 22) + '...';
  }
  return str;
};

export const transformString = (str: string): string => {
  str = str.replace(/^0+/, '');
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const transformDateString = (dateString: string): string => {
  if (dateString.length <= 10) {
    dateString = dateString
      .split('/')
      .reverse()
      .join('-');
  }
  let date = new Date(dateString);
  let day = date
    .getUTCDate()
    .toString()
    .padStart(2, '0');
  let month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  let year = date.getUTCFullYear().toString();
  return `${day}/${month}/${year}`;
};

export const convertToISODateString = (dateString: string): string => {
  const date = new Date(
    dateString
      .split('/')
      .reverse()
      .join('-')
  );
  const isoDateString = date.toISOString();
  return isoDateString;
};

export const arrayToCSV = data => {
  const csvContent = data.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const date = new Date();

  const fileName = `opcam_${date.getDate()}-${getMonthName(
    date.getMonth()
  )}-${date.getFullYear()}_${date.getHours()}.${(date.getMinutes() < 10
    ? '0'
    : '') + date.getMinutes()}.csv`;
  // Crea un enlace para descargar el archivo
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const downloadOpcamTable = (
  filtroOpcam: OpcamFiltersAuxiliar,
  setLoading: any
) => {
  const opcamFilter: any = {
    fechaInformacion: filtroOpcam.fechaInformacion
      ? transformarFormato(filtroOpcam.fechaInformacion)
      : null,
    tipoOperacion: filtroOpcam.tipoOperacion ? filtroOpcam.tipoOperacion : null,
    nroBoleto: filtroOpcam.nroBoleto ? filtroOpcam.nroBoleto : null,
    tipoIdent: filtroOpcam.tipoIdent ? filtroOpcam.tipoIdent : null,
    nroIdent: filtroOpcam.nroIdent ? filtroOpcam.nroIdent : null,
    codConcepto: filtroOpcam.codConcepto ? filtroOpcam.codConcepto : null,
    codMoneda: filtroOpcam.codMoneda ? filtroOpcam.codMoneda : null,
  };

  const opcamByFilterDTO: any = {
    opcamByFilterDTO: opcamFilter,
  };

  downloadOpcamTableByFilter(opcamByFilterDTO)
    .then((result: any) => {
      arrayToCSV(result);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};
