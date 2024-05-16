// Se crea este archivo con el objetivo de no usar las funciones que estan en Estados.helpers ya que si se cambian esas funciones se rompe la aplicacion
import { Estado, FuncionalidadEstados } from '@lib/types/Estados/Estados.types';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';

export const buildEstadosConciliacionComexSAPList = (
  estados: Estado[] | undefined
): ItemDropdown[] => {
  const auxEstado: ItemDropdown[] = [];
  if (estados) {
    estados.forEach(e => {
      auxEstado.push({ text: e.descEstado, value: e.idEstadoFuncionalidad });
    });
    return auxEstado;
  }
  return [];
}; 

export const buildEstadosConciliacionComexSAPListInitialValueFilter = (
  e: Estado | undefined
): ItemDropdown => {
  if (e) {
    return {
      value: e.idEstadoFuncionalidad,
      text: e.descEstado,
    };
  } else {
    return {
      value: '',
      text: '',
    };
  }
};

export const getEstadosConciliacionComexSAPFuncionalidad = (
  funcionalidades: FuncionalidadEstados[],
  funcionalidad: string
): Estado[] => {
  return funcionalidades.find(func => func.funcionalidad === funcionalidad)
    .estados;
};
