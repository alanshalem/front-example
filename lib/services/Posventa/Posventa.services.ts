import { HttpClient } from '@galicia-toolkit/core';
import {
  PosventaTipo,
  PosventasAAprobar,
  PosventasARechazar,
} from '@lib/types/Posventa/Posventa.types';
import { appJSON } from '@lib/types/SourceSystem';
import { getURLs } from '../../../config/ConfigurationService';

// hacer los types

export const getByNroOperacionSecuenciaIdPosVentaTipo = async (
  nroOperacion: string,
  secuencia: string,
  idPosVentaTipo: string
) => {
  const getByNroOperacion = getURLs().GetPosventa;
  const { status, data, errors } = await HttpClient.get(
    `${getByNroOperacion}?NroOperacion=${nroOperacion}&Secuencia=${secuencia}&IdPosVentaTipo=${idPosVentaTipo}`,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorsRecipe: HttpClient.PomInterceptors,
      data: nroOperacion,
    }
  );
  if (status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const getPosventaByFilter = async (filtro: any) => {
  const getByFilter = getURLs().GetPosventaByFilter;
  const { status, data, errors } = await HttpClient.post(getByFilter, {
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

export const downloadPosventaTableByFilter = async (filtro: any) => {
  const exportByFilter = getURLs().ExportPosventaByFilter;
  const { status, data, errors } = await HttpClient.post(exportByFilter, {
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

export const getPosventaReporteriaByFilter = async (filtro: any) => {
  const getReporteriaByFilter = getURLs().GetPosventaReporteriaByFilter;
  const { status, data, errors } = await HttpClient.post(
    getReporteriaByFilter,
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

export const guardarPosventa = async (posventaData: any) => {
  const guardarPosventa = getURLs().GuardarPosventa;
  const { status, data, errors } = await HttpClient.post(guardarPosventa, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
    data: posventaData,
  });
  if (status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const aprobarPosventas = async (
  posventas: PosventasAAprobar
): Promise<any> => {
  const aprobarPosventasURL = getURLs().AprobarPosventas;
  const { status, data, errors } = await HttpClient.post(aprobarPosventasURL, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorRecipe: HttpClient.PomInterceptors,
    data: posventas,
  });
  if (status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const rechazarPosventas = async (
  posventas: PosventasARechazar
): Promise<any> => {
  const rechazarPosventasURL = getURLs().RechazarPosventas;
  const { status, data, errors } = await HttpClient.post(rechazarPosventasURL, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorRecipe: HttpClient.PomInterceptors,
    data: posventas,
  });
  if (status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const getSolicitudesPosventaGenericas = async (
  posVentaGetSolicitudesGenericDTO: any
) => {
  const urlGetSolicitudesPosventaGenerica = getURLs()
    .GetSolicitudesPosventaGenerica;
  const { status, data, errors } = await HttpClient.post(
    urlGetSolicitudesPosventaGenerica,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorsRecipe: HttpClient.PomInterceptors,
      data: posVentaGetSolicitudesGenericDTO,
    }
  );
  if (status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const postGuardarPosventaGenerica = async (
  posVentaCreateGenericDTO: any
) => {
  const urlPostGuardarPosventaGenerica = getURLs().GuardarPosventaGenerica;
  const { status, data, errors } = await HttpClient.post(
    urlPostGuardarPosventaGenerica,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorsRecipe: HttpClient.PomInterceptors,
      data: posVentaCreateGenericDTO,
    }
  );
  if (status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const getTiposPosventa = async (): Promise<PosventaTipo[]> => {
  const urlGetAllPosventaTipo = getURLs().GetAllPosventaTipo;
  const { status, data, errors } = await HttpClient.get(urlGetAllPosventaTipo, {
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

export const getByIdPosVentaTipo = async (
  nroOperacion: string,
  idAplicacion: string | number,
  idPosVentaTipo: string | number,
  esGenerico: boolean
): Promise<any[]> => {
  const urlGetByIdPosVentaTipo = getURLs().GetByIdPosventaTipo;
  const { status, data, errors } = await HttpClient.get(
    `${urlGetByIdPosVentaTipo}?IdPosVentaTipo=${idPosVentaTipo}&NroOperacion=${nroOperacion}&IdAplicacion=${idAplicacion}&EsGenerico=${esGenerico}`,
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

export const getNombresConceptos = async () => {
  const traerNombresConceptosAPI = getURLs().GetNombresConceptos;
  const { status, data, errors } = await HttpClient.get(
    traerNombresConceptosAPI,
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

export const validarBoletoPosventaGenerica = async (filtro: any) => {
  const validarBoleto = getURLs().ValidarBoletoPosventaGenerica
  const { status, data, errors } = await HttpClient.post(validarBoleto, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
    data: filtro,
  });
  if (status === 201 || status === 200) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const guardarBoletoPosventaGenerica = async (filtro: any) => {
  const guardarBoleto = getURLs().GuardarBoletoPosventaGenerica
  const { status, data, errors } = await HttpClient.post(guardarBoleto, {
    headers: {
      'Content-Type': appJSON,
    },
    interceptorsRecipe: HttpClient.PomInterceptors,
    data: filtro,
  });
  if (status === 201 || status === 200) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};