import { GastosRebatesChecksAprobarRechazar, RowGastoCalendarizado } from './../types/GastosRebates/GastosRebates.types';
import { toastCallAux } from '@components/Toast/Toast.helpers';
import {
  aprobarGastoRebate,
  avanzarCalendarizada,
  getGastosRebatesByFilter,
  rechazarGastoRebate,
  saveGastoRebate,
} from '@lib/services/GastosRebates/GastosRebates.services';
import {
  AprobarGastoRebateBody,
  AvanzarCalendaridazadaFilterAuxiliar,
  AvanzarCalendarizadaBody,
  FilterGastosRebates,
  GastoRebateResponse,
  GastosRebatesFilterAuxiliar,
  GastosRebatesFilterModalAuxiliar,
  SaveGastoRebateBody,
} from '@lib/types/GastosRebates/GastosRebates.types';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';
import { formatDateYYYYMM } from '@lib/utils/Date';

const fecha = new Date();
const day = String(fecha.getDate()).padStart(2, '0');
const month = String(fecha.getMonth() + 1).padStart(2, '0');
const year = fecha.getFullYear();
export const fechaActual = `${day}/${month}/${year}`;

export const initialStateFilters: GastosRebatesFilterAuxiliar = {
  periodo: '',
  idTipoAnalitico: '',
  idCorresponsal: '',
  idEstado: '',
  fechaUltimaModificacion: '',
  fechaCalendarizada: '',
  referenciaExterna: '',
};

export const initialStateFiltersModal: GastosRebatesFilterModalAuxiliar = {
  tipo: '',
  corresponsalDivisa: '',
  referenciaExterna: '',
  importe: '',
  nroLiquidacion: '',
  nroBoleto: '',
  cotizacionBoleto: '',
  periodo: '',
  legajoCreacion: '',
};

export const initialStateFiltersAvanzar: AvanzarCalendaridazadaFilterAuxiliar = {
  nroBoleto: '',
  cotizacion: '',
  grupo: '',
};

export const buildTipoAnaliticoGastosRebatesInitialValueFilter = (
  e: any | undefined
): ItemDropdown => {
  if (e) {
    return {
      value: e.value,
      text: e.text,
    };
  } else {
    return {
      value: '',
      text: '',
    };
  }
};

export const estadosGastosRebates = [
  {
    text: 'Alta',
    value: 1,
  },
  {
    text: 'Aprobado',
    value: 3,
  },
  {
    text: 'Rechazado',
    value: 5,
  },
  {
    text: 'Calendarizado',
    value: 10,
  },
];

export const buildEstadosGastosRebatesList = (
  estado: any | undefined
): ItemDropdown[] => {
  const auxEstado: ItemDropdown[] = [];
  if (estado) {
    estado.forEach(p => {
      auxEstado.push({ text: p.text, value: p.value });
    });
    return auxEstado;
  }
  return [];
};

export const buildEstadosGastosRebatesInitialValueFilter = (
  e: any | undefined
): ItemDropdown => {
  if (e) {
    return {
      value: e.value,
      text: e.text,
    };
  } else {
    return {
      value: '',
      text: '',
    };
  }
};

export const prepareFilter = (
  filtroGastosRebates: GastosRebatesFilterAuxiliar,
  setGastosRebatesList: React.Dispatch<any>,
  setLoading: (value: React.SetStateAction<boolean>) => void,
  corresponsalDivisaMemo: ItemDropdown[]
) => {
  const filtro: FilterGastosRebates = {
    gastosRebatesByFilterDto: {
      periodo: filtroGastosRebates.periodo
        ? formatDateYYYYMM(filtroGastosRebates.periodo)
        : null,
      idCorresponsal: filtroGastosRebates.idCorresponsal
        ? filtroGastosRebates.idCorresponsal
        : null,
      idTipoAnalitico: filtroGastosRebates.idTipoAnalitico
        ? filtroGastosRebates.idTipoAnalitico
        : null,
      idEstado: filtroGastosRebates.idEstado
        ? filtroGastosRebates.idEstado
        : null,
      divisa: filtroGastosRebates.idCorresponsal
        ? obtenerDivisaCorresponsal(
            corresponsalDivisaMemo,
            filtroGastosRebates.idCorresponsal
          )
        : null,
    },
  };
  getGastosRebatesByFilter(filtro)
    .then((result: GastoRebateResponse[]) => {
      setGastosRebatesList(result);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

function casoUno(
  rows: any,
  setGastosRebatesChecks: React.Dispatch<React.SetStateAction<GastosRebatesChecksAprobarRechazar[]>>,
  idsGastosRebates: any[]
): void {
  if (Array.isArray(rows.row)) {
    rows.row.forEach(row => {
      idsGastosRebates.push({
        id: row.idAnalitico,
        idTipoAnalitico: row.idTipoAnalitico,
        estado: row.estado,
      });
    });
  }
  setGastosRebatesChecks(idsGastosRebates);
}

function casoCuatro(
  rows: any,
  setGastosRebatesChecks: React.Dispatch<React.SetStateAction<GastosRebatesChecksAprobarRechazar[]>>,
  gastosRebatesChecks: GastosRebatesChecksAprobarRechazar[],
): void {
  if (!Array.isArray(rows.row)) {
    const idEliminado = rows.row.idAnalitico;
    setGastosRebatesChecks(gastosRebatesChecks.filter(x => x.id !== idEliminado));
  }
}

export const generarParametrosURL = (filtro: any): string => {
  const queryParams = [];
  if (filtro.idCorresponsal !== null) {
    queryParams.push(`idCorresponsal=${encodeURIComponent(filtro.idCorresponsal)}`);
  }
  if (filtro.divisa !== null) {
    queryParams.push(`divisa=${encodeURIComponent(filtro.divisa)}`);
  }
  if (filtro.periodo !== null) {
    queryParams.push(`periodo=${encodeURIComponent(filtro.periodo)}`);
  }
  if (filtro.idEstado !== null) {
    queryParams.push(`idEstado=${encodeURIComponent(filtro.idEstado)}`);
  }
  if (filtro.idTipoAnalitico !== null) { 
    queryParams.push(`idTipoAnalitico=${encodeURIComponent(filtro.idTipoAnalitico)}`);
  }
  return queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
};

export const actualizarFilasCheckeadas = (
  rows: any,
  setGastosRebatesChecks: React.Dispatch<React.SetStateAction<GastosRebatesChecksAprobarRechazar[]>>,
  gastosRebatesChecks: GastosRebatesChecksAprobarRechazar[],
) => {
  const idsGastosRebates = [];
  if (rows.checked === true) {
    if (rows.rowIndex === 'all') {
      // caso 1
      casoUno(rows, setGastosRebatesChecks, idsGastosRebates);
    } else {
      // caso 3
      if (!Array.isArray(rows.row)) {
        // se agrega individual
        idsGastosRebates.push({
          id: rows.row.idAnalitico,
          idTipoAnalitico: rows.row.idTipoAnalitico,
          estado: rows.row.estado
        });
      }
      setGastosRebatesChecks(current => [...current, ...idsGastosRebates]);
    }
  } else {
    if (rows.rowIndex === 'all') {
      setGastosRebatesChecks([]);
    } else {
      casoCuatro(rows, setGastosRebatesChecks, gastosRebatesChecks);
    }
  }
};

export const guardarGastoRebate = (
  gastoRebate: GastosRebatesFilterModalAuxiliar,
  setLoading: (value: React.SetStateAction<boolean>) => void,
  corresponsalDivisaMemo: ItemDropdown[],
  tiposAnaliticoGastoRebateMemo: ItemDropdown[],
  closeModal: () => void,
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>,
  legajoCreacion: string,
) => {
  let body: SaveGastoRebateBody = {
    idTipoAnalitico: gastoRebate.tipo || null,
    idCorresponsal: gastoRebate.corresponsalDivisa || null,
    divisa: gastoRebate.corresponsalDivisa
      ? obtenerDivisaCorresponsal(
          corresponsalDivisaMemo,
          Number(gastoRebate.corresponsalDivisa)
        )
      : null,
    importe: gastoRebate.importe ? Number(gastoRebate.importe) : null,
    periodo: gastoRebate.periodo ? formatDateYYYYMM(gastoRebate.periodo) : null,
    referencia: gastoRebate.referenciaExterna || null,
    legajoCreacion: legajoCreacion || null,
  };

  const tipoAnaliticoValido = verificarTipoAnalitico(
    tiposAnaliticoGastoRebateMemo,
    gastoRebate.tipo
  );

  if (tipoAnaliticoValido) { // en caso que sea un Rebate se agrega nroBolet y cotizacion
    body = {
      ...body,
      nroBoleto: gastoRebate.nroBoleto || null,
      cotizacion: gastoRebate.cotizacionBoleto ? Number(gastoRebate.cotizacionBoleto.replace(',', '.')) : null,
    };
  }

  if (validarCamposNulos(body)) {
    toastCallAux('No se puede enviar campos vacíos', false);
    setLoading(false);
  } else {
    saveGastoRebate(body)
      .then((result: any) => {
        setLoading(false)
        if (result.hasErrors) {
          toastCallAux('Error al guardar', false);
        } else {
          closeModal();
          toastCallAux('Guardado correctamente', true);
          setRefresh(true);
        }
      })
      .catch(() => {
        setLoading(false);
        toastCallAux('Error al guardar', false);
      });
  }
};

function validarCamposNulos(objeto: any): boolean {
  return Object.values(objeto).some((value) => value === null || value === undefined);
};

function obtenerDivisaCorresponsal(
  corresponsalDivisaMemo: ItemDropdown[],
  corresponsalDivisaElegida: number | string
): string {
  const corresponsalEncontrado = corresponsalDivisaMemo.find(
    corresponsal => corresponsal.value === corresponsalDivisaElegida
  );

  return corresponsalEncontrado.nombre;
};

function verificarTipoAnalitico(
  tiposAnaliticoGastoRebateMemo: ItemDropdown[],
  tipoAnaliticoElegido: number | string
): boolean {
  const tipoEncontrado = tiposAnaliticoGastoRebateMemo.find(
    tipo => tipo.value === tipoAnaliticoElegido
  );

  if (
    tipoEncontrado &&
    tipoEncontrado.text === 'Rebates'
  ) {
    return true;
  }

  return false;
};

export const verificarRowParaCalendarizar = (
  rows: any,
  setGastoParaCalendarizar: React.Dispatch<React.SetStateAction<RowGastoCalendarizado[]>>,
  gastoCalendarizado: RowGastoCalendarizado[],
  setEsFechaValida: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!Array.isArray(rows.row)) {
    if(rows.checked === true) {
      const auxiliarAvanzar = gastoCalendarizado;
      auxiliarAvanzar.push(rows.row);
      setGastoParaCalendarizar(auxiliarAvanzar);
      setEsFechaValida(false);
    } else {
      // eliminar del array
      const idEliminado = rows.row.idAnalitico;
      setGastoParaCalendarizar(gastoCalendarizado.filter(x => x.idAnalitico !== idEliminado));
      setEsFechaValida(false);
    }
  } else {
    setGastoParaCalendarizar([]);
    setEsFechaValida(false);
  }
  if (gastoCalendarizado.length > 0) {
    if (gastoCalendarizado.length === 1) {
      setEsFechaValida(true);
    } else {
      setEsFechaValida(false);
    }
  } 
};

export const prepararAvanzarCalendarizada = (
  idAnalitico: string | number,
  gastoCalendarizado: AvanzarCalendaridazadaFilterAuxiliar,
  setLoading: (value: React.SetStateAction<boolean>) => void,
  closeModal: () => void,
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>,
  grupo: string,
  setGastoParaCalendarizar: React.Dispatch<React.SetStateAction<RowGastoCalendarizado[]>>
) => {
  const body: AvanzarCalendarizadaBody = {
    ...gastoCalendarizado,
    cotizacion: gastoCalendarizado.cotizacion ? Number(gastoCalendarizado.cotizacion.replace(',', '.')) : null,
    grupo: grupo || null,
    idAnalitico: idAnalitico || null
  };
  
  if (validarCamposNulos(body)){
    toastCallAux('No se puede enviar campos vacíos', false);
    setLoading(false);
  }
  avanzarCalendarizada(body)
    .then((result: any) => {
      setLoading(false);
      if (result.hasErrors || !result.success) {
        toastCallAux('Error al avanzar calendarizada', false)
      } else {
        toastCallAux('Se avanzo correctamente', true);
        setLoading(false);
        closeModal();
        setRefresh(true);
        setGastoParaCalendarizar([]);
      }
    })
    .catch(() => {
      setLoading(false);
      toastCallAux('Error al avanzar', false);
    });
};

export const prepararParaAprobarGastoRebate = (
  gastoRebate: GastosRebatesChecksAprobarRechazar[],
  setLoading: (value: React.SetStateAction<boolean>) => void,
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>,
  legajoAprobacion: string,
  grupo: string,
  setGastosRebatesChecks: React.Dispatch<React.SetStateAction<GastosRebatesChecksAprobarRechazar[]>>,
) => {
  const totalItems = gastoRebate.length;
  let successfulOperations = 0;
  
  if (totalItems === 1) {
    const body: AprobarGastoRebateBody = {
      idTipoAnalitico: gastoRebate[0].idTipoAnalitico,
      grupo: grupo,
      legajoAprobacion: legajoAprobacion,
    };
    if (gastoRebate[0].estado === 'Calendarizado') {
      toastCallAux('No se puede aprobar en estado Calendarizado', false);
      setLoading(false);
    } else {

      aprobarGastoRebate(gastoRebate[0].id, body)
      .then((result: any) => {
        setLoading(false);
        if (result.hasErrors || !result.success) {
          toastCallAux('Error al aprobar', false)
        } else {
          toastCallAux('Se aprobó correctamente', true);
          setRefresh(true);
          setGastosRebatesChecks([]);
        }
      })
      .catch(() => {
        toastCallAux('Error al aprobar', false);
        setLoading(false);
      });
    }
  } else if (totalItems > 1) {
    gastoRebate.forEach((e) => {
      const body: AprobarGastoRebateBody = {
        idTipoAnalitico: e.idTipoAnalitico,
        grupo: grupo,
        legajoAprobacion: legajoAprobacion,
      };
      if ( e.estado === 'Calendarizado') {
        toastCallAux('No se puede aprobar en estado Calendarizado', false);
        successfulOperations++;
        if (successfulOperations === totalItems) {
          setLoading(false);
          setRefresh(true);
          setGastosRebatesChecks([]);
        }
      } else {
        setLoading(true);
        aprobarGastoRebate(e.id, body)
        .then((result: any) => {
          if (result.hasErrors || !result.success)  {
            toastCallAux('Error al aprobar', false)
          } else {
            toastCallAux('Se aprobó correctamente', true);
          }
          successfulOperations++;
          if (successfulOperations === totalItems) {
            setLoading(false);
            setRefresh(true);
            setGastosRebatesChecks([]);
          }
        })
        .catch(() => {
          toastCallAux('Error al aprobar', false);
          setLoading(false);
        });
      }
      });
    }
};

export const prepararParaRechazarGastoRebate = (
  gastoRebate: GastosRebatesChecksAprobarRechazar[],
  setLoading: (value: React.SetStateAction<boolean>) => void,
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const totalItems = gastoRebate.length;
  let successfulOperations = 0;

  if (totalItems === 1) {
    const body = {
      idTipoAnalitico: gastoRebate[0].idTipoAnalitico,
    };

    rechazarGastoRebate(gastoRebate[0].id, body)
      .then((result: any) => {
        setLoading(false);
        if (result.hasErrors || !result.success)  {
          toastCallAux('Error al rechazar', false)
        } else {
          toastCallAux('Se rechazó correctamente', true);
          setRefresh(true);
        }
      })
      .catch(() => {
        toastCallAux('Error al rechazar', false);
        setLoading(false);
      });
  } else if (totalItems > 1) {
    gastoRebate.forEach((e) => {
      const body = {
        idTipoAnalitico: e.idTipoAnalitico,
      };

      setLoading(true);
      rechazarGastoRebate(e.id, body)
        .then((result: any) => {
          if (result.hasErrors || !result.success)  {
            toastCallAux('Error al rechazar', false)
          } else {
            toastCallAux('Se rechazó correctamente', true);
          }
          successfulOperations++;
            
          if (successfulOperations === totalItems) {
            setLoading(false);
            setRefresh(true);
          }
        })
        .catch(() => {
          toastCallAux('Error al rechazar', false);
          setLoading(false);
        });
    });
  }
};