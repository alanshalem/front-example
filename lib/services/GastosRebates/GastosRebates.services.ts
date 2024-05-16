import { HttpClient } from '@galicia-toolkit/core';
import { appJSON } from '@lib/types/SourceSystem';
import { getURLs } from '../../../config/ConfigurationService';
import { generarParametrosURL } from '@lib/helpers/GastosRebates.helpers';
import {
  AprobarGastoRebateBody,
  AvanzarCalendarizadaBody,
  FilterGastosRebates,
  GastoRebateResponse,
  SaveGastoRebateBody,
} from '@lib/types/GastosRebates/GastosRebates.types';

export const getGastosRebatesByFilter = async (
  filtro: FilterGastosRebates
): Promise<GastoRebateResponse[]> => {
  const filtroGastosRebatesAPI = `${
    getURLs().GetGastosRebatesByFilter
  }${generarParametrosURL(filtro.gastosRebatesByFilterDto)}`;

  const { status, data, errors } = await HttpClient.get(
    filtroGastosRebatesAPI,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorsRecipe: HttpClient.PomInterceptors,
    }
  );
  if (status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const saveGastoRebate = async (
  gastoRebate: SaveGastoRebateBody
): Promise<any> => {
  const postGastoRebateAPI = getURLs().PostGastoRebate;
  const { status, data, errors } = await HttpClient.post(postGastoRebateAPI, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
    data: gastoRebate,
  });
  if ( status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const avanzarCalendarizada = async (
  gastoCalendarizadoBody: AvanzarCalendarizadaBody
): Promise<any> => {
  const avanzarCalendarizadaAPI = getURLs().AvanzarCalendarizada;
  const { status, data, errors } = await HttpClient.post(
    avanzarCalendarizadaAPI,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorsRecipe: HttpClient.PomInterceptors,
      data: gastoCalendarizadoBody,
    }
  );
  if (status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const aprobarGastoRebate = async (
  id: number,
  body: AprobarGastoRebateBody
): Promise<any> => {
  const aprobarGastoRebateAPI = `${getURLs().AprobarGastoRebate}/${Number(id)}`;
  const { status, data, errors } = await HttpClient.put(aprobarGastoRebateAPI, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
    data: body,
  });
  if (status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const rechazarGastoRebate = async (
  id: number,
  objeto: any
): Promise<any> => {
  const rechazarGastoRebateAPI = `${getURLs().RechazarGastoRebate}/${Number(
    id
  )}`;
  const { status, data, errors } = await HttpClient.put(
    rechazarGastoRebateAPI,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorsRecipe: HttpClient.PomInterceptors,
      data: objeto,
    }
  );
  if ( status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};
