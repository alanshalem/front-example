import { HttpClient } from '@galicia-toolkit/core';
import { getURLs } from '../../../config/ConfigurationService';

export const GetProcesoForFilter = async () => {
  const getProcesoForFilter = getURLs().GetProcesoForFilter;
  const { status, data, errors } = await HttpClient.get(getProcesoForFilter, {
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

export const GetProcesoByClassName = async () => {
  const getProcesoForFilter = getURLs().GetProcesoByClassName;
  const { status, data, errors } = await HttpClient.get(getProcesoForFilter, {
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

export const GetProcesoResultadoByFilter = async (filtro: any) => {
  const getProcesoForFilter = getURLs().GetProcesoResultadoByFilter;
  const { status, data, errors } = await HttpClient.post(getProcesoForFilter, {
    headers: {
      'Content-Type': 'application/json',
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
    data: filtro,
  });
  if (status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const CreateProceso = async () => {
  const getProcesoForFilter = getURLs().CreateProceso;
  const { status, data, errors } = await HttpClient.get(getProcesoForFilter, {
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

export const CreateProcesoResultado = async () => {
  const getProcesoForFilter = getURLs().CreateProcesoResultado;
  const { status, data, errors } = await HttpClient.post(getProcesoForFilter, {
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

export const UpdateProceso = async () => {
  const getProcesoForFilter = getURLs().UpdateProceso;
  const { status, data, errors } = await HttpClient.post(getProcesoForFilter, {
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

export const UpdateProcesoResultado = async () => {
  const getProcesoForFilter = getURLs().UpdateProcesoResultado;
  const { status, data, errors } = await HttpClient.post(getProcesoForFilter, {
    headers: {
      'Content-Type': 'application/json',
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
  });
  if (status === 200) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};
