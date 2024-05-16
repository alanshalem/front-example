import { HttpClient } from '@galicia-toolkit/core';
import { Categoria } from '@lib/types/Contabilidad/Eventos/Inventario/EventoInventario.types';
import { FuncionalidadEstados } from '@lib/types/Estados/Estados.types';
import { getURLs } from '../../../config/ConfigurationService';

export const getMonedas = async () => {
  const traerMonedasAPI = getURLs().GetMonedas;
  const { status, data, errors } = await HttpClient.get(traerMonedasAPI, {
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

export const getDocumentos = async () => {
  const traerDocumentosAPI = getURLs().GetDocumentos;
  const { status, data, errors } = await HttpClient.get(traerDocumentosAPI, {
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

export const getCentrosDeCosto = async () => {
  const traerCentrosDeCostoAPI = getURLs().GetCentrosDeCosto;
  const { status, data, errors } = await HttpClient.get(
    traerCentrosDeCostoAPI,
    {
      headers: {
        'Content-Type': 'application/json',
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

export const getRubros = async () => {
  const traerCentrosDeCostoAPI = getURLs().GetRubrosCommon;
  const { status, data, errors } = await HttpClient.get(
    traerCentrosDeCostoAPI,
    {
      headers: {
        'Content-Type': 'application/json',
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

export const getEstados = async (): Promise<FuncionalidadEstados[]> => {
  const getEstadosAPI = getURLs().GetEstados;
  const { status, data, errors } = await HttpClient.get(getEstadosAPI, {
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
export const getEventos = async (): Promise<Categoria[]> => {
  const getEventosApi = getURLs().GetEventos;
  const { status, data, errors } = await HttpClient.get(getEventosApi, {
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
export const getAplicaciones = async (): Promise<any> => {
  const getAplicacionesApi = getURLs().GetAplicaciones;
  const { status, data, errors } = await HttpClient.get(getAplicacionesApi, {
    headers: {
      'Content-Type': 'application/json',
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
  });
  if (status === 200 || status === 201 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};
