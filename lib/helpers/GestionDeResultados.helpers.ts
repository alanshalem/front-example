import { toastCallAux } from '@components/Toast/Toast.helpers';
import {
  aprobarPrevisionGestionDeResultados,
  getGestionDeResultadosByFilter,
  postPrevisionGestionDeResultados,
} from '@lib/services/GestionDeResultados/GestionDeResultados.services';
import {
  BodyFilterGestionDeResultados,
  GestionDeResultadosFiltersAuxiliar,
} from '@lib/types/GestionDeResultados/GestionDeResultados.types';
import { UserFirmante } from '@lib/types/Previsiones/Previsiones.types';
import { formatDateYYYYMM } from '@lib/utils/Date';
import { isEmpty } from 'lodash';

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const mm = month.toString().padStart(2, '0');

export const initialStateFilters: GestionDeResultadosFiltersAuxiliar = {
  periodo: `${year}/${mm}`,
  tipoResultado: '',
  divisa: '',
  estado: '',
};

const verificarFiltroGestionDeResultados = (
  filtro: GestionDeResultadosFiltersAuxiliar
) => {
  return isEmpty(filtro.periodo);
};

export const prepareFilterGestionDeResultados = (
  filtro: GestionDeResultadosFiltersAuxiliar,
  setGestionDeResultadosList: React.Dispatch<React.SetStateAction<any>>,
  setLoading: (value: React.SetStateAction<boolean>) => void,
  setPeriodo: React.Dispatch<React.SetStateAction<string>>
) => {
  const auxFiltro = { ...filtro };
  auxFiltro.periodo = auxFiltro.periodo ? formatDateYYYYMM(auxFiltro.periodo) : null;
  if (!verificarFiltroGestionDeResultados(auxFiltro)) {
    const body: BodyFilterGestionDeResultados = {
      periodo: auxFiltro.periodo,
      divisa: auxFiltro.divisa || null,
      estado: auxFiltro.estado || null,
      tipoResultado: auxFiltro.tipoResultado || null,
    };
    getGestionDeResultadosByFilter(body)
      .then((result: any) => {
        if (filtro.estado === 0) {
          const filteredResult = result.filter(
            (item) => item.nombreEstado === 'Nueva'
          );
          setGestionDeResultadosList(filteredResult);
          setPeriodo(formatDateYYYYMM(body.periodo));
          setLoading(false);
        } else {
          setGestionDeResultadosList(result);
          setPeriodo(formatDateYYYYMM(body.periodo));
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  } else {
    setLoading(false);
    toastCallAux('No se puede buscar sin un periodo', false);
  }
};

export const verificarPeriodoGestionDeResultados = (
  value: string | Date,
  field: string,
  setFiltroGestionDeResultados: React.Dispatch<
    React.SetStateAction<GestionDeResultadosFiltersAuxiliar>
  >,
  filtroGestionDeResultados: GestionDeResultadosFiltersAuxiliar
) => {
  let currentDate = new Date();

  if (value > currentDate) {
    setFiltroGestionDeResultados(() => ({
      ...filtroGestionDeResultados,
      [field]: `${year}/${mm}`,
    }));
  } else {
    setFiltroGestionDeResultados(() => ({
      ...filtroGestionDeResultados,
      [field]: value,
    }));
  }
};

export const guardarPrevisionGestionDeResultados = (
  prevision: any,
  setLoading: (value: React.SetStateAction<boolean>) => void,
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
) => {
  postPrevisionGestionDeResultados(prevision)
    .then((result: any) => {
      setLoading(false);
      if (result.hasErrors || result === 'false') {
        toastCallAux('Error al guardar', false);
      } else {
        toastCallAux('Prevision guardada', true);
        setRefresh(true);
      }
    })
    .catch(() => {
      setLoading(false);
      toastCallAux('Error al guardar', false);
    });
};

export const realizarAprobacionGestionDeResultados = (
  id: number,
  dataUser: UserFirmante,
  setLoading: (value: React.SetStateAction<boolean>) => void,
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
) => {
  aprobarPrevisionGestionDeResultados(id, dataUser)
    .then((result: any) => {
      setLoading(false);
      if (result === 'true') {
        toastCallAux('Prevision aprobada', true);
        setRefresh(true);
      } else {
        toastCallAux('Error al aprobar', false);
      }
    })
    .catch(() => {
      setLoading(false);
      toastCallAux('Error al aprobar', false);
    });
};
