import { HttpClient } from '@galicia-toolkit/core';
import { appJSON } from '@lib/types/SourceSystem';
import { getURLs } from '../../config/ConfigurationService';
import {
  CheckProyectadaRequest,
  CreateMasivo,
  NewProyectadaRequest,
} from '../types/Proyectada.types';

export const getProyectadas = async () => {
  const traerProyectadaAPI = getURLs().GetProyectadas;
  const { status, data, errors } = await HttpClient.get(traerProyectadaAPI, {
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

export const getProyectadasExportBcra = async () => {
  const traerProyectadaAPI = getURLs().GetProyectadasExportBcra;
  const { status, data, errors } = await HttpClient.get(traerProyectadaAPI, {
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

export const getProyectadasByFilter = async (filtro: any) => {
  const filtroProyectadaAPI = getURLs().PostFiltroProyectadas;
  const { status, data, errors } = await HttpClient.post(filtroProyectadaAPI, {
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
export const checkProyectada = async (proyectada: CheckProyectadaRequest) => {
  const checkProyectadaAPI = getURLs().CheckProyectadasDuplicadas;
  const { status, data, errors } = await HttpClient.post(checkProyectadaAPI, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
    data: proyectada,
  });
  if (status === 201) {
    return data.isDuplicated;
  } else {
    return Promise.reject(errors);
  }
};

export const nuevaProyectada = async (proyectada: NewProyectadaRequest) => {
  const urlNuevaProyectada = getURLs().GetProyectadas;
  const { status, data, errors } = await HttpClient.post(urlNuevaProyectada, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
    data: proyectada,
  });
  if (status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const bajaProyectada = async (
  idProyectada: number,
  legajoUltimaModificacion: string
) => {
  const buscarProyectadas = `${
    getURLs().GetProyectadas
  }/${idProyectada}/${legajoUltimaModificacion}`;
  const { status, data, errors } = await HttpClient.del(buscarProyectadas, {
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

export const editarProyectada = async (
  token: string,
  proyectada: NewProyectadaRequest
) => {
  const nuevaProyectadaUrl = getURLs().GetProyectadas;
  const proyectadaNueva = await fetch(nuevaProyectadaUrl, {
    method: 'POST',
    headers: {
      'Content-Type': appJSON,
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(proyectada),
  });
  if (proyectadaNueva.status === 200 || proyectadaNueva.status === 201) {
    return proyectadaNueva.json();
  } else {
    return Promise.reject(proyectadaNueva);
  }
};

export const createMasivoProyectadas = async (
  excelBase64: string,
  legajo: string
) => {
  const proyectadasMasiva: CreateMasivo = {
    proyectadaCreateMasivaDTO: {
      excelBase64,
      legajoCreacion: legajo,
    },
  };
  const nuevaProyectadaUrl = getURLs().PostCreateMasivo;
  const { status, data, errors } = await HttpClient.post(nuevaProyectadaUrl, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
    data: proyectadasMasiva,
  });
  if (status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const getProyectadasVsOpcam = async (fecha: string) => {
  const fechaEnviar = new Date(fecha)
  const fechaFormateada = fechaEnviar.toISOString().split('T')[0];
  const url = getURLs().GetProyectadasVsOpcam
  const proyectadasVsOpcamAPI = `${url}?fechaProyectada=${fechaFormateada}`;
  const { status, data, errors } = await HttpClient.get(proyectadasVsOpcamAPI, {
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