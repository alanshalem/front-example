import { getAvisosByFilter } from '@lib/services/Alertas/Alertas.services';
import { AlertasFiltersAuxiliar, AvisosRequestBody, AvisosResponse, TipoDeAlertas } from '@lib/types/Alertas/Alertas.types';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';
import { convertirFechaAISO8601 } from '@lib/utils/Date';

export const initialStateFilters: AlertasFiltersAuxiliar = {
  aplicacion: '',
  tipo: '',
  fecha: '',
};

export const buildTiposDeAvisosList = (
  avisos: TipoDeAlertas[] | undefined
): ItemDropdown[] => {
  const auxAvisos: ItemDropdown[] = [];
  if (avisos) {
    avisos.forEach(e => {
      auxAvisos.push({ text: e.nombre, value: e.id });
    });
    return auxAvisos;
  }
  return [];
};

export const builTiposDeAvisosInitialValueFilter = (
  e: TipoDeAlertas | undefined
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

export const prepareFilterAvisos = (
  filtrosAlertas: AlertasFiltersAuxiliar,
  setAlertasConciliacionList: React.Dispatch<React.SetStateAction<AvisosResponse[]>>,
  setLoading: (value: React.SetStateAction<boolean>) => void
) => {
  const objetoAvisosFilter: AvisosRequestBody = {
    avisoRequest: {
      idAplicacion: Number(filtrosAlertas.aplicacion) || null,
      idTipoAlerta: Number(filtrosAlertas.tipo) || null,
      fecha: filtrosAlertas.fecha ? convertirFechaAISO8601(filtrosAlertas.fecha) : null,
    },
  };
  Object.keys(objetoAvisosFilter.avisoRequest).forEach(key => {
    if (objetoAvisosFilter.avisoRequest[key] === null) {
      delete objetoAvisosFilter.avisoRequest[key];
    }
  });
  getAvisosByFilter(objetoAvisosFilter)
    .then((result: AvisosResponse[]) => {
      setAlertasConciliacionList(result);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};