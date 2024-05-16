import { HttpClient } from '@galicia-toolkit/core';
import {
  CheckBoletoRequest,
  NewBoletoSimiRequest,
} from '@lib/types/BoletoSimi/BoletoSimi.types';
import { appJSON } from '@lib/types/SourceSystem';
import { getURLs } from '../../../config/ConfigurationService';

export const getBoletoSimi = async () => {
  const traerSimiAPI = getURLs().GetBoletoSimi;
  const { status, data, errors } = await HttpClient.get(traerSimiAPI, {
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

export const getBoletoSimiByFilter = async (filtro: any) => {
  const filtroSimiAPI = getURLs().PostFiltroBoletoSimi;
  const { status, data, errors } = await HttpClient.post(filtroSimiAPI, {
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

export const nuevoBoletoSimi = async (boletoSimi: NewBoletoSimiRequest) => {
  const urlNuevaSimi = getURLs().GetBoletoSimi;
  const { status, data, errors } = await HttpClient.post(urlNuevaSimi, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
    data: boletoSimi,
  });
  if (status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const bajaBoletoSimi = async (idBoleto: number, legajoBaja: string) => {
  const buscarSimis = `${getURLs().GetBoletoSimi}/${idBoleto}/${legajoBaja}`;
  const { status, data, errors } = await HttpClient.del(buscarSimis, {
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

export const editarBoletoSimi = async (
  token: string,
  Simi: NewBoletoSimiRequest
) => {
  const nuevaSimiUrl = getURLs().GetBoletoSimi;
  const SimiNueva = await fetch(nuevaSimiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': appJSON,
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(Simi),
  });
  if (SimiNueva.status === 200 || SimiNueva.status === 201) {
    return SimiNueva.json();
  } else {
    return Promise.reject(SimiNueva);
  }
};

export const checkBoletoSimi = async (boleto: CheckBoletoRequest) => {
  const checkBoletoSimiAPI = getURLs().CheckBoletoDuplicado;
  const { status, data, errors } = await HttpClient.post(checkBoletoSimiAPI, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
    data: boleto,
  });
  if (status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};
