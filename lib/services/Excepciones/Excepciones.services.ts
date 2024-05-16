import { HttpClient } from '@galicia-toolkit/core';
import { getURLs } from '../../../config/ConfigurationService';

export const getExcepcionesBoletos = async () => {
  const traerExcepcionesAPI = getURLs().GetExcepcionesBoletos;
  const { status, data, errors } = await HttpClient.get(traerExcepcionesAPI, {
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
