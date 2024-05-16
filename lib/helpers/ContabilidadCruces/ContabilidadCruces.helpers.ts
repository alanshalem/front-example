import { ContabilidadCrucesAuxiliar } from '@components/ContabilidadDeCruces/ContabilidadCrucesPage';
import {
  firmarContabilidades,
  getContabilidadCrucesByFilter,
} from '@lib/services/ContabilidadCruces/ContabilidadCruces.services';
import {
  ContabilidadCruces,
  ContabilidadRows,
  ContabilidadesAFirmar,
  ContabilidadesTableResponse,
  FilterContabilidadCruces,
} from '@lib/types/ContabilidadCruces/ContabilidadCruces.types';
import { Estado, FuncionalidadEstados } from '@lib/types/Estados/Estados.types';
import { FuncionalidadAccion } from '@lib/types/SourceSystem';
import { formatDateUS } from '@lib/utils/Date';
import toast from 'react-hot-toast';
import {
  acciones,
  funcionalidades,
} from '../../../config/ConfigurationService';
import { tienePermisos } from '../Auth.helpers';
import { getEstadosFuncionalidad } from '../Estados.helpers';
import { getExportContabilidad } from '../Export.helpers';
import { isEmpty } from '../helpers';

export const getAllContabilidadesCruces = (
  setContabilidadCrucesList: (
    value: React.SetStateAction<ContabilidadCruces[]>
  ) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void
) => {
  const filtroContabilidadCrucesObj: FilterContabilidadCruces = {
    contabilidadByFilterDTO: {
      analiticoId: null,
      divisa: null,
      monto: null,
      idEstado: null,
      fechaCreacion: formatDateUS(new Date()),
    },
  };
  getContabilidadCrucesByFilter(filtroContabilidadCrucesObj)
    .then((result: any) => {
      setContabilidadCrucesList(result);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

//devuelve true si todos los campos del filtro estan vacios
export const verificarFiltroContabilidadCruces = (
  filtroCruce: ContabilidadCrucesAuxiliar
): boolean => {
  return (
    isEmpty(filtroCruce.analiticoId) &&
    isEmpty(filtroCruce.fechaCreacion) &&
    isEmpty(filtroCruce.divisa) &&
    isEmpty(filtroCruce.monto) &&
    isEmpty(filtroCruce.estado)
  );
};

export const prepareFilter = (
  filtroCruce: ContabilidadCrucesAuxiliar,
  setContabilidadCrucesList: (
    value: React.SetStateAction<ContabilidadCruces[]>
  ) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void
) => {
  // preparo el filtro
  const filtroContabilidadCruceObj: FilterContabilidadCruces = {
    contabilidadByFilterDTO: {
      analiticoId: filtroCruce.analiticoId ? filtroCruce.analiticoId : null,
      fechaCreacion: filtroCruce.fechaCreacion
        ? filtroCruce.fechaCreacion
        : null,
      divisa: filtroCruce.divisa ? filtroCruce.divisa : null,
      monto: filtroCruce.monto
        ? parseFloat(
            filtroCruce.monto.replace(/[.,]/g, match => {
              return match === '.' ? '' : '.';
            })
          )
        : null,
      idEstado: filtroCruce.estado ? Number(filtroCruce.estado) : null,
    },
  };
  getContabilidadCrucesByFilter(filtroContabilidadCruceObj)
    .then((result: any) => {
      setContabilidadCrucesList(result);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

export const checkContabilidadesListVacia = (
  contabilidades: ContabilidadesTableResponse[],
  permisos: FuncionalidadAccion[],
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  tienePermisos(funcionalidades.contabilidad, acciones.export, permisos, () =>
    getExportContabilidad(setLoading, contabilidades)
  );
};

function casoUno(
  rows: ContabilidadRows,
  setContabilidadesFirmadas: (value: React.SetStateAction<string[]>) => void,
  idsContabilidades: string[]
): void {
  if (Array.isArray(rows.row)) {
    rows.row.forEach(row => {
      idsContabilidades.push(row.nroOperacion);
    });
  }
  setContabilidadesFirmadas(idsContabilidades);
}

function casoCuatro(
  rows: ContabilidadRows,
  setContabilidadesFirmadas: (value: React.SetStateAction<string[]>) => void,
  contabilidadesFirmadas: string[]
): void {
  if (!Array.isArray(rows.row)) {
    const idEliminado = rows.row.nroOperacion;
    setContabilidadesFirmadas(
      contabilidadesFirmadas.filter(cont => cont !== idEliminado)
    );
  }
}

export function actualizarFilasCheckeadas(
  rows: ContabilidadRows,
  setContabilidadesFirmadas: (value: React.SetStateAction<string[]>) => void,
  contabilidadesFirmadas: string[]
) {
  const idsContabilidades: string[] = [];

  //CASO 1 - TODAS FIRMADAS
  if (rows.checked === true) {
    if (rows.rowIndex === 'all') {
      casoUno(rows, setContabilidadesFirmadas, idsContabilidades);
    } else {
      //CASO 3
      if (!Array.isArray(rows.row)) {
        idsContabilidades.push(rows.row.nroOperacion);
      }
      setContabilidadesFirmadas(current => [...current, ...idsContabilidades]);
    }
  } else {
    //CASO 2 - NINGUNA FIRMADA
    if (rows.rowIndex === 'all') {
      setContabilidadesFirmadas([]);
    } else {
      //CASO 4 - ALGUNAS FIRMADAS?
      casoCuatro(rows, setContabilidadesFirmadas, contabilidadesFirmadas);
    }
  }
}

export const prepareFirmaDeContabilidades = (
  idContabilidad: string[],
  legajoFirma: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  refreshTable: () => void
) => {
  setLoading(true);
  const contabilidadRequestDTO: ContabilidadesAFirmar = {
    contabilidadesAFirmarDTO: {
      idContabilidad,
      legajoFirma,
    },
  };
  firmarContabilidades(contabilidadRequestDTO)
    .then((result: any) => {
      if (result.data.statusCode === 400 || result.data.statusCode === 500) {
        toast.error(result.data.desc);
      } else {
        toast.success('Contabilidades aprobadas correctamente.');
      }
    })
    .catch(() => {
      setLoading(false);
    })
    .finally(() => {
      setLoading(false);
      refreshTable();
    });
};

export function getEstado(
  nombreFuncionalidad: string,
  descripcionEstado: string,
  funcionalidadesList: FuncionalidadEstados[]
): number {
  const estados: Estado[] = getEstadosFuncionalidad(
    funcionalidadesList,
    nombreFuncionalidad
  );
  //devuelvo el id del estado Pendiente
  return estados.find(
    (estado: Estado) =>
      estado.nombreEstado.toLowerCase() === descripcionEstado.toLowerCase()
  ).idEstado;
}
