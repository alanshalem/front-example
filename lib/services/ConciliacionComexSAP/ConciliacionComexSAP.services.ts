import { getURLs } from '../../../config/ConfigurationService';

import { HttpClient } from '@galicia-toolkit/core';
import { TipoDiferenciaTypes } from '@lib/types/ConciliacionComexSAP/ConciliacionComexSAP.types';
import { appJSON } from '@lib/types/SourceSystem';

export const getConceptosBoletos = async () => {
  const route = `${getURLs().GetConceptosBoletos}`;
  const { status, data, errors } = await HttpClient.get(route, {
    headers: {
      'Content-Type': appJSON,
    },
  });
  if (status === 200 || status === 201 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
}; 

export const getTipoDiferenciaConciliacion = async (): Promise<TipoDiferenciaTypes[]> => {
  const getTipoDiferenciaAPI = getURLs().GetTipoDiferencia;
  const { status, data, errors } = await HttpClient.get(getTipoDiferenciaAPI, {
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

export const GetConciliacionesComexSAPByFilter = async (filtro: any) => {
  const getConciliacionesComexSAPByFilterAPI = getURLs()
    .GetConciliacionComexSAPByFilter;
  const { status, data, errors } = await HttpClient.post(
    getConciliacionesComexSAPByFilterAPI,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorsRecipe: HttpClient.PomInterceptors,
      data: filtro,
    }
  );
  if (status === 200 || status === 201 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const downloadCruceOpcamTopsTableByFilter = async (filtro: any) => {
  const exportByFilter = getURLs().ExportConciliacionComexSAPByFilter;
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

export const getObservaciones = async (idSapAlerta: string | number) => {
  const getObservacionComexSapByIdSapAlerta = getURLs().GetObservacionComexSAP;
  const { status, data, errors } = await HttpClient.get(
    `${getObservacionComexSapByIdSapAlerta}?idSapAlerta=${idSapAlerta}`,
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

export const createObservacion = async (observacion: string) => {
  const createObservacionComexSap = getURLs().CreateObservacionComexSAP;
  const { status, data, errors } = await HttpClient.post(
    createObservacionComexSap,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorsRecipe: HttpClient.PomInterceptors,
      data: observacion,
    }
  );
  if (status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const asignarConciliacion = async (conciliacion: any) => {
  const asignarConciliacionComexSAP = getURLs().AsignarConciliacionComexSAP;
  const { status, data, errors } = await HttpClient.post(
    asignarConciliacionComexSAP,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorsRecipe: HttpClient.PomInterceptors,
      data: conciliacion,
    }
  );
  if (status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};

export const finalizarConciliacion = async (conciliacion: any) => {
  const finalizarConciliacionComexSAP = getURLs().FinalizarConciliacionComexSAP;
  const { status, data, errors } = await HttpClient.post(
    finalizarConciliacionComexSAP,
    {
      headers: {
        'Content-Type': appJSON,
      },
      interceptorsRecipe: HttpClient.PomInterceptors,
      data: conciliacion,
    }
  );
  if (status === 200 || status === 201) {
    return data;
  } else {
    return Promise.reject(errors);
  }
};
