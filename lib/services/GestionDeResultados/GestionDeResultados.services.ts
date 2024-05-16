import { HttpClient } from '@galicia-toolkit/core';
import { appJSON } from '@lib/types/SourceSystem';
import { getURLs } from '../../../config/ConfigurationService';
import { UserFirmante } from '@lib/types/Previsiones/Previsiones.types';
import { BodyFilterGestionDeResultados } from '@lib/types/GestionDeResultados/GestionDeResultados.types';

export const getGestionDeResultadosByFilter = async (
  filtro: BodyFilterGestionDeResultados
): Promise<any[]> => {
  let queryParams: string[] = [];

  if (filtro.periodo !== null) {
    queryParams.push(`periodo=${encodeURIComponent(filtro.periodo)}`);
  }
  if (filtro.tipoResultado !== null) {
    queryParams.push(
      `tipoResultado=${encodeURIComponent(filtro.tipoResultado)}`
    );
  }
  if (filtro.divisa !== null) {
    queryParams.push(`divisa=${encodeURIComponent(filtro.divisa)}`);
  }
  if (filtro.estado !== null) {
    queryParams.push(`idEstado=${encodeURIComponent(filtro.estado)}`);
  }

  const gestionDeResultadosAPI = `${
    getURLs().GestionDeResultadosByFilter
  }?${queryParams.join('&')}`;

  const { status, data, errors } = await HttpClient.get(
    gestionDeResultadosAPI,
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

export const postPrevisionGestionDeResultados = async (prevision: any) => {
  // const guardarPrevisionAPI = getURLs().PostPrevision;
  const guardarPrevisionAPI = getURLs().GuardarGestionDeResultado;
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

export const aprobarPrevisionGestionDeResultados = async (
  id: number,
  dataUser: UserFirmante
) => {
  // const guardarPrevisionAPI = `${getURLs().AprobarPrevision}/${id}`;
  const guardarPrevisionAPI = `${getURLs().AprobarGestionResultado}/${id}`;

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
