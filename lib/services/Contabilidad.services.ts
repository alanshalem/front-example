import { HttpClient } from '@galicia-toolkit/core';
import { appJSON } from '@lib/types/SourceSystem';
import { getURLs } from '../../config/ConfigurationService';
import {
  CheckContabilidadRequest,
  EventosContablesContabilidadManualTypes,
  FilterContabilidad,
  NewContabilidadRequest,
  ReferenciasContablesContabilidadManualTypes,
} from '../types/Contabilidad/Contabilidad.types';

export const getContabilidad = async () => {
  const traerContabilidadAPI = getURLs().GetCruces;
  const { status, data, errors } = await HttpClient.get(traerContabilidadAPI, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
  });
  if (status === 200 || status === 201 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const getContabilidadExportBcra = async () => {
  const traerContabilidadAPI = getURLs().GetCrucesExportBcra;
  const { status, data, errors } = await HttpClient.get(traerContabilidadAPI, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
  });
  if (status === 200 || status === 201 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const getCrucesByFilter = async (filtro: FilterContabilidad) => {
  const filtroContabilidadAPI = getURLs().PostFiltroCruces;
  const { status, data, errors } = await HttpClient.post(
    filtroContabilidadAPI,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorsRecipe: HttpClient.PomInterceptors,
      data: filtro,
    }
  );
  if (status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const checkContabilidad = async (
  proyectada: CheckContabilidadRequest
) => {
  const checkContabilidadAPI = getURLs().CheckCrucesDuplicadas;
  const { status, data, errors } = await HttpClient.post(checkContabilidadAPI, {
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

export const nuevaContabilidad = async (proyectada: NewContabilidadRequest) => {
  const urlNuevaContabilidad = getURLs().GetCruces;
  const { status, data, errors } = await HttpClient.post(urlNuevaContabilidad, {
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

export const bajaContabilidad = async (idContabilidad: number) => {
  const buscarContabilidad = `${getURLs().DeleteCruces}/${idContabilidad}`;
  const { status, data, errors } = await HttpClient.del(buscarContabilidad, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
  });
  if (status === 200 || status === 201 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const editarContabilidad = async (
  token: string,
  proyectada: NewContabilidadRequest
) => {
  const nuevaContabilidadUrl = getURLs().GetCruces;
  const proyectadaNueva = await fetch(nuevaContabilidadUrl, {
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

export const createMasivoCruces = async (cruces: string, legajo: string) => {
  const crucesContablesMasivo = {
    crucesContablesMasivoDTO: { excelBase64: cruces, legajoCreacion: legajo },
  };

  const nuevaProyectadaUrl = getURLs().PostCreateMasivoCruces;
  const { status, data, errors } = await HttpClient.post(nuevaProyectadaUrl, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
    data: crucesContablesMasivo,
  });

  if (status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const getEventosContablesContabilidadManual = async (): Promise<EventosContablesContabilidadManualTypes[]> => {
  const getEventosApi = getURLs().GetEventosContablesContabilidadManual;
  const { status, data, errors } = await HttpClient.get(getEventosApi, {
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

export const getReferenciasContablesContabilidadManual = async (): Promise<ReferenciasContablesContabilidadManualTypes[]> => {
  const getReferenciasAPI = getURLs().GetReferenciasContablesContabilidadManual;
  const { status, data, errors } = await HttpClient.get(getReferenciasAPI, {
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

export const loadContabilidadManual = async (
  datos
): Promise<EventosContablesContabilidadManualTypes[]> => {
  // Logica para que si es corresponsal, no se envie el documento y si se envia el documento, no se envie el corresponsal.
  if (datos.idCorresponsal) {
    delete datos.nroDocumento;
    delete datos.tipoDocumento;
  } else {
    delete datos.idCorresponsal;
  }

  const contabilidadManual = {
    contabilidadManual: datos,
  };

  const loadContabilidadManualAPI = getURLs().LoadContabilidadManual;
  const { status, data, errors } = await HttpClient.post(
    loadContabilidadManualAPI,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorsRecipe: HttpClient.PomInterceptors,
      data: contabilidadManual,
    }
  );

  if (status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const simularContabilidadManual = async (datos): Promise<any> => {
  // Logica para que si es corresponsal, no se envie el documento y si se envia el documento, no se envie el corresponsal.
  if (datos.idCorresponsal) {
    delete datos.nroDocumento;
    delete datos.tipoDocumento;
  } else {
    delete datos.idCorresponsal;
  }

  const contabilidadManualSimulacion = {
    simulacionContabilidadManual: datos,
  };

  const simularContabilidadManualAPI = getURLs().SimularContabilidadManual;
  const { status, data, errors } = await HttpClient.post(
    simularContabilidadManualAPI,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorsRecipe: HttpClient.PomInterceptors,
      data: contabilidadManualSimulacion,
    }
  );

  if (status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const guardarContabilidadManual = async (
  datos
): Promise<EventosContablesContabilidadManualTypes[]> => {
  // Logica para que si es corresponsal, no se envie el documento y si se envia el documento, no se envie el corresponsal.
  if (datos.idCorresponsal != 0) {
    delete datos.nroDocumento;
    delete datos.tipoDocumento;
  } else {
    delete datos.idCorresponsal;
  }

  const contabilidadManual = {
    contabilidadManualCreate: datos,
  };

  const guardarContabilidadManualAPI = getURLs().GuardarContabilidadManual;
  const { status, data, errors } = await HttpClient.post(
    guardarContabilidadManualAPI,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorsRecipe: HttpClient.PomInterceptors,
      data: contabilidadManual,
    }
  );

  if (status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};
