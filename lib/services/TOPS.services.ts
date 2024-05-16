import { HttpClient } from '@galicia-toolkit/core';
import { appJSON } from '@lib/types/SourceSystem';
import { getURLs } from '../../config/ConfigurationService';

export const getDatosPersonas = async (nroCuit: string) => {
  const route = `${getURLs().GetPersonasOasys}/${nroCuit}`;
  const { status, data, errors } = await HttpClient.get(route, {
    headers: {
      'Content-Type': appJSON,
    },
  });
  if (status === 200 || status === 201) {
    return data.data;
  } else {
    return Promise.reject(errors);
  }
};

export const getConceptosBoletos = async () => {
  const route = `${getURLs().GetConceptosBoletos}`;
  const { status, data, errors } = await HttpClient.get(route, {
    headers: {
      'Content-Type': appJSON,
    },
  });
  if (status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const getMonedas = async () => {
  const route = `${getURLs().GetMonedas}`;
  const { status, data, errors } = await HttpClient.get(route, {
    headers: {
      'Content-Type': appJSON,
    },
  });
  if (status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};
