import { HttpClient } from '@galicia-toolkit/core';
import {
  FilterPrevisiones,
  PrevisionPost,
  PrevisionResponse,
  UserFirmante,
} from '@lib/types/Previsiones/Previsiones.types';
import { appJSON } from '@lib/types/SourceSystem';
import { getURLs } from '../../../config/ConfigurationService';

export const getPrevisionesByFilter = async (
  filtro: FilterPrevisiones
): Promise<PrevisionResponse[]> => {
  const queryParams = [];
  if (filtro.previsionesByFilterDto.corresponsal !== null) {
    queryParams.push(
      `idCorresponsal=${encodeURIComponent(
        filtro.previsionesByFilterDto.corresponsal
      )}`
    );
  }
  if (filtro.previsionesByFilterDto.divisa !== null) {
    queryParams.push(
      `divisa=${encodeURIComponent(filtro.previsionesByFilterDto.divisa)}`
    );
  }
  if (filtro.previsionesByFilterDto.periodo !== null) {
    queryParams.push(
      `periodo=${encodeURIComponent(filtro.previsionesByFilterDto.periodo)}`
    );
  }
  if (filtro.previsionesByFilterDto.estado !== null) {
    queryParams.push(
      `idEstado=${encodeURIComponent(filtro.previsionesByFilterDto.estado)}`
    );
  }

  const filtroPrevisionesAPI = `${
    getURLs().GetPrevisionesByFilter
  }?${queryParams.join('&')}`;

  const { status, data, errors } = await HttpClient.get(filtroPrevisionesAPI, {
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

export const postPrevision = async (prevision: PrevisionPost) => {
  const guardarPrevisionAPI = getURLs().PostPrevision;
  const { status, data, errors } = await HttpClient.post(guardarPrevisionAPI, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
    data: prevision,
  });
  if (status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const aprobarPrevision = async (id: number, dataUser: UserFirmante) => {
  const guardarPrevisionAPI = `${getURLs().AprobarPrevision}/${id}`;
  const { status, data, errors } = await HttpClient.post(guardarPrevisionAPI, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
    data: dataUser,
  });
  if (status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};
