import { Estado, FuncionalidadEstados } from '@lib/types/Estados/Estados.types';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';

export const buildEstadosList = (
  estados: Estado[] | undefined
): ItemDropdown[] => {
  const auxEstado: ItemDropdown[] = [];
  if (estados) {
    estados.forEach(e => {
      auxEstado.push({ text: e.descEstado, value: e.idEstado });
    });
    return auxEstado;
  }
  return [];
}; 
 
export const buildEstadosInitialValueFilter = (
  e: Estado | undefined
): ItemDropdown => {
  if (e) {
    return {
      value: e.idEstado,
      text: e.descEstado,
    };
  } else {
    return {
      value: '',
      text: '',
    };
  }
};

export const getEstadosFuncionalidad = (
  funcionalidades: FuncionalidadEstados[],
  funcionalidad: string
): Estado[] => {
  return funcionalidades.find(func => func.funcionalidad === funcionalidad)
    .estados;
};
