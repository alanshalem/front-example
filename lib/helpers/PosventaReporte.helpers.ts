import { PosventaTableItem } from '@lib/types/Posventa/Posventa.types';
import { PosventaReporteAuxiliar } from '@lib/types/PosventaReporte.types';
import { isEmpty } from './helpers';
import { getPosventaReporteriaByFilter } from '@lib/services/Posventa/Posventa.services';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';

//devuelve true si todos los campos del filtro estan vacios
export const verificarFiltro = (
  filtroPosventaReporte: PosventaReporteAuxiliar
): boolean => {
  return (
    isEmpty(filtroPosventaReporte.idAplicacion) &&
    isEmpty(filtroPosventaReporte.moneda) &&
    isEmpty(filtroPosventaReporte.concepto) &&
    isEmpty(filtroPosventaReporte.cuit) &&
    isEmpty(filtroPosventaReporte.idPosVentaTipo) &&
    isEmpty(filtroPosventaReporte.idEstado)
  );
};

export const getAllPosventaReporteTable = (
  setPosventaReporteTable: (value: React.SetStateAction<any[]>) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void
) => {
  const posVentaReporteriaDTO: any = {
    posVentaReporteriaDTO: {},
  };
  getPosventaReporteriaByFilter(posVentaReporteriaDTO)
    .then((result: any) => {
      setPosventaReporteTable(result);
      setLoading(false);
    })
    .catch(() => {
      setPosventaReporteTable([]);
      setLoading(false);
    });
};

export const prepareFilterPosventaReporte = (
  filtroPosventaReporte: PosventaReporteAuxiliar,
  setPosventaTable: (value: React.SetStateAction<PosventaTableItem[]>) => void,
  setLoading: any
) => {
  const posventaReporteFilter: any = {
    idAplicacion: filtroPosventaReporte.idAplicacion
      ? filtroPosventaReporte.idAplicacion
      : null,
    moneda: filtroPosventaReporte.moneda ? filtroPosventaReporte.moneda : null,
    concepto: filtroPosventaReporte.concepto
      ? filtroPosventaReporte.concepto
      : null,
    cuit: filtroPosventaReporte.cuit ? filtroPosventaReporte.cuit : null,
    idPosVentaTipo: filtroPosventaReporte.idPosVentaTipo
      ? filtroPosventaReporte.idPosVentaTipo
      : null,
    idEstado: Number(filtroPosventaReporte.idEstado)
      ? Number(filtroPosventaReporte.idEstado)
      : null,
  };

  const posVentaReporteriaDTO: any = {
    posVentaReporteriaDTO: posventaReporteFilter,
  };

  getPosventaReporteriaByFilter(posVentaReporteriaDTO)
    .then((result: any) => {
      setPosventaTable(result);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

export const itemsAplicacion = [
  { value: '1', text: 'TOPS' },
  { value: '2', text: 'BankTrade' },
  { value: '3', text: 'TESIN' },
];

export const itemsMoneda = [
  { text: 'ARS', value: 'ARS' },
  { text: 'USD', value: 'USD' },
];

export const buildAplicacionInitialValueFilter = (
  e: any | undefined
): ItemDropdown => {
  if (e) {
    return {
      value: `${e.text}`,
      text: `${e.value}`,
    };
  } else {
    return {
      value: '',
      text: '',
    };
  }
};

export const buildMonedaPosVentaInitialValueFilter = (
  e: any | undefined
): ItemDropdown => {
  if (e) {
    return {
      value: `${e.text}`,
      text: `${e.value}`,
    };
  } else {
    return {
      value: '',
      text: '',
    };
  }
};

export const buildTipoPosVentaInitialValueFilter = (
  e: any | undefined
): ItemDropdown => {
  if (e) {
    return {
      value: `${e.text}`,
      text: `${e.value}`,
    };
  } else {
    return {
      value: '',
      text: '',
    };
  }
};