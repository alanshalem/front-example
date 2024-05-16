import {
  GetProcesoForFilter,
  GetProcesoResultadoByFilter,
} from '@lib/services/Procesos/Procesos.services';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';
import { ProcesosFiltersAuxiliar } from '@lib/types/Procesos/Procesos.types';

export const initialStateFilters: ProcesosFiltersAuxiliar = {
  idProceso: '',
  fechaInicio: '',
};

export const buildProcesosList = (
  procesos: any[] | undefined
): ItemDropdown[] => {
  const auxProcesos: ItemDropdown[] = [];
  if (procesos) {
    procesos.forEach(p => {
      auxProcesos.push({ text: p.nombre, value: p.id });
    });
    return auxProcesos;
  }
  return [];
};

export const buildProcesosInitialValueFilter = (
  e: any | undefined
): ItemDropdown => {
  if (e) {
    return {
      value: e.id,
      text: e.nombre,
    };
  } else {
    return {
      value: '',
      text: '',
    };
  }
};

export const getProcesoForFilter = (
  setProcesoForFilter: (value: React.SetStateAction<any[]>) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void
) => {
  GetProcesoForFilter()
    .then((result: any) => {
      setProcesoForFilter(result);
      setLoading(false);
    })
    .catch(() => {
      setProcesoForFilter([]);
      setLoading(false);
    });
};

export const prepareFilterAvisos = (
  filtroProceso: ProcesosFiltersAuxiliar,
  setProcesos: (value: React.SetStateAction<any[]>) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void
) => {
  const filtroProcesos = {
    procesoResultado: {
      idProceso: Number(filtroProceso.idProceso) || null,
      fechaInicio: filtroProceso.fechaInicio || null,
    },
  };

  GetProcesoResultadoByFilter(filtroProcesos)
    .then(result => {
      setProcesos(result);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};
