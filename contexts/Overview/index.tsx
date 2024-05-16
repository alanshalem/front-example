import { State, View } from '@contexts/GlobalContext';
import { getTiposDeAvisos } from '@lib/services/Alertas/Alertas.services';
import {
  getCentrosDeCosto,
  getRubros,
  getDocumentos,
  getEstados,
  getEventos,
  getMonedas,
  getAplicaciones,
} from '@lib/services/Common/common.services';
import { getTipoDiferenciaConciliacion } from '@lib/services/ConciliacionComexSAP/ConciliacionComexSAP.services';
import {
  getEventosContablesContabilidadManual,
  getReferenciasContablesContabilidadManual,
} from '@lib/services/Contabilidad.services';
import { getCorresponsal } from '@lib/services/Corresponsal/Corresponsal.services';
import { getExcepcionesBoletos } from '@lib/services/Excepciones/Excepciones.services';
import { getTiposDeResultados } from '@lib/services/GestionDeResultados/TipoDeResultados.services';
import {
  getNombresConceptos,
  getTiposPosventa,
} from '@lib/services/Posventa/Posventa.services';
import { GetProcesoForFilter } from '@lib/services/Procesos/Procesos.services'
import {
  getTiposAnaliticoGastoRebate,
  getTiposAnaliticoPrevisiones,
} from '@lib/services/TiposAnaliticos/TiposAnaliticos.services';
import { TipoDeAlertas } from '@lib/types/Alertas/Alertas.types';
import { ConceptoDeBoleto } from '@lib/types/COMEX/ConceptoDeBoleto.types';
import {
  Aplicaciones,
  CentroDeCosto,
  Documento,
  Moneda,
  Rubro,
} from '@lib/types/COMEX/Monedas.types';
import { TipoDiferenciaTypes } from '@lib/types/ConciliacionComexSAP/ConciliacionComexSAP.types';
import {
  EventosContablesContabilidadManualTypes,
  ReferenciasContablesContabilidadManualTypes,
} from '@lib/types/Contabilidad/Contabilidad.types';
import { Categoria } from '@lib/types/Contabilidad/Eventos/Inventario/EventoInventario.types';
import { FuncionalidadEstados } from '@lib/types/Estados/Estados.types';
import { ExcepcionBoletoSimi } from '@lib/types/Excepciones/Excepciones.types';
import {
  ConceptoNombre,
  PosventaTipo,
} from '@lib/types/Posventa/Posventa.types';
import { ProcesosForFilter } from '@lib/types/Procesos/Procesos.types'
import { conceptosHardcodeados } from '@lib/utils/variables';
import React, { createContext, useEffect, useMemo, useState } from 'react';

export type GlobalStateContextType = {
  tiposDeResultados(
    arg0: () => import('../../lib/types/ItemDropdown.types').ItemDropdown[],
    tiposDeResultados: any
  ): unknown;
  tiposAnaliticoPrevisiones(
    arg0: () => import('../../lib/types/ItemDropdown.types').ItemDropdown[],
    tiposAnaliticoPrevisiones: any
  ): unknown;
  tiposAnaliticoGastoRebate(
    arg0: () => import('../../lib/types/ItemDropdown.types').ItemDropdown[],
    tiposAnaliticoGastoRebate: any
  ): unknown;
  conceptos?: ConceptoDeBoleto[];
  setConceptos?: (conceptos: ConceptoDeBoleto[]) => void;
  nombresConceptos?: ConceptoNombre[];
  setNombresConceptos?: (conceptos: ConceptoNombre[]) => void;
  monedas?: Moneda[];
  setMonedas?: (monedas: Moneda[]) => void;
  documentos?: Moneda[];
  setDocumentos?: (monedas: Moneda[]) => void;
  centrosDeCosto?: Moneda[];
  setCentrosDeCosto?: (monedas: Moneda[]) => void;
  rubros?: Rubro[];
  setRubros?: (rubros: Rubro[]) => void;
  funcionalidades?: FuncionalidadEstados[];
  setFuncionalidades?: (funcionalidesEstados: FuncionalidadEstados[]) => void;
  eventosContables?: Categoria[];
  setEventosContables?: (funcionalidesEstados: Categoria[]) => void;
  eventosContablesContabilidadManual?: EventosContablesContabilidadManualTypes[];
  setEventosContablesContabilidadManual?: (
    eventosContablesContabilidadManual: EventosContablesContabilidadManualTypes[]
  ) => void;
  referencias?: ReferenciasContablesContabilidadManualTypes[];
  setReferencias?: (
    referenciasContablesContabilidadManual: ReferenciasContablesContabilidadManualTypes[]
  ) => void;
  excepciones?: ExcepcionBoletoSimi[];
  setExcepciones?: (excepciones: ExcepcionBoletoSimi[]) => void;
  tiposPosventa?: PosventaTipo[];
  setTiposPosventa?: (tiposPosventa: PosventaTipo[]) => void;
  loading?: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  tiposCorresponsal?: any;
  setTiposCoresponsal?: React.Dispatch<any>;
  tiposAplicaciones?: Aplicaciones[];
  setTiposAplicaciones?: React.Dispatch<React.SetStateAction<Aplicaciones[]>>;
  tiposAvisos?: TipoDeAlertas[];
  setTiposAvisos: React.Dispatch<React.SetStateAction<TipoDeAlertas[]>>;
  tipoDiferencia?: TipoDiferenciaTypes[];
  setTipoDiferencia: React.Dispatch<
    React.SetStateAction<TipoDiferenciaTypes[]>
  >;
  procesosForFilter?: ProcesosForFilter[];
  setProcesosForFilter: React.Dispatch<React.SetStateAction<ProcesosForFilter[]>>;
};

const OverviewContext = createContext<GlobalStateContextType>(null);

export const OverviewProvider: React.FunctionComponent = ({ children }) => {
  const [conceptos, setConceptos] = useState<ConceptoDeBoleto[]>();
  const [nombresConceptos, setNombresConceptos] = useState<ConceptoNombre[]>();
  const [monedas, setMonedas] = useState<Moneda[]>();
  const [documentos, setDocumentos] = useState<any[]>();
  const [centrosDeCosto, setCentrosDeCosto] = useState<any[]>();
  const [rubros, setRubros] = useState<Rubro[]>();
  const [funcionalidades, setFuncionalidades] = useState<
    FuncionalidadEstados[]
  >();
  const [eventosContables, setEventosContables] = useState<Categoria[]>();
  const [
    eventosContablesContabilidadManual,
    setEventosContablesContabilidadManual,
  ] = useState<EventosContablesContabilidadManualTypes[]>();
  const [referencias, setReferencias] = useState<
    ReferenciasContablesContabilidadManualTypes[]
  >();
  const [excepciones, setExcepciones] = useState<ExcepcionBoletoSimi[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [tiposPosventa, setTiposPosventa] = useState<PosventaTipo[]>();
  const [tiposCorresponsal, setTipoCorresponsal] = useState<any>();
  const [tiposAnaliticoGastoRebate, setTiposAnaliticoGastoRebate] = useState<
    any
  >();
  const [tiposAnaliticoPrevisiones, setTiposAnaliticoPrevisiones] = useState<
    any
  >();
  const [tiposDeResultados, setTiposDeResultados] = useState<any>();
  const [tiposAplicaciones, setTiposAplicaciones] = useState<Aplicaciones[]>();
  const [tiposAvisos, setTiposAvisos] = useState<TipoDeAlertas[]>();
  const [tipoDiferencia, setTipoDiferencia] = useState<TipoDiferenciaTypes[]>();
  const [procesosForFilter, setProcesosForFilter] = useState<ProcesosForFilter[]>();


  const obtenerConceptos = () => {
    setConceptos(conceptosHardcodeados);
  };

  const obtenerNombresConceptos = () => {
    getNombresConceptos()
      .then((result: any[]) => {
        if (result) {
          setNombresConceptos(result);
        }
      })
      .catch(error => error);
  };

  const obtenerExcepciones = () => {
    getExcepcionesBoletos()
      .then((result: ExcepcionBoletoSimi[]) => {
        if (result) {
          setExcepciones(result);
        }
      })
      .catch(error => error);
  };
  const obtenerMonedas = () => {
    getMonedas()
      .then((result: Moneda[]) => {
        result && setMonedas(result);
      })
      .catch(error => error);
  };

  const obtenerDocumentos = () => {
    getDocumentos()
      .then((result: Documento[]) => {
        result && setDocumentos(result);
      })
      .catch(error => error);
  };
  const obtenerCentrosDeCosto = () => {
    getCentrosDeCosto()
      .then((result: CentroDeCosto[]) => {
        result && setCentrosDeCosto(result);
      })
      .catch(error => error);
  };
  const obtenerRubros = () => {
    getRubros()
      .then((result: CentroDeCosto[]) => {
        result && setRubros(result);
      })
      .catch(error => error);
  };
  const obtenerFuncionalidadesEstados = () => {
    getEstados()
      .then((result: FuncionalidadEstados[]) => {
        result && setFuncionalidades(result);
      })
      .catch(error => error);
  };
  const obtenerEventos = () => {
    getEventos()
      .then((result: Categoria[]) => {
        result && setEventosContables(result);
      })
      .catch(error => error);
  };

  const obtenerEventosContablesContabilidadManual = () => {
    getEventosContablesContabilidadManual()
      .then((result: EventosContablesContabilidadManualTypes[]) => {
        result && setEventosContablesContabilidadManual(result);
      })
      .catch(error => error);
  };

  const obtenerReferenciasContablesContabilidadManual = () => {
    getReferenciasContablesContabilidadManual()
      .then((result: ReferenciasContablesContabilidadManualTypes[]) => {
        result && setReferencias(result);
      })
      .catch(error => error);
  };

  const obtenerTiposPosventa = () => {
    getTiposPosventa()
      .then((result: PosventaTipo[]) => {
        result && setTiposPosventa(result);
      })
      .catch(error => error);
  };
  const obtenerCorresponsal = () => {
    getCorresponsal()
      .then((result: any) => {
        result && setTipoCorresponsal(result);
      })
      .catch(error => error);
  };

  const obtenerTiposAnaliticoGastoRebate = () => {
    getTiposAnaliticoGastoRebate()
      .then((result: any) => {
        setTiposAnaliticoGastoRebate(result);
      })
      .catch(() => {});
  };

  const obtenerTiposAnaliticoPrevisiones = () => {
    getTiposAnaliticoPrevisiones()
      .then((result: any) => {
        setTiposAnaliticoPrevisiones(result);
      })
      .catch(() => {});
  };

  const obtenerTiposDeResultados = () => {
    getTiposDeResultados()
      .then((result: any) => {
        setTiposDeResultados(result);
      })
      .catch(() => {});
  };

  const obtenerAplicaciones = () => {
    getAplicaciones()
      .then((result: Aplicaciones[]) => {
        setTiposAplicaciones(result);
      })
      .catch(() => {});
  };

  const obtenerTiposDeAvisos = () => {
    getTiposDeAvisos()
      .then((result: TipoDeAlertas[]) => {
        setTiposAvisos(result);
      })
      .catch(() => {});
  };

  const obtenerTipoDiferencia = () => {
    getTipoDiferenciaConciliacion()
      .then((result: TipoDiferenciaTypes[]) => {
        setTipoDiferencia(result);
      })
      .catch(() => {});
  };

  const obtenerTiposDeProcesos = () => {
    GetProcesoForFilter()
      .then((result: ProcesosForFilter[]) => {
        setProcesosForFilter(result);
      })
      .catch(() => {}); 
  };

  useEffect(() => {
    obtenerConceptos();
    obtenerNombresConceptos();
    obtenerFuncionalidadesEstados();
    obtenerEventos();
    obtenerEventosContablesContabilidadManual();
    obtenerReferenciasContablesContabilidadManual();
    obtenerExcepciones();
    obtenerMonedas();
    obtenerDocumentos();
    obtenerCentrosDeCosto();
    obtenerRubros();
    obtenerTiposPosventa();
    obtenerCorresponsal();
    obtenerTiposAnaliticoGastoRebate();
    obtenerTiposAnaliticoPrevisiones();
    obtenerTiposDeResultados();
    obtenerAplicaciones();
    obtenerTiposDeAvisos();
    obtenerTipoDiferencia();
    obtenerTiposDeProcesos();
  }, []);

  const updateView = async (v: View) => {
    setGS({ ...gS, views: [...gS.views, v] });
  };

  const [gS, setGS] = useState<State>({
    updateView,
    views: [],
  });

  const estados = useMemo(
    () => ({
      conceptos,
      setConceptos,
      nombresConceptos,
      setNombresConceptos,
      monedas,
      setMonedas,
      documentos,
      setDocumentos,
      centrosDeCosto,
      setCentrosDeCosto,
      rubros,
      setRubros,
      funcionalidades,
      setFuncionalidades,
      eventosContables,
      setEventosContables,
      eventosContablesContabilidadManual,
      setEventosContablesContabilidadManual,
      referencias,
      setReferencias,
      tiposPosventa,
      setTiposPosventa,
      excepciones,
      setExcepciones,
      loading,
      setLoading,
      tiposCorresponsal,
      setTipoCorresponsal,
      tiposAnaliticoGastoRebate,
      setTiposAnaliticoGastoRebate,
      tiposAnaliticoPrevisiones,
      setTiposAnaliticoPrevisiones,
      tiposDeResultados,
      setTiposDeResultados,
      tiposAplicaciones,
      setTiposAplicaciones,
      tiposAvisos,
      setTiposAvisos,
      tipoDiferencia,
      setTipoDiferencia,
      procesosForFilter,
      setProcesosForFilter,
    }),
    [
      conceptos,
      nombresConceptos,
      monedas,
      documentos,
      centrosDeCosto,
      rubros,
      loading,
      excepciones,
      funcionalidades,
      eventosContables,
      eventosContablesContabilidadManual,
      referencias,
      tiposPosventa,
      tiposCorresponsal,
      tiposAnaliticoGastoRebate,
      tiposAnaliticoPrevisiones,
      tiposDeResultados,
      tiposAplicaciones,
      tiposAvisos,
      tipoDiferencia,
      procesosForFilter,
    ]
  );

  return (
    <OverviewContext.Provider value={estados}>
      {children}
    </OverviewContext.Provider>
  );
};

OverviewProvider.displayName = 'OverviewProvider';

export default OverviewContext;
