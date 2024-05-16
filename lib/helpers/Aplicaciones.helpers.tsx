import { ItemDropdown } from '@lib/types/ItemDropdown.types';

export const buildAplicacionesList = (
  aplicaciones: any[] | undefined
): ItemDropdown[] => {
  const auxAplicaciones: ItemDropdown[] = [];
  if (aplicaciones) {
    aplicaciones.forEach(p => {
      auxAplicaciones.push({ text: p.nombre, value: p.id })
    });
    return auxAplicaciones;
  }
  return [];
};

export const buildAplicacionesInitialValueFilter = (
  e: any | undefined
): ItemDropdown => {
  if (e) {
    return {
      value: e.id,
      text: e.nombre,
    };
  } else {
    return {
      value: '',
      text: '',
    };
  }
}