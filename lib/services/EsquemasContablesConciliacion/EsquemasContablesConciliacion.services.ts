import { HttpClient } from '@galicia-toolkit/core';
import { appJSON } from '@lib/types/SourceSystem';
import { getURLs } from '../../../config/ConfigurationService';

import { FilterEsquemaContableConciliacion } from '@lib/types/EsquemaContableConciliacion/EsquemaContableConciliacion.types';

export const getEsquemasContablesConciliacionByFilter = async (
  filtro: FilterEsquemaContableConciliacion
) => {
  
  const filtroEsquemaAPI = getURLs().GetRubros;


  const { status, data, errors } = await HttpClient.post(filtroEsquemaAPI, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
    data: filtro
  });
  if (status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const guardarEsquemaContableConciliacion = async (
  createRubroCentroDivisaRequest: any
) => {
  const esquemaContableConciliacionAPI = getURLs().CreateRubroCCDivisa;
  const { status, data, errors } = await HttpClient.post(
    esquemaContableConciliacionAPI,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorsRecipe: HttpClient.PomInterceptors,
      data: createRubroCentroDivisaRequest,
    }
  );
  if (status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const actualizarEsquemaContableConciliacion = async (
  updateRubroCentroDivisaRequest: any
) => {
  const esquemaContableConciliacionAPI = getURLs().UpdateRubroCCDivisa;
  const { status, data, errors } = await HttpClient.put(
    esquemaContableConciliacionAPI,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorsRecipe: HttpClient.PomInterceptors,
      data: updateRubroCentroDivisaRequest,
    }
  );
  if (status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const eliminarEsquemaContableConciliacion = async (
  deleteRubroCentroDivisaRequest: any
) => {
  const esquemaContableConciliacionAPI = getURLs().DeleteRubroCCDivisa;
  const { status,  errors } = await HttpClient.del(
    esquemaContableConciliacionAPI,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorsRecipe: HttpClient.PomInterceptors,
      data: deleteRubroCentroDivisaRequest,
    }
  );
  if (status === 200 || status === 201) {
    return {
      status: 200,
      hasErrors: false
    };
  } else {
    return Promise.reject(errors);
  }
};
