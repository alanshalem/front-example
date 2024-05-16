/* eslint-disable react-hooks/exhaustive-deps */
import { toastCallAux } from '@components/Toast/Toast.helpers';
import {
  aprobarPosventas,
  downloadPosventaTableByFilter,
  getByIdPosVentaTipo,
  getByNroOperacionSecuenciaIdPosVentaTipo,
  getPosventaByFilter,
  guardarPosventa,
  rechazarPosventas,
} from '@lib/services/Posventa/Posventa.services';
import { Estado, FuncionalidadEstados } from '@lib/types/Estados/Estados.types';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';
import {
  ConceptoTipo,
  PosventaAuxiliar,
  PosventaRows,
  PosventaTableItem,
  PosventaTipo,
  PosventasAAprobar,
  PosventasARechazar,
} from '@lib/types/Posventa/Posventa.types';
import { getEstadosFuncionalidad } from './Estados.helpers';
import { isEmpty } from './helpers';
import { getMonthName, transformarFecha } from '@lib/utils/Date';

export const mensajeErrorNroOperacion =
  'Introduzca un número de operación con el formato correcto.';

export const formatNumber = (value: number): string => {
  const numberParts = value.toFixed(2).split('.');
  const integerPart = parseInt(numberParts[0]);
  const decimalPart = numberParts[1];

  const formattedIntegerPart = integerPart.toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formattedDecimalPart = decimalPart || '00';

  return `${formattedIntegerPart},${formattedDecimalPart}`;
};

export const handleSearchNroOperacionSecuenciaIdPosVentaTipo = async nuevaPosventaAuxiliar => {
  const { nroOperacion, secuencia, idPosVentaTipo } = nuevaPosventaAuxiliar;

  try {
    const response = await getByNroOperacionSecuenciaIdPosVentaTipo(
      nroOperacion,
      secuencia,
      idPosVentaTipo
    );
    return response;
  } catch (error) {
    throw Error(error);
  }
};

export const transformarFormato = fechaDate => {
  let parsedFecha;
  // 23/03/2023
  let fecha = transformarFecha(fechaDate);
  // Verificar si la fecha es de tipo objeto (por ejemplo, un objeto Date)
  if (
    typeof fecha === 'object' &&
    fecha instanceof Date &&
    !isNaN(fecha.getTime())
  ) {
    parsedFecha = fecha;
  } else if (typeof fecha === 'string') {
    // Intentar parsear la fecha en formato de cadena
    parsedFecha = new Date(fecha);

    // Verificar si el parseo fue exitoso y la fecha es válida
    if (isNaN(parsedFecha.getTime())) {
      console.error('ERROR: Fecha no válida');
      return null; // Manejar el error y devolver un valor apropiado
    }
  } else {
    console.error('ERROR: Tipo de fecha no admitido');
    return null; // Manejar el error si el tipo de fecha no es compatible
  }

  // Formatear la fecha parseada como cadena en formato ISO
  const nuevaFechaISO = parsedFecha.toISOString();

  return nuevaFechaISO;
};

export const getAllPosventaTable = (
  setPosventaTable: (value: React.SetStateAction<PosventaTableItem[]>) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void,
  posventaFilters: {} = {}
  // setLoading: (value: React.SetStateAction<boolean>) => void
) => {
  const posVentaByFilterDTO: any = {
    posVentaByFilterDTO: posventaFilters,
  };
  getPosventaByFilter(posVentaByFilterDTO)
    .then((result: any) => {
      setPosventaTable(result);
      setLoading(false);
    })
    .catch(() => {
      setPosventaTable([]);
      setLoading(false);
    });
};

export const prepareFilterPosventa = (
  filtroPosventa: PosventaAuxiliar,
  setPosventaTable: (value: React.SetStateAction<PosventaTableItem[]>) => void,
  setLoading: any
) => {
  const posventaFilter: any = {
    fechaCreacion: filtroPosventa.fechaCreacion
      ? transformarFormato(filtroPosventa.fechaCreacion)
      : null,
    nroOperacion: filtroPosventa.nroOperacion
      ? filtroPosventa.nroOperacion
      : null,
    razonSocial: filtroPosventa.razonSocial ? filtroPosventa.razonSocial : null,

    idEstado: Number(filtroPosventa.estado)
      ? Number(filtroPosventa.estado)
      : null,
    divisa: filtroPosventa.divisa ? filtroPosventa.divisa : null,
    concepto: filtroPosventa.concepto ? filtroPosventa.concepto : null,
    cuit: filtroPosventa.cuit ? filtroPosventa.cuit : null,
  };

  getAllPosventaTable(setPosventaTable, setLoading, posventaFilter);
};

function arrayToCSV(data) {
  const csvContent = data.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const date = new Date();

  const fileName = `posventas_${date.getDate()}-${getMonthName(
    date.getMonth()
  )}-${date.getFullYear()}_${date.getHours()}.${(date.getMinutes() < 10
    ? '0'
    : '') + date.getMinutes()}.csv`;
  // Crea un enlace para descargar el archivo
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const downloadPosventaTable = (
  filtroPosventa: PosventaAuxiliar,
  setLoading: any
) => {
  const posventaFilter: any = {
    fechaCreacion: filtroPosventa.fechaCreacion
      ? transformarFormato(filtroPosventa.fechaCreacion)
      : null,
    nroOperacion: filtroPosventa.nroOperacion
      ? filtroPosventa.nroOperacion
      : null,
    razonSocial: filtroPosventa.razonSocial ? filtroPosventa.razonSocial : null,
    idEstado: Number(filtroPosventa.estado)
      ? Number(filtroPosventa.estado)
      : null,
    divisa: filtroPosventa.divisa ? filtroPosventa.divisa : null,
    concepto: filtroPosventa.concepto ? filtroPosventa.concepto : null,
    cuit: filtroPosventa.cuit ? filtroPosventa.cuit : null,
  };

  const posVentaByFilterDTO: any = {
    posVentaByFilterDTO: posventaFilter,
  };

  downloadPosventaTableByFilter(posVentaByFilterDTO)
    .then((result: any) => {
      arrayToCSV(result);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

function casoUno(
  rows: PosventaRows,
  setPosventasAprobadas: (value: React.SetStateAction<number[]>) => void,
  idsPosventas: number[]
): void {
  if (Array.isArray(rows.row)) {
    rows.row.forEach(row => {
      idsPosventas.push(row.idPosVentaDetalle);
    });

    setPosventasAprobadas(idsPosventas);
  }
}

function casoCuatro(
  rows: PosventaRows,
  setPosventasAprobadas: (value: React.SetStateAction<number[]>) => void,
  posventasAprobadas: number[]
): void {
  if (!Array.isArray(rows.row)) {
    const idEliminado = Number(rows.row.idPosVentaDetalle);
    setPosventasAprobadas(
      posventasAprobadas.filter(post => post !== idEliminado)
    );
  }
}

export function actualizarFilasCheckeadasPosventa(
  rows: any,
  setPosventasActualizadas: (value: React.SetStateAction<number[]>) => void,
  posventasActualizadas: number[]
) {
  const idsPosventas: number[] = [];

  //CASO 1 - TODAS FIRMADAS
  if (rows.checked === true) {
    if (rows.rowIndex === 'all') {
      casoUno(rows, setPosventasActualizadas, idsPosventas);
    } else {
      //CASO 3
      if (!Array.isArray(rows.row)) {
        idsPosventas.push(rows.row.idPosVentaDetalle);
      }
      setPosventasActualizadas(current => [...current, ...idsPosventas]);
    }
  } else {
    //CASO 2 - NINGUNA FIRMADA
    if (rows.rowIndex === 'all') {
      setPosventasActualizadas([]);
    } else {
      //CASO 4 - ALGUNAS FIRMADAS?
      casoCuatro(rows, setPosventasActualizadas, posventasActualizadas);
    }
  }
}

export async function handleGuardarPosventa(
  dataCliente: any,
  dataClientePosVentaDetalle: any,
  impuestosADevolver: any[],
  legajo: string,
  idPosVentaTipo: number,
  secuencia: string,
  setLoading: (value) => void,
  closeToggle: () => void,
  handleBuscar: () => void,
) {
  let copyDataCliente = dataCliente;

  copyDataCliente.posVentaDetalle = dataClientePosVentaDetalle.map(concepto => {
    const { esCobro, esDevolucion, montoCobrado, ...rest } = concepto;
    return rest;
  });

  let posVentaDetallesLess = copyDataCliente;
  delete posVentaDetallesLess.posVentaDetalle;
  delete posVentaDetallesLess.status;
  
  const impuestosADevolverFiltrados = impuestosADevolver?.filter(impuesto => 
    impuesto.montoACobrar !== 0 || impuesto.montoADevolver !== '' &&
    impuesto.montoACobrar !== '' || impuesto.montoADevolver !== 0
  ).map(({ index, ...rest }) => rest);
  
 const posVentaGuardarDTO = {
    ...posVentaDetallesLess,
    legajoCreacion: legajo,
    idPosVentaTipo,
    secuencia,
    posVentaDetalle: impuestosADevolverFiltrados,
  };
  
  setLoading(true);
  await guardarPosventa(posVentaGuardarDTO)
    .then(res => {
      setLoading(false);
      if (res.hasErrors) {
        toastCallAux(res.desc, false);
      } else {
        toastCallAux(res.desc, true);
        closeToggle();
        handleBuscar();
      }
    })
    .catch(() => {
      setLoading(false);
      toastCallAux('Hubo un error', false);
      closeToggle();
    })
}

//devuelve true si todos los campos del filtro estan vacios
export const verificarFiltro = (filtroPosventa: PosventaAuxiliar): boolean => {
  return (
    isEmpty(filtroPosventa.concepto) &&
    isEmpty(filtroPosventa.cuit) &&
    isEmpty(filtroPosventa.divisa) &&
    isEmpty(filtroPosventa.estado) &&
    isEmpty(filtroPosventa.fechaCreacion.toString()) &&
    isEmpty(filtroPosventa.nroOperacion) &&
    isEmpty(filtroPosventa.razonSocial)
  );
};

export const cleanFilter = (
  event: any,
  setFiltroPosventa: (value: React.SetStateAction<PosventaAuxiliar>) => void,
  initialState: PosventaAuxiliar
) => {
  event.preventDefault();
  setFiltroPosventa(initialState);
};

export const prepareActualizacionDePosventas = (
  idPosVentaDetalle: number[],
  condicion: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  refreshTable: () => void,
  legajoUltimaModificacion: string,
  grupo?: string
) => {
  setLoading(true);

  const legajoAprobacion = legajoUltimaModificacion;

  const posventaApproveRequestDTO: PosventasAAprobar = {
    posVentaApprove: {
      idPosVentaDetalle,
      legajoAprobacion,
      grupo,
    },
  };

  const posventaRejectRequestDTO: PosventasARechazar = {
    posVentaReject: {
      idPosVentaDetalle,
      legajoUltimaModificacion,
    },
  };

  if (condicion === 'aprobar') {
    aprobarPosventas(posventaApproveRequestDTO)
      .then((res: any) => {
        if (res.data.status.hasErrors === true) {
          refreshTable();
          toastCallAux(res.data.status.desc, false);
          setLoading(false);
          return;
        }
        refreshTable();
        setLoading(false);
        toastCallAux('Posventas aprobadas correctamente.', true);
      })
      .catch(() => {
        setLoading(false);
      });
  } else if (condicion === 'rechazar') {
    rechazarPosventas(posventaRejectRequestDTO)
      .then(() => {
        setLoading(false);
        toastCallAux('Posventas rechazadas correctamente.', true);
        refreshTable();
      })
      .catch(() => {
        setLoading(false);
      });
  }
};

export const getConceptosByIdPosVentaTipo = (
  nroOperacion: string,
  idAplicacion: string | number,
  idPosVentaTipo: string | number,
  esGenerico: boolean,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setConceptos: (value: React.SetStateAction<any>) => void,
  setRawConceptos?: (value: React.SetStateAction<any>) => void
) => {
  setLoading(true);
  getByIdPosVentaTipo(nroOperacion, idAplicacion, idPosVentaTipo, esGenerico)
    .then((res: any) => {
      if (setRawConceptos) {
        setRawConceptos(res);
      }
      setConceptos(buildConceptosInitialValueList(res));
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
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

  //devuelvo el id del estado a buscar -> Ej: Alta = Alta -> 1
  return estados.find(
    (estado: Estado) =>
      estado.nombreEstado.toLowerCase() === descripcionEstado.toLowerCase()
  ).idEstado;
}

export const buildEstadosListPosventa = (
  estados: Estado[] | undefined
): ItemDropdown[] => {
  const auxEstado: ItemDropdown[] = [];
  if (estados) {
    estados.forEach(estado => {
      auxEstado.push({
        text: estado.nombreEstado,
        value: estado.idEstado.toString(),
      });
    });
    return auxEstado;
  }
  return [];
};

export const buildEstadoInitialValueFilterPosventa = (
  e: Estado | undefined
): ItemDropdown => {
  if (e) {
    return {
      value: e.idEstado.toString(),
      text: e.nombreEstado,
    };
  } else {
    return {
      value: '',
      text: '',
    };
  }
};

export const buildPosventaTipoInitialValueList = (
  posventas: PosventaTipo[] | undefined
): ItemDropdown[] => {
  const auxPosventaTipo: ItemDropdown[] = [];
  if (posventas) {
    posventas.forEach(p => {
      auxPosventaTipo.push({ text: p.nombre, value: p.id });
    });
    return auxPosventaTipo;
  }
  return [];
};

export const buildConceptosInitialValueList = (
  conceptos: ConceptoTipo[] | undefined
): ItemDropdown[] => {
  const auxConceptos: ItemDropdown[] = [];
  if (conceptos) {
    conceptos.forEach(c => {
      auxConceptos.push({ text: c.nombre, value: c.id });
    });
    return auxConceptos;
  }
  return [];
};

export const buildNombresConceptosList = (
  conceptos: any[] | undefined
): ItemDropdown[] => {
  const auxNombresConceptos: ItemDropdown[] = [];
  if (conceptos) {
    conceptos.forEach(p => {
      auxNombresConceptos.push({ text: `${p.nombre}`, value: p.nombre });
    });
    return auxNombresConceptos;
  }
  return [];
};

export const validarCamposCargar = (posventaGenericaAuxiliar): boolean => {
  return (
    posventaGenericaAuxiliar.idPosVentaTipo !== '' &&
    posventaGenericaAuxiliar.divisa !== '' &&
    posventaGenericaAuxiliar.idAplicacion !== '' &&
    posventaGenericaAuxiliar.nroOperacion !== '' &&
    validarSecuenciaOperacion(
      posventaGenericaAuxiliar.idAplicacion,
      posventaGenericaAuxiliar.secuencia,
      posventaGenericaAuxiliar.nroOperacion
    ) &&
    posventaGenericaAuxiliar.idPosVentaParametria !== '' &&
    posventaGenericaAuxiliar.cuit !== ''
  );
};

export const validarCamposGuardar = (posventaGenericaAuxiliar): boolean => {
  return (
    !isEmpty(posventaGenericaAuxiliar.idPosVentaTipo) &&
    !isEmpty(posventaGenericaAuxiliar.divisa) &&
    !isEmpty(posventaGenericaAuxiliar.idAplicacion) &&
    !isEmpty(posventaGenericaAuxiliar.nroOperacion) &&
    !isEmpty(posventaGenericaAuxiliar.secuencia) &&
    !isEmpty(posventaGenericaAuxiliar.idPosVentaParametria) &&
    !isEmpty(posventaGenericaAuxiliar.cuit) &&
    !isEmpty(posventaGenericaAuxiliar.nroCuenta) &&
    !isEmpty(posventaGenericaAuxiliar.monto) &&
    parseFloat(
      posventaGenericaAuxiliar.monto.replaceAll('.', '').replace(',', '.')
    ) > 0 &&
    !isEmpty(posventaGenericaAuxiliar.razonSocial) &&
    !isEmpty(posventaGenericaAuxiliar.tipoCuenta) &&
    !isEmpty(posventaGenericaAuxiliar.legajoCreacion) &&
    !isEmpty(posventaGenericaAuxiliar.alicuota)
  );
};

export const validarCamposCargarNuevaDevolucionModal = (
  nuevaPosventaAuxiliar
): boolean => {
  return (
    nuevaPosventaAuxiliar.nroOperacion !== '' &&
    nuevaPosventaAuxiliar.secuencia !== '' &&
    nuevaPosventaAuxiliar.idPosVentaTipo !== '' // CHEQUEAR ESTA PARTE IMPORTANTE!!!!
  );
};

export const validarCamposGuardarNuevaDevolucionModal = (
  nuevaPosventaAuxiliar
): boolean => {
  // Devuelve TRUE si TODOS los campos tienen un valor
  return (
    nuevaPosventaAuxiliar.nroOperacion !== '' &&
    nuevaPosventaAuxiliar.secuencia !== '' &&
    nuevaPosventaAuxiliar.idPosVentaTipo !== ''
  );
};

export const validarSecuenciaOperacion = (
  aplicacion: string = '',
  secuencia: string = '',
  operacion: string = ''
): boolean => {
  if (aplicacion === '1') {
    if (
      operacion
        .toUpperCase()
        .trim()
        .startsWith('T')
    ) {
      return secuencia === '000';
    } else if (
      operacion
        .toUpperCase()
        .trim()
        .startsWith('O')
    ) {
      return secuencia !== '000';
    }
  } else {
    return true;
  }
};

export const validarSecuencia = (
  setMensajeErrorSecuencia: (value: React.SetStateAction<string>) => void,
  setSecuenciaValida: (value: React.SetStateAction<boolean>) => void,
  setErrorSecuencia: (value: React.SetStateAction<boolean>) => void,
  aplicacion: string = '',
  secuencia: string = '',
  operacion: string = ''
) => {
  // Check if secuencia is a 3-digit number
  const regex = /^\d{3}$/;
  let isValid = regex.test(secuencia);
  let message = '';

  if (isValid) {
    isValid = validarSecuenciaOperacion(aplicacion, secuencia, operacion);

    if (!isValid) {
      if (aplicacion === '1') {
        if (
          operacion
            .toUpperCase()
            .trim()
            .startsWith('T')
        ) {
          message = 'La secuencia no puede ser distinta de cero.';
        } else if (
          operacion
            .toUpperCase()
            .trim()
            .startsWith('O')
        ) {
          message = 'La secuencia no puede ser cero.';
        }
      }
    }
  } else {
    message = 'La secuencia debe tener 3 dígitos.';
  }
  // Set validation states and messages
  setSecuenciaValida(isValid);
  setErrorSecuencia(!isValid);
  setMensajeErrorSecuencia(isValid ? '' : message);
};

export const getDivisaFromCuenta = (
  cuenta: string,
  monedaComisiones: string,
  monedaTransferencia: string
) => {
  if (cuenta === 'CuentaTransferencia') {
    return monedaTransferencia;
  } else if (cuenta === 'CuentaComisiones') {
    return monedaComisiones;
  } else {
    return '-';
  }
};

export const optionAplicacion = [
  { value: '1', text: 'TOPS' },
  { value: '2', text: 'BankTrade' },
  { value: '3', text: 'TESIN' },
  { value: '4', text: 'SECOPA' },
];

export const optionDevolucionCobro = [
  { value: '1', text: 'Devolución' },
  { value: '2', text: 'Cobro' },
];

export const optionMoneda = [
  { value: 'ARS', text: 'ARS' },
  { value: 'USD', text: 'USD' },
]; 