import { HttpClient } from '@galicia-toolkit/core';
import { appJSON } from '@lib/types/SourceSystem';
import { getURLs } from '../../../config/ConfigurationService';

export const getTiposDeResultados = async (): Promise<any> => {
  const TiposDeResultadosApi = getURLs().GetTiposDeResultados;

  const { status, data, errors } = await HttpClient.get(TiposDeResultadosApi, {
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
