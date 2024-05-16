import { getURLs } from '../../../config/ConfigurationService';
import { HttpClient } from '@galicia-toolkit/core';
import { appJSON } from '@lib/types/SourceSystem';

export const getCrucesOpcamTopsDiaHabil = async () => {
  const getOpcamAPI = getURLs().GetCruceOpcamTopsDiaHabil;
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

export const getCruceOpcamTopsByFilter = async (filtro: any) => {
  const filtroOpcamTopsAPI = getURLs().PostConciliacionDeBoletosOpcamTopsFilter;
  const { status, data, errors } = await HttpClient.post(filtroOpcamTopsAPI, {
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
