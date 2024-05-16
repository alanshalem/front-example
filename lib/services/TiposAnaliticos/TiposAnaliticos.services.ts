import { HttpClient } from '@galicia-toolkit/core';
import { appJSON } from '@lib/types/SourceSystem';
import { getURLs } from '../../../config/ConfigurationService';

export const getTiposAnaliticoGastoRebate = async (): Promise<any> => {
  const tiposAnaliticoGatoRebateAPI = getURLs().GetTiposAnaliticoGastoRebates;

  const { status, data, errors } = await HttpClient.get(
    tiposAnaliticoGatoRebateAPI,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorsRecipe: HttpClient.PomInterceptors,
    }
  );
  if (status === 200 || status === 201) {
    return data.tiposAnalitico;
  } else {
    return Promise.reject(errors);
  }
};

export const getTiposAnaliticoPrevisiones = async (): Promise<any> => {
  const tiposAnaliticoPrevisionesAPI = getURLs().GetTiposAnaliticoPrevisiones;

  const { status, data, errors } = await HttpClient.get(
    tiposAnaliticoPrevisionesAPI,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorsRecipe: HttpClient.PomInterceptors,
    }
  );
  if (status === 200 || status === 201) {
    return data.tiposAnalitico;
  } else {
    return Promise.reject(errors);
  }
};
