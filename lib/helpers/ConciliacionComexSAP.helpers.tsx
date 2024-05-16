import { toastCallAux } from '@components/Toast/Toast.helpers';
import {
  GetConciliacionesComexSAPByFilter,
  asignarConciliacion,
  createObservacion,
  downloadCruceOpcamTopsTableByFilter,
  finalizarConciliacion,
  getObservaciones,
} from '@lib/services/ConciliacionComexSAP/ConciliacionComexSAP.services';
import {
  ConciliacionComexSAPFilterAuxiliar,
  TipoDiferenciaTypes,
} from '@lib/types/ConciliacionComexSAP/ConciliacionComexSAP.types';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';
import { transformarFecha } from '@lib/utils/Date'; 

export const transformarFormato = (fechaDate: string): string | null => {
  let parsedFecha: Date;

  let fecha = transformarFecha(fechaDate);

  if (
    typeof fecha === 'object' &&
    fecha instanceof Date &&
    !isNaN(fecha.getTime())
  ) {
    parsedFecha = fecha;
  } else if (typeof fecha === 'string') {
    parsedFecha = new Date(fecha);
    if (isNaN(parsedFecha.getTime())) {
      console.error('ERROR: Fecha no válida');
      return null;
    }
  } else {
    console.error('ERROR: Tipo de fecha no admitido');
    return null;
  }

  return parsedFecha.toISOString();
};

const currentDate = new Date();
const dd = currentDate.getDate();
const mm = currentDate.getMonth() + 1;
const yyyy = currentDate.getFullYear();

export const initialStateFilters: ConciliacionComexSAPFilterAuxiliar = {
  fecha: `${dd}/${mm.toString().padStart(2, '0')}/${yyyy}`,
  idEstado: '',
  legajoAsignado: '',
  legajoFinalizado: '',
  idTipoDiferencia: '',
  idAplicacion: '',
  nroCuenta: '',
  divisa: '',
  nroOperacion: '',
};

export const eliminarNull = (objeto: any): any => {
  for (let clave in objeto) {
    if (objeto[clave] === null) {
      delete objeto[clave];
    } else if (typeof objeto[clave] === 'object') {
      eliminarNull(objeto[clave]);
    }
  }
  return objeto;
};

export const prepareFilterConciliacionComexSAP = (
  filtroConciliacionComexSAP: ConciliacionComexSAPFilterAuxiliar,
  setConciliacionesComexSAP: React.Dispatch<React.SetStateAction<any[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const filtroConciliacionComexSAPObject = {
    conciliacionComexSapByFilter: {
      fecha: filtroConciliacionComexSAP.fecha
        ? transformarFormato(filtroConciliacionComexSAP.fecha)
        : null,
      idEstado: filtroConciliacionComexSAP.idEstado
        ? filtroConciliacionComexSAP.idEstado
        : null,
      legajoAsignado: filtroConciliacionComexSAP.legajoAsignado
        ? filtroConciliacionComexSAP.legajoAsignado
        : null,
      legajoFinalizado: filtroConciliacionComexSAP.legajoFinalizado
        ? filtroConciliacionComexSAP.legajoFinalizado
        : null,
      idTipoDiferencia: filtroConciliacionComexSAP.idTipoDiferencia
        ? Number(filtroConciliacionComexSAP.idTipoDiferencia)
        : null,
      idAplicacion: filtroConciliacionComexSAP.idAplicacion
        ? Number(filtroConciliacionComexSAP.idAplicacion)
        : null,
      nroCuenta: filtroConciliacionComexSAP.nroCuenta
        ? filtroConciliacionComexSAP.nroCuenta
        : null,
      divisa: filtroConciliacionComexSAP.divisa
        ? filtroConciliacionComexSAP.divisa
        : null,
      nroOperacion: filtroConciliacionComexSAP.nroOperacion
        ? filtroConciliacionComexSAP.nroOperacion
        : null,
      nroRefOperPago: filtroConciliacionComexSAP.nroRefOperPago
        ? filtroConciliacionComexSAP.nroRefOperPago
        : null,
    },
  };

  const filtroConciliacionComexSAPObjectSinNull = eliminarNull(
    filtroConciliacionComexSAPObject
  );

  GetConciliacionesComexSAPByFilter(filtroConciliacionComexSAPObjectSinNull)
    .then((result: any) => {
      setConciliacionesComexSAP(result.detalle);
      if (result.status.hasErrors === true) {
        toastCallAux(result.status.desc, false);
      }
      if (
        result.status.hasErrors === false &&
        result.status.statusCode === 204
      ) {
        toastCallAux(result.status.desc, true);
      }
    })
    .catch(() => {
      toastCallAux('Error', false);
    })
    .finally(() => {
      setLoading(false);
    });
};

export const buildTipoDiferenciaList = (
  diferencias: TipoDiferenciaTypes[] | undefined
): ItemDropdown[] => {
  const auxDiferencias: ItemDropdown[] = [];
  if (diferencias) {
    diferencias.forEach(p => {
      auxDiferencias.push({ text: p.nombre, value: p.id });
    });
    return auxDiferencias;
  }
  return [];
};

export const buildTipoDiferenciaInitialValueFilter = (
  e: TipoDiferenciaTypes | undefined
): ItemDropdown => {
  if (e) {
    return {
      value: e.id.toString(),
      text: e.nombre,
    };
  } else {
    return {
      value: '',
      text: '',
    };
  }
};

function arrayToCSV(data: any, fecha: string) {
  const csvContent = data.export.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const originalDate: Date = new Date(fecha);

  // Extract day, month, and year from the Date object
  const day: string = originalDate
    .getDate()
    .toString()
    .padStart(2, '0');
  const month: string = (originalDate.getMonth() + 1)
    .toString()
    .padStart(2, '0'); // Note: Month is zero-based, so add 1
  const year: string = originalDate.getFullYear().toString();

  // Format the date as "dd_mm_yyyy"
  const formattedDate: string = `${day}_${month}_${year}`;

  const fileName = `conciliaciones_${formattedDate}.csv`;
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
}

export const downloadConciliacionComexSapTable = (
  filtroConciliacion: ConciliacionComexSAPFilterAuxiliar,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  let conciliacionFilter: any = {
    fecha: filtroConciliacion.fecha
      ? transformarFormato(filtroConciliacion.fecha)
      : null,
    idEstado: filtroConciliacion.idEstado ? filtroConciliacion.idEstado : null,
    legajoAsignado: filtroConciliacion.legajoAsignado
      ? filtroConciliacion.legajoAsignado
      : null,
    legajoFinalizado: filtroConciliacion.legajoFinalizado
      ? filtroConciliacion.legajoFinalizado
      : null,
    idTipoDiferencia: filtroConciliacion.idTipoDiferencia
      ? filtroConciliacion.idTipoDiferencia
      : null,
    idAplicacion: filtroConciliacion.idAplicacion
      ? filtroConciliacion.idAplicacion
      : null,
    nroCuenta: filtroConciliacion.nroCuenta
      ? filtroConciliacion.nroCuenta
      : null,
    nroOperacion: filtroConciliacion.nroOperacion
      ? filtroConciliacion.nroOperacion
      : null,
    nroRefOperPago: filtroConciliacion.nroRefOperPago
      ? filtroConciliacion.nroRefOperPago
      : null,
  };

  conciliacionFilter = eliminarNull(conciliacionFilter);

  const conciliacionByFilterDTO: any = {
    conciliacionComexSapByFilter: conciliacionFilter,
  };

  downloadCruceOpcamTopsTableByFilter(conciliacionByFilterDTO)
    .then((result: any) => {
      arrayToCSV(result, filtroConciliacion.fecha);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

export const getObservacionesByIdSapAlerta = (
  idSapAlerta: string | number,
  setObservaciones: React.Dispatch<React.SetStateAction<any>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  getObservaciones(idSapAlerta)
    .then((result: any) => {
      setObservaciones(result);
    })
    .catch((err: any) => {
      toastCallAux(err, false);
    })
    .finally(() => {
      setLoading(false);
    });
};

export const createObservacionComexSAP = (
  idSapAlerta: string | number,
  observacion: string,
  legajo: string,
  handleClose: () => void
) => {
  let observacionObj: any = {
    idSapAlerta: idSapAlerta,
    observacion: observacion,
    legajo: legajo,
  };

  const observacionDTO: any = {
    observacion: observacionObj,
  };

  createObservacion(observacionDTO)
    .then(() => {
      toastCallAux('Observacion creada correctamente', true);
    })
    .catch(err => {
      toastCallAux(err, false);
    })
    .finally(() => {
      handleClose();
    });
};

export const handleAsignarConciliaciones = (
  idSapAlerta: number[],
  legajoAsignado: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  refreshTable: () => void
) => {
  setLoading(true);
  let conciliacionesAsignar = {
    idSapAlerta: idSapAlerta,
    legajoAsignado: legajoAsignado,
  };

  const asignarDTO = {
    asignar: conciliacionesAsignar,
  };

  asignarConciliacion(asignarDTO)
    .then(res => {
      toastCallAux(res.desc, true);
    })
    .catch(err => {
      console.error(err);
      toastCallAux('Error al guardar', false);
    })
    .finally(() => {
      refreshTable();
      setLoading(false);
    });
};

export const handleFinalizarConciliaciones = (
  idSapAlerta: number[],
  legajoFinalizado: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  refreshTable: () => void
) => {
  setLoading(true);
  let conciliacionesFinalizar = {
    idSapAlerta: idSapAlerta,
    legajoFinalizado: legajoFinalizado,
  };

  const finalizarDTO = {
    finalizar: conciliacionesFinalizar,
  };

  finalizarConciliacion(finalizarDTO)
    .then(res => {
      toastCallAux(res.desc, true);
    })
    .catch(err => {
      console.error(err);
      toastCallAux('Error al guardar', false);
    })
    .finally(() => {
      refreshTable();
      setLoading(false);
    });
};
