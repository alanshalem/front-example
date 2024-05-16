import { HttpClient } from '@galicia-toolkit/core';
import { appJSON } from '@lib/types/SourceSystem';
import { getURLs } from '../../../config/ConfigurationService';
import { FilterEsquemaContable } from '@lib/types/EsquemaContable/EsquemaContable.types';

export const getEsquemasByFilter = async (filtro: FilterEsquemaContable) => {
  const filtroEsquemaAPI = getURLs().EventosContablesAplicacionByFilter;
  const { status, data, errors } = await HttpClient.post(filtroEsquemaAPI, {
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
