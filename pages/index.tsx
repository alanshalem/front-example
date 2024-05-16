import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { themes } from '@brick/brand';
import { AppContainer, Layout } from '@brick/core';
import { AbmSimi } from '@components/AbmSimi/AbmSimi';
import AltaMasiva from '@components/AltaMasiva/AltaMasiva';
import Consultas from '@components/ConsultasAplicaciones/ConsultasAplicaciones';
import { ContabilidadMain } from '@components/Contabilidad/ContabilidadMain';
import { ContabilidadCrucesMain } from '@components/ContabilidadDeCruces/ContabilidadCrucesMain';
import CruceOpcamTopsMain from '@components/CruceOPCAMvsTOPS/CruceOpcamTopsMain';
import EsquemaContableMain from '@components/EsquemaContable/EsquemaContableMain';
import GastosRebatesMain from '@components/GastosRebates/GastosRebatesMain';
import GestionDeResultadosMain from '@components/GestionDeResultados/GestionDeResultadosMain';
import Home from '@components/Home/Home';
import OpcamMain from '@components/Opcam/OpcamMain';
import Posventa from '@components/Posventa/Posventa';
import PosventaReporte from '@components/PosventaReporte/PosventaReporte';
import PrevisionesMain from '@components/Previsiones/PrevisionesMain';
import { Proyectadas } from '@components/Proyectadas/Proyectadas';
import MainLayout from '@containers/MainLayout/MainLayout';
import { AuthProvider } from '@contexts/Auth/AuthContext';
import { OverviewProvider } from '@contexts/Overview';
import {
  Config,
  ErrorBoundary,
  Typings,
  UIContext,
  UIContextComponents,
} from '@galicia-toolkit/core';
import { Router } from '@reach/router';
import idx from 'idx';
import React from 'react';
import ConciliacionMasiva from '../components/ConciliacionMasiva/ConciliacionMasiva';
import Configuration from '../config';
import { callMsGraph, loginRequest } from '../config/msal-config';
import EsquemaContableConciliacionesMain from '@components/EsquemaContableConciliaciones/EsquemaContableConciliacionesMain';
import AlertasMain from '@components/Alertas/AlertasMain';
import ProcesosMain from '@components/Procesos/ProcesosMain';
import ConciliacionComexSAPMain from '@components/ConciliacionComexSAP/ConciliacionComexSAPMain';

declare global {
  interface Window {
    NEXT_PUBLIC_BFF_OASYS_BASE_URL: string;
    NEXT_PUBLIC_API_GATEWAY_BASEURL: string;
    NEXT_PUBLIC_API_COMEX_BASEURL: string;
    NEXT_APP_GALICIA_CDN_URL: string;
    NEXT_APP_CLIENT_ID: string;
    NEXT_APP_TENANT: string;
  }
}

interface IndexProps {
  user: Typings.User;
  config: Typings.Config;
  generalError?: any;
}
// It's important to add the configuration object before any Config.getAppConfig call
Config.addConfig(Configuration);
interface GraphData {
  displayName: string;
  jobTitle: string;
  mail: string;
}
const Index = (props: IndexProps) => {
  const { user, config } = props;
  const { instance, inProgress } = useMsal();
  const [graphData, setGraphData] = React.useState<null | GraphData>(null);
  const cdnBasepath = idx(config, _ => _.cdnBasepath) || '';
  const themeName = idx(user, _ => _.theme);
  const theme = themes[themeName] || themes.classic;

  React.useEffect(() => {
    if (!graphData && inProgress === InteractionStatus.None) {
      callMsGraph()
        .then(response => setGraphData(response))
        .catch(error => {
          if (error instanceof InteractionRequiredAuthError) {
            instance.acquireTokenRedirect({
              ...loginRequest,
              account: instance.getActiveAccount(),
            });
          }
        });
    }
  }, [inProgress, graphData, instance]);
  return (
    <Layout theme={theme} cdnBasepath={`${cdnBasepath}/assets`}>
      <ErrorBoundary.ErrorBoundary>
        <UIContext.Provider>
          <AppContainer variant="ofb">
            <OverviewProvider>
              <AuthProvider>
                <MainLayout />
                <Router>
                  <Home path="/" />
                  <AbmSimi path="/abm_contingencia_sira" />
                  <Proyectadas path="/gestion_proyectadas_manual" />
                  <AltaMasiva path="/gestion_proyectadas_masiva" />
                  <ContabilidadMain path="/corresponsales_cruces_reportes_consultas" />
                  <ConciliacionMasiva path="/corresponsales_cruces_masivos" />
                  <OpcamMain path="/opcam_reportes_consultas" />
                  <CruceOpcamTopsMain path="/opcam_preopcam_tops" />
                  <ContabilidadCrucesMain path="/contabilidad" />
                  <Posventa path="/posventa_generica" />
                  <PosventaReporte path="/posventa_reporte" />
                  <PrevisionesMain path="/previsiones" />
                  <Consultas path="/cmsaldodiario" />
                  <Consultas path="/cmsaldomensual" />
                  <GastosRebatesMain path="/gastos_rebates" />
                  <GestionDeResultadosMain path="/gestion_de_resultados" />
                  <EsquemaContableMain path="/esquema_contable" />
                  <EsquemaContableConciliacionesMain path="/abm_rubro_cc" />
                  <AlertasMain path="/alertas_conciliacion" />
                  <ProcesosMain path="/procesos" />
                  <ConciliacionComexSAPMain path="/conciliacion_comex_sap" />
                </Router>
              </AuthProvider>
            </OverviewProvider>
          </AppContainer>
          <UIContextComponents.SideDrawer />
          <UIContextComponents.Modal />
        </UIContext.Provider>
      </ErrorBoundary.ErrorBoundary>
    </Layout>
  );
};
Index.getInitialProps = async () => {
  return {
    ...Config.getAppConfig(),
  };
};

export default Index;
