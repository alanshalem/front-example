import { OpcamTopsAuxiliar } from '@components/CruceOPCAMvsTOPS/CruceOpcamTopsPage';
import {
  getCruceOpcamTopsByFilter,
  getCrucesOpcamTopsDiaHabil,
} from '@lib/services/CruceOpcamTops/CruceOpcamTops.services';
import {
  CruceOpcamTopsFiltersAuxiliar,
  FilterOpcamTops,
} from '@lib/types/CruceOpcamTops/CruceOpcamTops.types';
import { isEmpty } from './helpers';

export const initialStateFilters: CruceOpcamTopsFiltersAuxiliar = {
  aplicacion: '',
  tipoOperacion: '',
  nroBoleto: '',
  fechaCruce: '',
  tipoCondicion: '',
  tipoDiferencia: '',
  valor: '',
};

//devuelve true si todos los campos del filtro estan vacios
export const verificarFiltroOpcamTops = (
  filtroOpcamTops: CruceOpcamTopsFiltersAuxiliar
): boolean => {
  return (
    isEmpty(filtroOpcamTops.aplicacion) &&
    isEmpty(filtroOpcamTops.tipoOperacion) &&
    isEmpty(filtroOpcamTops.nroBoleto) &&
    isEmpty(filtroOpcamTops.fechaCruce) &&
    isEmpty(filtroOpcamTops.tipoCondicion) &&
    isEmpty(filtroOpcamTops.tipoDiferencia) &&
    isEmpty(filtroOpcamTops.valor)
  );
};

export const getCrucesOpcamTopsDelUltimoDiaHabil = (
  setCruceBoletoOpcamTopsList: (
    value: React.SetStateAction<OpcamTopsAuxiliar[]>
  ) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void,
  setFiltroOpcamTops?: (
    value: React.SetStateAction<CruceOpcamTopsFiltersAuxiliar>
  ) => void
) => {
  getCrucesOpcamTopsDiaHabil()
    .then((result: any) => {
      setCruceBoletoOpcamTopsList(result);
      const initialStateConFecha = {
        ...initialStateFilters,
        fechaCruce: new Date(result[0].fechaCruce).toLocaleDateString(),
      };
      setFiltroOpcamTops(initialStateConFecha);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

export const prepareFilter = (
  setCruceBoletoOpcamTopsList: (
    value: React.SetStateAction<OpcamTopsAuxiliar[]>
  ) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void,
  filtroOpcamTops?: CruceOpcamTopsFiltersAuxiliar
) => {
  let filtroOpcamTopsObj: FilterOpcamTops;
  filtroOpcamTopsObj = {
    ConciliacionBoletoByFilterDTO: {
      fechaCruce: filtroOpcamTops.fechaCruce
        ? filtroOpcamTops.fechaCruce
        : null,
      nroBoleto: filtroOpcamTops.nroBoleto ? filtroOpcamTops.nroBoleto : null,
      tipoOperacion: filtroOpcamTops.tipoOperacion
        ? filtroOpcamTops.tipoOperacion
        : null,
      tipoCondicion: filtroOpcamTops.tipoCondicion
        ? filtroOpcamTops.tipoCondicion
        : null,
      aplicacion: filtroOpcamTops.aplicacion
        ? filtroOpcamTops.aplicacion
        : null,
      tipoDiferencia: filtroOpcamTops.tipoDiferencia
        ? filtroOpcamTops.tipoDiferencia
        : null,
      valor: filtroOpcamTops.valor ? filtroOpcamTops.valor : null,
    },
  };
  getCruceOpcamTopsByFilter(filtroOpcamTopsObj)
    .then((result: any) => {
      setCruceBoletoOpcamTopsList(result);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};
