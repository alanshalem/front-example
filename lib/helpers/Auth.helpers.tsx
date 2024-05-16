import { FuncionalidadAccion } from '@lib/types/SourceSystem';
import { toastCallAux } from '@components/Toast/Toast.helpers';

export function tienePermisos(
  funcionalidad: string,
  accion: string,
  permisos: FuncionalidadAccion[],
  genericFunc: any
) {
  const tieneFuncionalidad = permisos.find(
    permiso =>
      permiso.funcionalidad.toLocaleLowerCase() ===
      funcionalidad.toLocaleLowerCase()
  );

  if (tieneFuncionalidad !== undefined && tieneFuncionalidad[accion]) {
    genericFunc();
  } else {
    toastCallAux('No tienes permisos para ejecutar esta acción.', false);
  }
}
