export const getURLs = () => {
  return {
    //#region PROYECTADAS
    GetProyectadas:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.ProyectadasBase,
    PostFiltroProyectadas:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.ProyectadasBase +
      Routes.ProyectadasFiltroBase,
    CheckProyectadasDuplicadas:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.ProyectadasBase +
      Routes.ProyectadasCheckDuplicada,
    GetProyectadasExportBcra:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.ProyectadasBase +
      Routes.ExportBcra,
    PostCreateMasivo:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.ProyectadasBase +
      Routes.ProyectadaCreateMasivo, 
    GetProyectadasVsOpcam:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.ProyectadasBase +
      Routes.GetProyectadasVsOpcam,
    //#endregion

    //#region CRUCES CONTABLES
    GetCruces:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL + baseAPIs.bff + Routes.CrucesBase,
    PostFiltroCruces:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.CrucesBase +
      Routes.CrucesFiltroBase,
    CheckCrucesDuplicadas:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.CrucesBase +
      Routes.ProyectadasCheckDuplicada,
    GetCrucesExportBcra:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.CrucesBase +
      Routes.ExportBcra,
    PostCreateMasivoCruces:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.CrucesBase +
      Routes.CrucesCreateMasivo,
    GetOpcamDaily:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL + baseAPIs.bff + Routes.OpcamBase,
    PostOpcamFilter:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.OpcamBase +
      Routes.OpcamFilters,
    ExportOpcamByFilter:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.OpcamBase +
      Routes.ExportByFilter,
    DeleteCruces:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL + baseAPIs.bff + Routes.CrucesBase,
    //#endregion

    //#region CRUCE OPCAM VS ANALITICO TOPS
    PostConciliacionDeBoletosOpcamTopsFilter:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.ConciliacionBoletoByFilter,
    GetCruceOpcamTopsDiaHabil:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.ConciliacionBoletoByDiaHabil,
    //#endregion

    //#region CONTABILIDAD DE CRUCES
    PostContabilidadCrucesByFilter:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.ContabilidadCrucesBase +
      Routes.CrucesFiltroBase,
    FirmarContabilidades:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.ContabilidadCrucesBase +
      Routes.FirmarContabilidad,

    LoadContabilidadManual:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.ContabilidadCrucesBase +
      Routes.LoadContabilidadManual,

    SimularContabilidadManual:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.ContabilidadCrucesBase +
      Routes.SimularContabilidadManual,

    GuardarContabilidadManual:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.ContabilidadCrucesBase +
      Routes.GuardarContabilidadManual,
    //#endregion

    //#region BOLETO SIMI/SIRA
    GetBoletoSimi:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.BoletoSimiBase,
    PostFiltroBoletoSimi:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.BoletoSimiBase +
      Routes.BoletoSimiFiltroBase,
    GetExcepcionesBoletos:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.BoletoSimiBase +
      Routes.ExcepcionesBoletoSimiBase,
    CheckBoletoDuplicado:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.BoletoSimiBase +
      Routes.CheckDuplicado,
    //#endregion

    //#region ANALITICOS
    GetSimulacionAnalitico:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.AnaliticosBase +
      Routes.SimularAnalitico,
    CreateAnalitico:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.AnaliticosBase +
      Routes.GuardarAnalitico,
    //#endregion

    //#region PERMISOS
    GetPermisosUsuario:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PermisosUsuario,
    //#endregion

    //#region URLs PROVISORIAS OASYS
    GetPersonasOasys:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.ProyectadasBase +
      Routes.PersonasOasys,
    //#endregion

    //#region URLs EXTERNAS OASYS
    GetSolicitudOP:
      window.NEXT_PUBLIC_API_GATEWAY_BASEURL +
      baseAPIs.suffix +
      baseAPIs.version +
      Routes.GetSolicitudOP,
    GetConceptosBoletos:
      window.NEXT_PUBLIC_API_COMEX_BASEURL +
      baseAPIs.suffix +
      baseAPIs.version +
      Routes.GetConceptosBoletos,
    GetMonedas:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL + baseAPIs.bff + Routes.GetMonedas,
    GetDocumentos:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.GetDocumentos,
    GetCentrosDeCosto:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.GetCentrosDeCosto,
    GetRubrosCommon:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.GetRubrosCommon,
    GetEstados:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.GetEstadosFuncionalidades,
    GetEventos:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.GetEventosContables,
    GetEventosContablesContabilidadManual:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.GetEventosContablesContabilidadManual,
    GetReferenciasContablesContabilidadManual:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.ContabilidadCrucesBase +
      Routes.GetReferenciasContablesContabilidadManual,
    GetAplicaciones:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.GetAplicaciones,
    //#endregion

    //#region POSVENTA
    GetPosventa:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosventaBase +
      Routes.GetByNumeroOperacion,
    GetPosventaByFilter:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosventaBase +
      Routes.PosventaByFilter,
    ExportPosventaByFilter:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosventaBase +
      Routes.ExportByFilter,
    GetPosventaReporteriaByFilter:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosventaBase +
      Routes.PosventaReporteriaByFilter,
    GuardarPosventa:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosventaBase +
      Routes.GuardarPosventa,
    AprobarPosventas:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosventaBase +
      Routes.AprobarPosventa,
    RechazarPosventas:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosventaBase +
      Routes.RechazarPosventa,
    GetSolicitudesPosventaGenerica:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosventaBase +
      Routes.GetSolicitudesPosventaGenerica,
    GuardarPosventaGenerica:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosventaBase +
      Routes.GuardarPosventaGenerica,
    GetAllPosventaTipo:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosventaTipo +
      Routes.PosventaTipoGetAll,
    
    ValidarBoletoPosventaGenerica: 
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosventaBase +
      Routes.ValidarBoletoPosventaGenerica,

    GuardarBoletoPosventaGenerica: 
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosventaBase +
      Routes.GuardarBoletoPosventaGenerica,
    //#endregion

    //#region POSVENTA PARAMETRIA
    GetByIdPosventaTipo:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosVentaParametria +
      Routes.GetByIdPosventaTipo,
    GetNombresConceptos:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosVentaParametria +
      Routes.GetAllNames,
    // Consultas
    GetConsultasSaldoDiarioByFilter:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.ConsultasBase +
      Routes.GetSaldoDiarioByFilter,
    GetConsultasSaldoMensualByFilter:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.ConsultasBase +
      Routes.GetSaldoMensualByFilter,
    GetConsultasSaldoCasa:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.ConsultasBase +
      Routes.GetSaldoCasa,
    GetConsultasSaldoRubro:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.ConsultasBase +
      Routes.GetSaldoRubro,
    GetConsultasSaldoDivisa:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.ConsultasBase +
      Routes.GetSaldoDivisa,
    //#endregion

    //#region PREVISIONES
    GetPrevisionesByFilter:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PrevisionesBase +
      Routes.PrevisionesFilter,
    PostPrevision:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PrevisionesBase +
      Routes.GuardarPrevision,
    AprobarPrevision:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PrevisionesBase +
      Routes.AprobarPrevision,
    //#endregion

    //#region CORRESPONSAL
    GetCorresponsal:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.GetCorresponsal,

    GetGastosRebatesByFilter:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.GastosRebatesBase +
      Routes.GetGastosRebates,

    GetTiposAnaliticoGastoRebates:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.AnaliticoContableBase +
      Routes.GetTiposAnaliticoGastoRebate,

    GetTiposAnaliticoPrevisiones:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.AnaliticoContableBase +
      Routes.GetTiposAnaliticoPrevisiones,
    //#endregion

    //#region GASTOS REBATES
    PostGastoRebate:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.GastosRebatesBase +
      Routes.SaveGastoRebate,

    AvanzarCalendarizada:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.GastosRebatesBase +
      Routes.AvanzarCalendarizada,

    AprobarGastoRebate:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.GastosRebatesBase +
      Routes.AprobarGastoRebate,

    RechazarGastoRebate:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.GastosRebatesBase +
      Routes.RechazarGastoRebate,
    //#endregion

    //#region GESTION DE RESULTADOS
    GestionDeResultadosByFilter:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.GestionDeResultadosBase +
      Routes.GestionDeResultadosFilter,

    GetTiposDeResultados:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.GestionDeResultadosBase +
      Routes.TiposDeResultados,

    GuardarGestionDeResultado:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.GestionDeResultadosBase +
      Routes.GuardarPrevisionGestionResultado,

    AprobarGestionResultado:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.GestionDeResultadosBase +
      Routes.AprobarPrevision,
    //#endregion

    //#region ESQUEMAS CONTABLES
    EventosContablesAplicacionByFilter:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.EventosContable +
      Routes.EventosContablesAppByFilter,
    //#endregion

    //#region RUBROS
    GetRubros:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.Rubros +
      Routes.GetRubros,
    CreateRubroCCDivisa:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.Rubros +
      Routes.CreateRubroCCDivisa,
    DeleteRubroCCDivisa:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.Rubros +
      Routes.DeleteRubroCCDivisa,
    UpdateRubroCCDivisa:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.Rubros +
      Routes.UpdateRubroCCDivisa,
    //#endregion

    //#region PROCESOS
    GetProcesoForFilter:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosventaBase +
      Routes.ProcesoForFilter,
    GetProcesoByClassName:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosventaBase +
      Routes.ProcesoByClassName,
    GetProcesoResultadoByFilter:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosventaBase +
      Routes.ProcesoResultadoByFilter,
    CreateProceso:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosventaBase +
      Routes.CreateProceso,
    CreateProcesoResultado:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosventaBase +
      Routes.CreateProcesoResultado,
    UpdateProceso:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosventaBase +
      Routes.UpdateProceso,
    UpdateProcesoResultado:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.PosventaBase +
      Routes.UpdateProcesoResultado,
    //#endregion

    //#region AVISOS
    GetTiposAvisos:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.Avisos +
      Routes.GetTiposAvisos,
    GetAvisosByFilter:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.Avisos +
      Routes.GetAvisosByFilter,

    //#endregion

    //#region CONCILIACION COMEX - SAP
    GetTipoDiferencia:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.Conciliacion +
      Routes.GetTipoDiferencia,
    GetConciliacionComexSAPByFilter:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.Conciliacion +
      Routes.ConciliacionComexSapByFilter,
    ExportConciliacionComexSAPByFilter:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.Conciliacion +
      Routes.ConciliacionComexSapExport,
    AsignarConciliacionComexSAP:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.Conciliacion +
      Routes.ConciliacionComexSapAsignar,
    FinalizarConciliacionComexSAP:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.Conciliacion +
      Routes.ConciliacionComexSapFinalizar,
    GetObservacionComexSAP:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.Conciliacion +
      Routes.GetObservacionComexSap,
    CreateObservacionComexSAP:
      window.NEXT_PUBLIC_BFF_OASYS_BASE_URL +
      baseAPIs.bff +
      Routes.Conciliacion +
      Routes.CreateObservacionComexSap,
    //#endregion
  };
};

const Routes = {
  //#region PROYECTADAS
  ConsultasBase: 'Consultas',
  PosventaBase: 'PosVenta',
  PosventaTipo: 'PosVentaTipo',
  PosventaTipoGetAll: '/GetAll',
  PosVentaParametria: 'PosVentaParametria',
  GetByIdPosventaTipo: '/GetByIdPosVentaTipo',
  GetAllNames: '/GetAllNames',
  ProyectadasBase: 'Proyectada',
  BoletoSimiBase: 'Simi',
  ExcepcionesBoletoSimiBase: '/Excepciones',
  CheckDuplicado: '/CheckDuplicada',
  ProyectadasFiltroBase: '/Proyectadas',
  GetProyectadasVsOpcam: '/GetFechaProyectadaVsOpcam',
  ProyectadasCheckDuplicada: '/CheckDuplicada',
  BoletoSimiFiltroBase: '/SimiByFilters',
  ProyectadaCreateMasivo: '/CreateMasivo',
  GetSolicitudOP: '/common/consultacliente/getdatospersonas',
  GetConceptosBoletos: '/Comex/ConceptosBoletos',
  GetMonedas: 'Common/GetMonedas',
  GetDocumentos: 'Common/GetDocumentos',
  GetCentrosDeCosto: 'Common/GetCentrosDeCosto',
  GetRubrosCommon: 'Common/GetRubros',
  GetEstadosFuncionalidades: 'Estados/GetAll',
  GetEventosContables: 'EventoContables/GetAll',
  GetEventosContablesContabilidadManual:
    'EventoContables/GetContabilidadManual',
  LoadContabilidadManual: '/LoadContabilidadManual',
  SimularContabilidadManual: '/SimularContabilidadManual',
  GuardarContabilidadManual: '/GuardarContabilidadManual',
  GetReferenciasContablesContabilidadManual: '/GetTipoReferencia',
  ExportBcra: '/ExportTxt',
  GetAplicaciones: 'Common/GetAplicaciones',
  //#endregion

  //#region CRUCES CONTABLES
  CrucesBase: 'CrucesContables',
  ContabilidadCrucesBase: 'Contabilidad',
  AnaliticosBase: 'Simulacion',
  CrucesCreateMasivo: '/CruceMasivo',
  OpcamBase: 'opcam',
  OpcamFilters: '/preOPCAMByFilter',
  ConciliacionBoletoByFilter: 'Conciliacion',
  ConciliacionBoletoByDiaHabil: 'Conciliacion',
  PermisosUsuario: 'Permisos',
  PersonasOasys: '/GetPersona',
  SimularAnalitico: '/GenerarSimulacionAnalitico',
  GuardarAnalitico: '/GuardarSimulacionAnalitico',
  //#endregion

  //#region POSVENTA
  CrucesFiltroBase: '/ByFilter',
  FirmarContabilidad: '/Aprobacion',
  AprobarPosventa: '/AprobarPosventas',
  RechazarPosventa: '/RechazarPosventas',
  GetSolicitudesPosventaGenerica: '/GetSolicitudesGenerica',
  GuardarPosventaGenerica: '/GuardarPosVentaGenerica',
  GetByNumeroOperacion: '/GetByNumeroOperacion',
  PosventaByFilter: '/ByFilter',
  ExportByFilter: '/Export',
  PosventaReporteriaByFilter: '/PosVentaReporteria',
  ExportPosventa: '/Export',
  GuardarPosventa: '/GuardarPosventa',
  GetSaldoDiarioByFilter: '/SaldoDiario/ByFilter',
  GetSaldoMensualByFilter: '/SaldoMensual/ByFilter',
  GetSaldoCasa: '/SaldoCasa',
  GetSaldoRubro: '/SaldoRubro',
  GetSaldoDivisa: '/SaldoDivisa',
  ValidarBoletoPosventaGenerica: '/ValidarBoletoPosventaGenerica',
  GuardarBoletoPosventaGenerica: '/GuardarBoletoPosventaGenerica',
  //#endregion

  //#region PREVISIONES
  PrevisionesBase: 'Prevision',
  PrevisionesFilter: '/GetByFilter',
  GetCorresponsal: 'Corresponsal',
  GuardarPrevision: '/GuardarPrevision',
  AprobarPrevision: '/AprobarPrevision',
  //#endregion

  //#region GASTOS REBATES
  GastosRebatesBase: 'GastoRebate',
  GetGastosRebates: '/GetByFilter',
  AnaliticoContableBase: 'AnaliticoContable',
  GetTiposAnaliticoPrevisiones: '/GetTiposAnaliticoPrevisiones',
  GetTiposAnaliticoGastoRebate: '/GetTiposAnaliticoGastoRebate',
  SaveGastoRebate: '/SaveGastoRebate',
  AvanzarCalendarizada: '/AvanzarCalendarizada',
  AprobarGastoRebate: '/AprobarGastoRebate',
  RechazarGastoRebate: '/RechazarGastoRebate',
  //#endregion

  //#region GESTION DE RESULTADOS
  GestionDeResultadosBase: 'GestionResultados',
  GestionDeResultadosFilter: '/GetByFilter',
  TiposDeResultados: '/GetTiposResultados',
  GuardarPrevisionGestionResultado: '/GuardarPrevision',
  AprovarPrevisionGestionResultado: '/AprobarPrevision',
  //#endregion

  //#region ESQUEMAS CONTABLES
  EventosContable: 'EventosContables',
  EventosContablesAppByFilter: '/EventosContablesAplicacionByFilter',
  Rubros: 'RubroCentroDivisa',
  GetRubros: '/RubroCCDivisaByFilter',
  CreateRubroCCDivisa: '/CreateRubroCCDivisa',
  DeleteRubroCCDivisa: '/DeleteRubroCCDivisa',
  UpdateRubroCCDivisa: '/UpdateRubroCCDivisa',
  //#endregion

  //#region PROCESOS
  ProcesoForFilter: '/GetProcesoForFilter',
  ProcesoByClassName: '/GetProcesoByClassName',
  ProcesoResultadoByFilter: '/GetProcesoResultadoByFilter',
  CreateProceso: '/CreateProceso',
  CreateProcesoResultado: '/CreateProcesoResultado',
  UpdateProceso: '/UpdateProceso',
  UpdateProcesoResultado: '/UpdateProcesoResultado',
  //#endregion

  //#region AVISOS
  Avisos: 'Avisos',
  GetTiposAvisos: '/GetTiposAvisos',
  GetAvisosByFilter: '/ByFilter',
  //#endregion

  //#region CONCILIACION COMEX - SAP
  Conciliacion: 'Conciliacion',
  GetTipoDiferencia: '/GetTipoDiferencia',
  ConciliacionComexSapByFilter: '/GetConciliacionComexSapByFilter',
  ConciliacionComexSapExport: '/ConciliacionComexSapExport',
  GetObservacionComexSap: '/GetObservacion',
  CreateObservacionComexSap: '/CreateObservacion',
  ConciliacionComexSapAsignar: '/Asignar',
  ConciliacionComexSapFinalizar: '/Finalizar',
  //#endregion
};


const baseAPIs = {
  suffix: '/api/',
  bff: '/bff/',
  version: 'v1',
};

export const funcionalidades = {
  posventa: 'Posventa',
  proyectada: 'Proyectadas',
  simi: 'Simi',
  contabilidad: 'Contabilidad',
  crucesContables: 'Cruces',
  prevision: 'Prevision',
  gastosRebates: 'Gastos y Rebates',
  conciliacionComexSAP: 'ConciliacionComexSAP',
};

export const acciones = {
  masivo: 'masivo',
  manual: 'manual',
  delete: 'delete',
  update: 'update',
  read: 'read',
  import: 'import',
  export: 'export',
  sign: 'sign',
};
