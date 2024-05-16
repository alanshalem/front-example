import {
  EsquemaContableAuxiliar,
  FilterEsquemaContable,
} from '@lib/types/EsquemaContable/EsquemaContable.types';
import { isEmpty } from './helpers';
import { getEsquemasByFilter } from '@lib/services/EsquemasContables/Esquemas.services';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';

//devuelve true si todos los campos del filtro estan vacios
export const verificarFiltroEsquema = (
  filtroEsquema: EsquemaContableAuxiliar
): boolean => {
  return (
    isEmpty(
      filtroEsquema.aplicacion ? filtroEsquema.aplicacion.toString() : ''
    ) &&
    isEmpty(filtroEsquema.centroCosto) &&
    isEmpty(filtroEsquema.divisa) &&
    isEmpty(
      filtroEsquema.idEventoContable
        ? filtroEsquema.idEventoContable.toString()
        : ''
    ) &&
    isEmpty(filtroEsquema.rubro)
  );
};

export const prepareFilter = (
  filtroEsquema: EsquemaContableAuxiliar,
  setEsquemasContablesList: (value: React.SetStateAction<any[]>) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void
) => {
  // preparo el filtro
  const filtroEsquemaContableObj: FilterEsquemaContable = {
    eventoContableAplicacionFilterRequestDTO: {
      aplicacion: filtroEsquema.aplicacion
        ? Number(filtroEsquema.aplicacion)
        : null,
      rubro: filtroEsquema.rubro ? filtroEsquema.rubro : null,
      centroCosto: filtroEsquema.centroCosto ? filtroEsquema.centroCosto : null,
      divisa: filtroEsquema.divisa ? filtroEsquema.divisa : null,
      idEventoContable: filtroEsquema.idEventoContable
        ? Number(filtroEsquema.idEventoContable)
        : null,
    },
  };
  getEsquemasByFilter(filtroEsquemaContableObj)
    .then((result: any) => {
      setEsquemasContablesList(result);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

export const getAllEsquemasContables = (
  setEsquemasContablesList: (value: React.SetStateAction<any[]>) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void
) => {
  setLoading(true);
  const filtroEsquemaContableObj: FilterEsquemaContable = {
    eventoContableAplicacionFilterRequestDTO: {
      rubro: null,
      centroCosto: null,
      divisa: null,
      aplicacion: null,
      idEventoContable: null,
    },
  };
  getEsquemasByFilter(filtroEsquemaContableObj)
    .then((result: any) => {
      setEsquemasContablesList(result);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

export const transformarEventosContables = objeto => {
  // Array para almacenar los objetos aplanados
  let objetosAplanados = [];

  // Recorremos cada elemento del objeto original
  objeto.forEach(item => {
    // Verificamos si tiene eventosContables
    if (item.eventosContables.length > 0) {
      // Recorremos los eventosContables
      item.eventosContables.forEach(evento => {
        // Creamos un nuevo objeto con la combinación de la descripción y el código del evento
        let texto = item.descripcion;
        if (evento.codigo) {
          texto += ' - ' + evento.codigo;
        }
        if (evento.descripcion) {
          texto += ' - ' + evento.descripcion;
        }
        let nuevoObjeto = {
          text: texto,
          value: evento.id.toString(),
        };
        // Agregamos el nuevo objeto al array de objetos aplanados
        objetosAplanados.push(nuevoObjeto);
      });
    } else {
      // Si no hay eventosContables, agregamos un objeto con la descripción y un ID nulo
      objetosAplanados.push({
        text: item.descripcion,
        value: item.id.toString(),
      });
    }
  });

  return objetosAplanados;
};

export const itemsAplicacion = [
  { value: '1', text: 'TOPS' },
  { value: '2', text: 'BankTrade' },
  { value: '3', text: 'TESIN' },
  { value: '4', text: 'SECOPA' },
  { value: '5', text: 'OASYS' },
];
export const buildAplicacionInitialValueFilter = (
  e: any | undefined
): ItemDropdown => {
  if (e) {
    return {
      value: `${e.value}`,
      text: `${e.text}`,
    };
  } else {
    return {
      value: '',
      text: '',
    };
  }
};

export const buildEventosContablesInitialValueFilter = (
  e: any | undefined
): ItemDropdown => {
  if (e) {
    return {
      value: `${e.value}`,
      text: `${e.text}`,
    };
  } else {
    return {
      value: '',
      text: '',
    };
  }
};
