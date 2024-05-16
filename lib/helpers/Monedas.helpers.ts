import { Moneda } from "@lib/types/COMEX/Monedas.types";
import { ItemDropdown } from "@lib/types/ItemDropdown.types";

export const buildMonedasList = (
  monedas: Moneda[] | undefined
): ItemDropdown[] => {
  const auxMonedas: ItemDropdown[] = [];
  if (monedas) {
    monedas.forEach(p => {
      auxMonedas.push({ text: p.iso, value: p.iso });
    });
    return auxMonedas;
  }
  return [];
};

export const buildMonedasInitialValueFilter = (
  e: Moneda | undefined
): ItemDropdown => {
  if (e) {
    return {
      value: e.iso,
      text: e.iso,
    };
  } else {
    return {
      value: '',
      text: '',
    };
  }
};