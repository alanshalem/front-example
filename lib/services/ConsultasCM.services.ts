import { HttpClient } from '@galicia-toolkit/core';
import { TipoSaldo } from '@lib/helpers/ConsultasCM.helpers';
import { appJSON } from '@lib/types/SourceSystem';
import { getURLs } from '../../config/ConfigurationService';

export const getConsultasSaldoByFilter = async (
  filtro: any,
  tipo: TipoSaldo
) => {
  const getByFilter =
    tipo === 'diario'
      ? getURLs().GetConsultasSaldoDiarioByFilter
      : getURLs().GetConsultasSaldoMensualByFilter;
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

export const getDivisas = async (tipo: TipoSaldo): Promise<string[]> => {
  const getDivisa = getURLs().GetConsultasSaldoDivisa;
  const { status, data, errors } = await HttpClient.get(
    `${getDivisa}?TipoSaldo=${tipo}`,
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

export const getRubro = async (tipo: TipoSaldo) => {
  const getRubro = getURLs().GetConsultasSaldoRubro;
  const { status, data, errors } = await HttpClient.get(
    `${getRubro}?TipoSaldo=${tipo}`,
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

export const getCasa = async (tipo: TipoSaldo) => {
  const getCasa = getURLs().GetConsultasSaldoCasa;
  const { status, data, errors } = await HttpClient.get(
    `${getCasa}?TipoSaldo=${tipo}`,
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
