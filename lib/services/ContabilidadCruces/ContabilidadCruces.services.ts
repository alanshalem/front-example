import { HttpClient } from '@galicia-toolkit/core';
import {
  simulacionAnaliticoDTO,
  SimulacionDTO,
  SimulacionRequestDTO,
} from '@lib/types/Contabilidad/Eventos/Inventario/EventoInventario.types';
import {
  ContabilidadesAFirmar,
  ContabilidadesTableResponse,
  FilterContabilidadCruces,
} from '@lib/types/ContabilidadCruces/ContabilidadCruces.types';
import { appJSON } from '@lib/types/SourceSystem';
import { getURLs } from '../../../config/ConfigurationService';

export const getContabilidadCrucesByFilter = async (
  filtro: FilterContabilidadCruces
): Promise<ContabilidadesTableResponse[]> => {
  const filtroContabilidadCrucesAPI = getURLs().PostContabilidadCrucesByFilter;
  const { status, data, errors } = await HttpClient.post(
    filtroContabilidadCrucesAPI,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorsRecipe: HttpClient.PomInterceptors,
      data: filtro,
    }
  );
  if (status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const firmarContabilidades = async (
  contabilidades: ContabilidadesAFirmar
): Promise<any> => {
  const firmarContabilidadesURL = getURLs().FirmarContabilidades;
  const { status, data, errors } = await HttpClient.put(
    firmarContabilidadesURL,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorRecipe: HttpClient.PomInterceptors,
      data: contabilidades,
    }
  );
  if (status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const simularAnalitico = async (
  simulacionRequest: SimulacionRequestDTO
): Promise<simulacionAnaliticoDTO> => {
  const route = `${getURLs().GetSimulacionAnalitico}`;
  const { status, data, errors } = await HttpClient.post(route, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
    data: simulacionRequest,
  });
  if (status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};
export const guardarAnalitico = async (
  analiticoBody: SimulacionDTO
): Promise<simulacionAnaliticoDTO> => {
  const route = `${getURLs().CreateAnalitico}`;
  const analiticoAux = {
    eventoInventario: analiticoBody,
  };
  const { status, data, errors } = await HttpClient.post(route, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
    data: analiticoAux,
  });
  if (status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};
