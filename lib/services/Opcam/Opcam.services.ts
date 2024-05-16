import { getURLs } from '../../../config/ConfigurationService';
import { HttpClient } from '@galicia-toolkit/core';
import { appJSON } from '@lib/types/SourceSystem';

export const getOpcam = async () => {
  const getOpcamAPI = getURLs().GetOpcamDaily;
  const { status, data, errors } = await HttpClient.get(getOpcamAPI, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
  });
  if (status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const getOpcamByFilter = async (filtro: any) => {
  const filtroOpcamAPI = getURLs().PostOpcamFilter;
  const { status, data, errors } = await HttpClient.post(filtroOpcamAPI, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
    data: filtro,
  });
  if (status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const downloadOpcamTableByFilter = async (filtro: any) => {
  const exportByFilter = getURLs().ExportOpcamByFilter;
  const { status, data, errors } = await HttpClient.post(exportByFilter, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
    data: filtro,
  });
  if (status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};
