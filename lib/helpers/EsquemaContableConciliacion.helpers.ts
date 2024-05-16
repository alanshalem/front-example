import {
  actualizarEsquemaContableConciliacion,
  eliminarEsquemaContableConciliacion,
  getEsquemasContablesConciliacionByFilter,
  guardarEsquemaContableConciliacion,
} from '@lib/services/EsquemasContablesConciliacion/EsquemasContablesConciliacion.services';
import {
  EsquemaContableConciliacionAuxiliar,
  FilterEsquemaContableConciliacion,
} from '@lib/types/EsquemaContableConciliacion/EsquemaContableConciliacion.types';
import toast from 'react-hot-toast';
import { isEmpty } from './helpers';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';

//devuelve true si todos los campos del filtro estan vacios
export const verificarFiltroEsquemaContableConciliacion = (
  filtroEsquema: EsquemaContableConciliacionAuxiliar
): boolean => {
  return (
    isEmpty(filtroEsquema.idCentroDeCosto.toString()) &&
    isEmpty(filtroEsquema.idRubro.toString()) &&
    isEmpty(filtroEsquema.concilia)
  );
};

export const getAllEsquemasContablesConciliacion = (
  setEsquemasContablesList: (value: React.SetStateAction<any[]>) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void
) => {
  setLoading(true);
  const filtroEsquemaContableObj: FilterEsquemaContableConciliacion = {
    rubroCentroDivisaRequestDTO: {},
  };
  getEsquemasContablesConciliacionByFilter(filtroEsquemaContableObj)
    .then((result: any) => {
      setEsquemasContablesList(result);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

export const prepareFilter = (
  filtroEsquema: EsquemaContableConciliacionAuxiliar,
  setEsquemasContablesList: (value: React.SetStateAction<any[]>) => void,
  setLoading: (value: React.SetStateAction<boolean>) => void
) => {
  // preparo el filtro
  const filtroEsquemaContableObj: FilterEsquemaContableConciliacion = {
    rubroCentroDivisaRequestDTO: {
      idCentroDeCosto: filtroEsquema.idCentroDeCosto
        ? filtroEsquema.idCentroDeCosto
        : null,
      concilia: filtroEsquema.concilia ? filtroEsquema.concilia : null,
      idRubro: filtroEsquema.idRubro ? filtroEsquema.idRubro : null,
    },
  };
  if (
    filtroEsquemaContableObj.rubroCentroDivisaRequestDTO.idCentroDeCosto ===
    null
  ) {
    delete filtroEsquemaContableObj.rubroCentroDivisaRequestDTO.idCentroDeCosto;
  }
  if (filtroEsquemaContableObj.rubroCentroDivisaRequestDTO.idRubro === null) {
    delete filtroEsquemaContableObj.rubroCentroDivisaRequestDTO.idRubro;
  }
  if (filtroEsquemaContableObj.rubroCentroDivisaRequestDTO.concilia === null) {
    delete filtroEsquemaContableObj.rubroCentroDivisaRequestDTO.concilia;
  }
  getEsquemasContablesConciliacionByFilter(filtroEsquemaContableObj)
    .then((result: any) => {
      setEsquemasContablesList(result);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

export async function handleGuardarEsquemaContableConciliacion(
  dataEsquemaContable: any,
  setLoading: (value) => void,
  closeToggle: () => void,
  handleBuscar: () => void
) {
  dataEsquemaContable.idRubro = Number(dataEsquemaContable.idRubro);
  dataEsquemaContable.idCentroDeCosto = Number(
    dataEsquemaContable.idCentroDeCosto
  );

  const esquemaContableDTO = {
    createRubroCentroDivisaRequestDTO: { ...dataEsquemaContable },
  };

  setLoading(true);
  await guardarEsquemaContableConciliacion(esquemaContableDTO)
    .then(res => {
      setLoading(false);
      if (res.data === 'success') {
        toast.success('Se guardo correctamente');
        closeToggle();
        handleBuscar();
      } else {
        toast.error('Hubo un error');
      }
      /*if (res.hasErrors || res.data !== 'success') {
        toast.error(res.status.desc);
      } else {
        toast.success(res.status.desc);
        closeToggle();
        handleBuscar();
      }*/
    })
    .catch(() => {
      setLoading(false);
      toast.error('Hubo un error');
      closeToggle();
    });
}

export async function handleEditarEsquemaContableConciliacion(
  dataEsquemaContable: any,
  setLoading: (value) => void,
  closeToggle: () => void,
  handleBuscar: () => void
) {
  const esquemaContableDTO = {
    updateRubroCentroDivisaRequestDTO: { ...dataEsquemaContable },
  };

  setLoading(true);
  await actualizarEsquemaContableConciliacion(esquemaContableDTO)
    .then(res => {
      setLoading(false);
      if (res.hasErrors) {
        toast.error(res.status.desc);
      } else {
        toast.success('Se actualizo correctamente.');
        closeToggle();
        handleBuscar();
      }
    })
    .catch(() => {
      setLoading(false);
      toast.error('Hubo un error');
      closeToggle();
    });
}

export async function handleEliminarEsquemaContableConciliacion(
  idRubroCentroDivisa: any,
  setLoading: (value) => void,
  closeToggle: () => void,
  handleBuscar: () => void
) {
  const esquemaContableDTO = {
    deleteRubroCentroDivisaRequestDTO: {
      idRubroCentroDivisa: Number(idRubroCentroDivisa),
    },
  };
  setLoading(true);
  await eliminarEsquemaContableConciliacion(esquemaContableDTO)
    .then(res => {
      setLoading(false);
      if (res.hasErrors === false) {
        toast.success('Se elimino correctamente.');
        closeToggle();
        handleBuscar();
      } else {
        toast.error('Hubo un error');
      }
      /*if (res.hasErrors) {
        toast.error('Hubo un error');
      } else {
        toast.success('Se elimino correctamente.');
        closeToggle();
        handleBuscar();
      }*/
    })
    .catch(() => {
      setLoading(false);
      toast.error('Hubo un error');
      closeToggle();
    });
}

export const transformarArrayCentrosDeCosto = data => {
  if (!data || !Array.isArray(data)) {
    console.error('Invalid data or not an array');
    return [];
  }

  return data.map(item => ({
    text: item.centroDeCosto || null,
    value: item.id || null,
  }));
};

export const transformarArrayRubros = data => {
  if (!data || !Array.isArray(data)) {
    console.error('Invalid data or not an array');
    return [];
  }

  return data.map(item => ({
    text: item.rubro || null,
    value: item.id || null,
  }));
};

export const valoresConcilia = [
  { text: 'Si', value: 'true' },
  { text: 'No', value: 'false' },
];

export const valoresConciliaBoolean = [
  { text: 'Si', value: true },
  { text: 'No', value: false },
];

export const buildConciliaconInitialValueFilter = (
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
