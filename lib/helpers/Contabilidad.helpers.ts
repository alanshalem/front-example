//tengo 4 casos:
//1) cuando checkeo todas las filas => tengo que pisar el arreglo con TODAS las rows que me traigo
//2) cuando des-checkeo las filas => tengo que BORRAR todas las rows
//3) cuando checkeo SOLO 1 => la agrego al arreglo
//4) cuando des-checkeo SOLO 1 => la busco en el arreglo y elimino ese registro

import { ContabilidadAuxiliar } from '@components/Contabilidad/ContabilidadPage';
import {
  getCrucesByFilter,
  guardarContabilidadManual,
  loadContabilidadManual,
  simularContabilidadManual,
} from '@lib/services/Contabilidad.services';
import {
  Contabilidad,
  EstadoType,
  FilterContabilidad,
} from '@lib/types/Contabilidad/Contabilidad.types';
import {
  Categoria,
  Evento,
} from '@lib/types/Contabilidad/Eventos/Inventario/EventoInventario.types';
import { convertirFechaAISO8601, formatDateUS } from '@lib/utils/Date';
import { convertStringANumberDecimal } from '@lib/utils/Importe';
import { transformNumberString } from '@lib/utils/Numbers';
import toast from 'react-hot-toast';
import { isEmpty } from './helpers';

export const getAllContabilidades = (
  setContabilidadList: (value: React.SetStateAction<Contabilidad[]>) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void
) => {
  const filtroContabilidadObj: FilterContabilidad = {
    crucesContablesByFilterDTO: {
      numOp1: null,
      legajoUltimaModificacion: null,
      legajoCreacion: null,
      debe: null,
      haber: null,
      secuencia: null,
      corte: null,
      fechaCreacion: formatDateUS(new Date()),
      fechaModificacion: null,
    },
  };
  getCrucesByFilter(filtroContabilidadObj)
    .then((result: any) => {
      setContabilidadList(result);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

export const calcularEstado = (idEstado: number): EstadoType => {
  if (idEstado === 1) {
    return { text: 'Error', state: 'error' };
  } else {
    return { text: 'Pendiente', state: 'info' };
  }
};

//devuelve true si todos los campos del filtro estan vacios
export const verificarFiltroCruces = (
  filtroCruce: ContabilidadAuxiliar
): boolean => {
  return (
    isEmpty(filtroCruce.numOp2) &&
    isEmpty(filtroCruce.numOp1) &&
    isEmpty(filtroCruce.codcta) &&
    isEmpty(filtroCruce.legajoUltimaModificacion) &&
    isEmpty(filtroCruce.legajoCreacion) &&
    isEmpty(filtroCruce.fechaCreacion) &&
    isEmpty(filtroCruce.fechaModificacion)
  );
};

export const prepareFilter = (
  filtroCruce: ContabilidadAuxiliar,
  setCcrucesList: (value: React.SetStateAction<Contabilidad[]>) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void
) => {
  // preparo el filtro
  const filtroCruceObj: FilterContabilidad = {
    crucesContablesByFilterDTO: {
      numOp1: filtroCruce.numOp1 ? filtroCruce.numOp1 : null,
      numOp2: filtroCruce.numOp2 ? filtroCruce.numOp2 : null,
      codcta: filtroCruce.codcta ? filtroCruce.codcta : null,
      legajoUltimaModificacion: filtroCruce.legajoUltimaModificacion
        ? filtroCruce.legajoUltimaModificacion
        : null,
      legajoCreacion: filtroCruce.legajoCreacion
        ? filtroCruce.legajoCreacion
        : null,
      fechaCreacion: filtroCruce.fechaCreacion
        ? filtroCruce.fechaCreacion
        : null,
      fechaModificacion: filtroCruce.fechaModificacion
        ? filtroCruce.fechaModificacion
        : null,
    },
  };
  getCrucesByFilter(filtroCruceObj)
    .then((result: any) => {
      setCcrucesList(result);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

export const formatNumber = (num: number): string => {
  const formattedNumber = num.toLocaleString('es-AR', { currency: 'ARS' });

  return formattedNumber;
};

export const obtenerEventosPorNombre = (
  eventos: Categoria[],
  nombre: string
): Evento[] | undefined => {
  const categoriaEncontrada = eventos.find(
    categoria => categoria.nombre.toLowerCase() === nombre.toLowerCase()
  );

  return categoriaEncontrada?.eventosContables;
};

export const transformarArrayEventosContablesContabilidadManual = data => {
  if (!data || !Array.isArray(data)) {
    console.error('Invalid data or not an array');
    return [];
  }

  return data.map(item => ({
    text: `${item.codigo || ''} - ${item.descripcion || ''}`,
    value: item.id || null,
  }));
};

export const transformarArrayDocumentosContabilidadManual = data => {
  if (!data || !Array.isArray(data)) {
    console.error('Invalid data or not an array');
    return [];
  }

  return data.map(item => ({
    text: `${item.nombre || ''}`,
    value: item.nombre || null,
  }));
};

export const transformarArrayCentrosDeCostoContabilidadManual = data => {
  if (!data || !Array.isArray(data)) {
    console.error('Invalid data or not an array');
    return [];
  }

  return data.map(item => ({
    text: item.centroDeCosto || null,
    value: item.centroDeCosto || null,
  }));
};
export const transformarArrayReferenciasContablesContabilidadManual = data => {
  if (!data || !Array.isArray(data)) {
    console.error('Invalid data or not an array');
    return [];
  }

  return data.map(item => ({
    text: item.nombre || null,
    value: item.id || null,
  }));
};

export const optionsMoneda = [
  { value: 'ARS', text: 'ARS' },
  { value: 'USD', text: 'USD' },
];

export const initialValueOptions = {
  value: '',
  text: '',
};

export const formatDateFromDateTimeToDDMMYYYY = date => {
  let formatted_date =
    date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  return formatted_date;
};

interface ValidFields {
  centroCosto: string;
  divisa: string;
  importe: string;
  rubro: string;
  tipoMovimiento: string;
}

interface ValidFields {
  centroCosto: string;
  divisa: string;
  importe: string;
  rubro: string;
  tipoMovimiento: string;
}

export const validateFieldsGuardar = (data: any[] | undefined): boolean => {
  // Verificamos que la data sea un array antes de usar every
  if (!Array.isArray(data)) {
    return false;
  }
  return data.every(item => {
    const {
      centroCosto,
      divisa,
      importe,
      rubro,
      tipoMovimiento,
    }: ValidFields = item;

    return (
      centroCosto.length > 0 &&
      divisa.length > 0 &&
      importe.toString().length > 0 &&
      rubro.length > 0 &&
      tipoMovimiento.length > 0
    );
  });
};

export const validateFieldsSimular = (
  respuestaInicial,
  nuevoAnaliticoIntermedioData: any
): any => {
  if (respuestaInicial !== undefined) {
    const {
      centroCostoVisible,
      cotizacionVisible,
      divisaVisible,
      importeVisible,
    } = respuestaInicial;

    const validacionCentroCosto = centroCostoVisible
      ? nuevoAnaliticoIntermedioData.centroCosto.length > 0
      : true;
    const validacionCotizacion = cotizacionVisible
      ? nuevoAnaliticoIntermedioData.cotizacion.length > 0
      : true;
    const validacionDivisa = divisaVisible
      ? nuevoAnaliticoIntermedioData.divisa.length > 0
      : true;
    const validacionImporte = importeVisible
      ? nuevoAnaliticoIntermedioData.importe.length > 0
      : true;

    return (
      validacionCentroCosto &&
      validacionCotizacion &&
      validacionDivisa &&
      validacionImporte
    );
  } else {
    return false;
  }
};

export const agregaBooleanSiTieneData = eventos => {
  const eventosModificados = eventos.map(item => {
    const newItem = { ...item };

    // Añadir campos según las condiciones
    newItem.esRubroOriginal = item.rubro !== '';
    newItem.esCentroCostoOriginal = item.centroCosto !== '';
    newItem.esDivisaOriginal = item.divisa !== '';
    newItem.esImporteOriginal = item.importe !== 0;

    return newItem;
  });
  return eventosModificados;
};

export async function handleCargarContabilidad(
  setLoading,
  nuevoAnaliticoData,
  setEventosContablesList,
  setEventosContablesOriginalList,
  setMostrarTabla,
  setRespuestaInicial,
  setRespuestaValida,
  setCostoVisible,
  setImporteVisible,
  setDivisaVisible,
  setCotizacionVisible
) {
  setLoading(true);
  const nuevoAnaliticoDataAux = JSON.parse(JSON.stringify(nuevoAnaliticoData));

  nuevoAnaliticoDataAux.fechaValor = convertirFechaAISO8601(
    nuevoAnaliticoDataAux.fechaValor
  );

  loadContabilidadManual(nuevoAnaliticoDataAux)
    .then((result: any) => {
      if (result.status.statusCode === 500) {
        toast.error(result.status.desc);
        setMostrarTabla(!result.data.esGenerica);
        setRespuestaValida(false);
      } else {
        setRespuestaInicial(result);
        setCostoVisible(result.centroCostoVisible ? false : true);
        setDivisaVisible(result.divisaVisible ? false : true);
        setCotizacionVisible(result.cotizacionVisible ? false : true);
        setImporteVisible(result.importeVisible ? false : true);
        setEventosContablesList(result.eventoDetalle);
        setEventosContablesOriginalList(
          agregaBooleanSiTieneData(result.eventoDetalle)
        );
        setRespuestaValida(true);
        toast.success(result.status.desc);
      }
    })
    .catch(() => {
      toast.error(
        'Se produjo algun error en la carga de los datos. Intenta nuevamente.'
      );
      setRespuestaValida(false);
    })
    .finally(() => {
      setLoading(false);
    });
}

export async function handleSimularContabilidad(
  setLoading,
  nuevoAnaliticoData,
  nuevoAnaliticoIntermedioData,
  setEventosContablesList,
  setEventosContablesOriginalList,
  setMostrarTabla,
  setRespuestaInicial,
  setRespuestaValida,
  setRenderTableSimular
) {
  setLoading(true);
  const nuevoAnaliticoDataAux = JSON.parse(JSON.stringify(nuevoAnaliticoData));

  nuevoAnaliticoDataAux.fechaValor = convertirFechaAISO8601(
    nuevoAnaliticoDataAux.fechaValor
  );

  let importe = transformNumberString(nuevoAnaliticoIntermedioData.importe);

  let cotizacion = transformNumberString(
    nuevoAnaliticoIntermedioData.cotizacion
  );

  const simularRequest = {
    ...nuevoAnaliticoDataAux,
    ...nuevoAnaliticoIntermedioData,
    importe,
    cotizacion,
  };

  simularContabilidadManual(simularRequest)
    .then((result: any) => {
      if (result.status.statusCode === 500) {
        toast.error(result.status.desc);
        setMostrarTabla(!result.data.esGenerica);
      } else {
        setRespuestaInicial(result);

        setEventosContablesList(result.eventoDetalle);
        setEventosContablesOriginalList(
          agregaBooleanSiTieneData(result.eventoDetalle)
        );
        setRenderTableSimular(true);
        toast.success(result.status.desc);
      }
    })
    .catch(() => {
      toast.error(
        'Se produjo algun error en la carga de los datos. Intenta nuevamente.'
      );
      setRespuestaValida(false);
    })
    .finally(() => {
      setLoading(false);
    });
}

export async function handleGuardarContabilidad(
  setLoading,
  nuevoAnaliticoData,
  nuevoAnaliticoIntermedioData,
  eventosContablesList,
  observaciones,
  legajo,
  closeToggle,
  refreshTable,
  esGenerico,
) {
  setLoading(true);
  const contabilidadManualCreate = {
    idEventoContable: nuevoAnaliticoData.idEventoContable,
    idTipoReferencia: nuevoAnaliticoData.idTipoReferencia,
    tipoDocumento: nuevoAnaliticoData.tipoDocumento
      ? nuevoAnaliticoData.tipoDocumento
      : '',
    nroDocumento: nuevoAnaliticoData.nroDocumento
      ? nuevoAnaliticoData.nroDocumento
      : '',
    idCorresponsal: nuevoAnaliticoData.idCorresponsal
      ? nuevoAnaliticoData.idCorresponsal
      : 0,
    identificacion: nuevoAnaliticoData.identificacion,
    cotizacion: transformNumberString(nuevoAnaliticoIntermedioData.cotizacion),
    observacion: observaciones,
    fechaValor: convertirFechaAISO8601(nuevoAnaliticoData.fechaValor),
    eventoDetalle: eventosContablesList.map(evento => ({
      id: evento.id,
      rubro: evento.rubro,
      idTipoMovimiento: evento.idTipoMovimiento,
      centroCosto: evento.centroCosto,
      divisa: evento.divisa,
      importe: convertStringANumberDecimal(evento.importe),
    })),
    legajoCreacion: legajo,
  };
  if (esGenerico === 'generica') {
    delete contabilidadManualCreate.cotizacion
  }
  guardarContabilidadManual(contabilidadManualCreate)
    .then((result: any) => {
      if (
        result.status.statusCode === 400 ||
        result.status.statusCode === 500
      ) {
        toast.error(result.status.desc);
      } else {
        toast.success(result.status.desc);
        closeToggle();
      }
    })
    .catch(() => {
      toast.error(
        'Se produjo algun error en la carga de los datos. Intenta nuevamente.'
      );
    })
    .finally(() => {
      refreshTable();
      setLoading(false);
    });
}
