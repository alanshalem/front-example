import { Corresponsal } from './../types/Corresponsal/Corresponsa.types';
import { ItemDropdown } from "@lib/types/ItemDropdown.types";

export const buildCorresponsalList = (
    corresponsal: Corresponsal[] | undefined
): ItemDropdown[] => {
  const auxCorresponsal: ItemDropdown[] = [];
  if(corresponsal) {
      corresponsal.forEach(p => {
        auxCorresponsal.push({text: `${p.swift}`, value: p.id})
      })
      return auxCorresponsal
  }
  return []
}

export const buildCorresponsalInitialValueFilter = (
  e: Corresponsal | undefined
): ItemDropdown => {
  if (e) {
    return {
      value: e.id,
      text: `${e.swift}`,
    };
  } else {
    return {
      value: '',
      text: '',
    };
  }
};

export const buildCorresponsalDivisaList = (
  corresponsal: Corresponsal[] | undefined
): ItemDropdown[] => {
  const auxCorresponsal: ItemDropdown[] = [];
  if(corresponsal) {
    corresponsal.forEach(p => {
      auxCorresponsal.push({text: `${p.corresponsalDivisa}`, value: p.id, nombre: p.divisa, label: p.swift })
    })
    return auxCorresponsal
  }
  return []
};

export const buildCorresponsalDivisaInitialValueFilter = (
  e: Corresponsal | undefined
): ItemDropdown => {
  if (e) {
    return {
      value: e.id,
      text: e.corresponsalDivisa,
    };
  } else {
    return {
      value: '',
      text: '',
    };
  }
};



