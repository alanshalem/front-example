import { ItemDropdown } from '@lib/types/ItemDropdown.types'

export const buildTiposAnaliticoGastoRebatelList = (
  tiposAnaliticos: any | undefined
): ItemDropdown[] => {
  const auxTiposAnaliticos: ItemDropdown[] = [];
  if (tiposAnaliticos) {
      tiposAnaliticos.forEach(e => {
        auxTiposAnaliticos.push({text: e.nombre, value: e.id})
      });
      return auxTiposAnaliticos;
  }
  return [];
};

export const buildTiposAnaliticoGastoRebatelInitialValueFilter = (
e: any | undefined
): ItemDropdown => {
  if (e) {
    return {
      value: e.id,
      text: `${e.nombre}`,
    };
  } else {
    return {
      value: '',
      text: '',
    };
  }
};

export const buildTiposAnaliticoPrevisiones = (
  tiposAnaliticos: any | undefined
) : ItemDropdown[] => {
  const auxTiposAnaliticos: ItemDropdown[] = [];
  if (tiposAnaliticos) {
    tiposAnaliticos.forEach(e => {
      auxTiposAnaliticos.push({text: e.nombre, value: e.id})
    })
    return auxTiposAnaliticos;
  }
  return [];
};