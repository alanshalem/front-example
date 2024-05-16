import { HttpClient } from '@galicia-toolkit/core';
import { FuncionalidadAccion } from '@lib/types/SourceSystem';
import { getURLs } from '../../config/ConfigurationService';

export const getPermisosUsuario = async (
  permisos: string
): Promise<FuncionalidadAccion[]> => {
  const traerPermisosUsuario = `${getURLs().GetPermisosUsuario}/${permisos}`;
  const { status, data, errors } = await HttpClient.get(traerPermisosUsuario, {
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
