import { HttpClient } from '@galicia-toolkit/core';
import { getURLs } from '../../../config/ConfigurationService';
import { AvisosRequestBody } from '@lib/types/Alertas/Alertas.types';

export const getTiposDeAvisos = async (): Promise<any> => {
  const getTiposDeAvisosAPI = getURLs().GetTiposAvisos;
  const { status, data, errors } = await HttpClient.get(getTiposDeAvisosAPI, {
    headers: {
      'Content-Type': 'application/json',
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
  });
  if (status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const getAvisosByFilter = async (
  filtro: AvisosRequestBody
): Promise<any> => {
  const getTiposDeAvisosAPI = getURLs().GetAvisosByFilter;
  const { status, data, errors } = await HttpClient.post(getTiposDeAvisosAPI, {
    headers: {
      'Content-Type': 'application/json',
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
    data: filtro,
  });
  if (status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};
