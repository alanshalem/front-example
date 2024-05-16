/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { FuncionalidadAccion } from '@lib/types/SourceSystem';
import { getPermisosUsuario } from '@lib/services/Users.services';

type AuthContextType = {
  rolesUsuario?: any;
  permisos?: FuncionalidadAccion[];
};
const AuthContext = createContext<AuthContextType>(null);

export const AuthProvider: React.FunctionComponent = ({ children }) => {
  const { accounts } = useMsal();
  const [permisos, setPermisos] = useState<FuncionalidadAccion[]>();

  /**
   * A custom type guard function that determines whether
   * `value` is an array that only contains strings.
   */
  function isStringArray(value: unknown): value is string[] {
    return (
      Array.isArray(value) &&
      value.every(element => typeof element === 'string')
    );
  }

  const roles = useMemo(
    () => ({
      rolesUsuario: isStringArray(accounts[0].idTokenClaims.groups)
        ? accounts[0].idTokenClaims.groups[0]
        : '',
      permisos,
    }),
    [accounts, permisos]
  );

  const obtenerPermisos = () => {
    getPermisosUsuario(roles.rolesUsuario)
      .then((result: FuncionalidadAccion[]) => {
        if (result) {
          setPermisos(result);
        }
      })
      .catch(error => error);
  };

  useEffect(() => {
    obtenerPermisos();
  }, [roles.rolesUsuario]);

  return <AuthContext.Provider value={roles}>{children}</AuthContext.Provider>;
};

AuthProvider.displayName = 'AuthProvider';

export default AuthContext;
