import { HttpClient } from '@galicia-toolkit/core';
import { getURLs } from '../../../config/ConfigurationService';
import { Corresponsal } from '@lib/types/Corresponsal/Corresponsa.types';

export const getCorresponsal = async (): Promise<Corresponsal[]> => {
  const getCorresponsalAPI = getURLs().GetCorresponsal;
  const { status, data, errors } = await HttpClient.get(getCorresponsalAPI, {
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
