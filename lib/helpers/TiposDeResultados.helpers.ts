import { ItemDropdown } from '@lib/types/ItemDropdown.types';

export const buildTiposDeResultadosList = (
  tiposDeResultados: any | undefined
): ItemDropdown[] => {
  const auxTiposDeResultados: ItemDropdown[] = [];
  if (tiposDeResultados) {
      tiposDeResultados.forEach(e => {
        auxTiposDeResultados.push({text: e.tipo, value: e.id})
      });
      return auxTiposDeResultados;
  }
  return [];
};

export const buildTiposDeResultadosInitialValueFilter = (
  e: any | undefined
  ): ItemDropdown => {
    if (e) {
      return {
        value: e.id,
        text: `${e.tipo}`,
      };
    } else {
      return {
        value: '',
        text: '',
      };
    }
  };