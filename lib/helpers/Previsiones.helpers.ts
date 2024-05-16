import { toastCallAux } from '@components/Toast/Toast.helpers'
import { aprobarPrevision, getPrevisionesByFilter, postPrevision } from '@lib/services/Previsiones/Previsiones.services';
import { ItemDropdown } from '@lib/types/ItemDropdown.types'
import { FilterPrevisiones, PrevisionFiltersAuxiliar, PrevisionPost, PrevisionResponse, UserFirmante } from '@lib/types/Previsiones/Previsiones.types';
import { formatDateYYYYMM } from '@lib/utils/Date';
import { isEmpty } from 'lodash';

const date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;

if (month === 12) {
  year++;
  month = 1;
} else {
  month += 1;
}

const mm = month.toString().padStart(2, '0');
const yyyyMM = `${year}/${mm}`;

const currentMonth = date.getMonth() + 1;

const currentMonthPadded = currentMonth.toString().padStart(2, '0');
export const mesActual = `${year}${currentMonthPadded}`;

export const initialStateFilters: PrevisionFiltersAuxiliar = {
  periodo: yyyyMM,
  corresponsal: '',
  divisa: '',
  estado: '',
};

export const verificarFiltroPrevision = (
  filtroPrevisiones: PrevisionFiltersAuxiliar
) : boolean => {
  return (
    isEmpty(filtroPrevisiones.periodo)
  );
};

export const prepareFilter = (
  filtroPrevision: PrevisionFiltersAuxiliar,
  setPrevisionesList: React.Dispatch<React.SetStateAction<PrevisionResponse[]>>,
  setLoading: (value: React.SetStateAction<boolean>) => void,
  setPeriodo: React.Dispatch<React.SetStateAction<string>>
) => {
  const auxFiltro = {...filtroPrevision};
  auxFiltro.periodo = auxFiltro.periodo ? formatDateYYYYMM(auxFiltro.periodo) : null;
  if (!verificarFiltroPrevision(auxFiltro)){
    const objetoFilterPrevision: FilterPrevisiones = {
      previsionesByFilterDto: {
        periodo: auxFiltro.periodo, 
        corresponsal: filtroPrevision.corresponsal ? filtroPrevision.corresponsal : null,
        divisa: filtroPrevision.divisa ? filtroPrevision.divisa : null,
        estado: filtroPrevision.estado ? filtroPrevision.estado : null
      }
    };
  
    if (objetoFilterPrevision.previsionesByFilterDto.periodo) {
      getPrevisionesByFilter(objetoFilterPrevision)
        .then((result: PrevisionResponse[]) => {
          let filteredResult = result;
  
          if (filtroPrevision.estado === 1) {
            filteredResult = result.filter(
              (item) => item.nombreEstado === 'Alta'
            );
          } else if (filtroPrevision.estado === 3) {
            filteredResult = result.filter(
              (item) => item.nombreEstado === 'Aprobado'
            );
          } else if (filtroPrevision.estado === 0) {
            // Hardcoded 'Nueva' state filtering
            filteredResult = result.filter(
              (item) => item.nombreEstado === 'Nueva'
            );
          }
  
          setPrevisionesList(filteredResult);
          setPeriodo(
            formatDateYYYYMM(objetoFilterPrevision.previsionesByFilterDto.periodo)
          );
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  } else {
    setLoading(false);
    toastCallAux('No se puede buscar sin un periodo', false);
  }
};

export const guardarPrevision = (
  prevision: PrevisionPost,
  setLoading: (value: React.SetStateAction<boolean>) => void,
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
) => {
  postPrevision(prevision)
  .then((result: any) => {
    setLoading(false);
    if (result.hasErrors) {
      toastCallAux('Error al guardar', false)
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

export const realizarAprobacion = (
  id: number,
  dataUser: UserFirmante,
  setLoading:(value: React.SetStateAction<boolean>) => void,
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
) => {
  aprobarPrevision(id, dataUser)
  .then((result: any) => {
    setLoading(false);
    if (result === 'true') {
      toastCallAux('Prevision aprobada', true);
      setRefresh(true);
    } else {
      toastCallAux('Error al aprobar', false)
    }
  })
  .catch(() => {
    setLoading(false);
    toastCallAux('Error al aprobar', false);
  })
};

export const verificarPeriodo = (
  value: string | Date,
  field: string,
  setFiltroPrevisiones: React.Dispatch<React.SetStateAction<PrevisionFiltersAuxiliar>>,
  filtroPrevisiones: PrevisionFiltersAuxiliar
) => {
  let currentDate = new Date();
  
  // caso de ser mayor al mes actual se setea el mes actual
  if (value > currentDate) {
    setFiltroPrevisiones(() => ({...filtroPrevisiones, [field]: yyyyMM}))
    return
  } else {
    setFiltroPrevisiones(() => ({ ...filtroPrevisiones, [field]: value }));
  }
};

export const estadosPrevisiones = [
  {
    text: 'Alta',
    value: 1
  },
  {
    text: 'Aprobado',
    value: 3
  },
  {
    text: 'Nueva',
    value: 0
  },
];

export const buildEstadosPrevisionesList = (
  estado: any | undefined
): ItemDropdown[] => {
  const auxEstado: ItemDropdown[] = [];
  if(estado) {
      estado.forEach(p => {
        auxEstado.push({text: `${p.text}`, value: p.value})
      })
      return auxEstado
  }
  return []
};

export const buildEstadosPrevisionesInitialValueFilter = (
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