import user from './user';
import { Typings } from '@galicia-toolkit/core';
import { MODULE_ID } from './constants.js';

const appBasepath = '';
const channelId = 'officebankingplatform';
const currentModule = MODULE_ID.PARENT;
const apiBasepath = '/bff';
const cdnBasepath = 'https://static-pre.bancogalicia.com.ar/';
const capaccesstoken =
  'https://cap-access-token-handler-v2-poca-cap-int.stgcloud.bancogalicia.com.ar/v2/pom';

const bffEndpoints = {
  'local-mock': apiBasepath,
  'local-bff': 'http://localhost:8080',
  'local-pom':
    'https://bff-creatnity-crea-reactnity-dev.devcloud.bancogalicia.com.ar',
  dev: 'https://bff-creatnity-crea-reactnity-dev.devcloud.bancogalicia.com.ar',
  int: 'https://bff-creatnity-crea-reactnity-int.stgcloud.bancogalicia.com.ar',
  qas: 'https://bff-creatnity-crea-reactnity-qas.stgcloud.bancogalicia.com.ar',
  stg: 'https://bff-creatnity-crea-reactnity-qas.stgcloud.bancogalicia.com.ar',
  latest:
    'https://bff-creatnity-crea-reactnity-prd.prdcloud.bancogalicia.com.ar',
};
const refreshEndpoints = {
  'local-mock': apiBasepath,
  'local-pom': capaccesstoken,
  dev: capaccesstoken,
  int: capaccesstoken,
  qas:
    'https://cap-access-token-handler-v2-poca-cap-qas.stgcloud.bancogalicia.com.ar/v2/pom/',
  stg:
    'https://cap-access-token-handler-v2-poca-cap-qas.stgcloud.bancogalicia.com.ar/v2/pom/',
  latest: 'https://capaccess-v2.api.bancogalicia.com.ar/v2/pom',
};

const baseDeployConfig: (env: string) => Typings.AppConfig = env => ({
  user,
  currentModule,
  config: {
    debug: false,
    channelId,
    cookieDomain: '',
    appBasepath,
    cdnBasepath,
    distributionChannel: env,
    api: {
      bff: {
        basepath: bffEndpoints[env],
      },
      refresh: {
        basepath: refreshEndpoints[env],
      },
    },
  },
});

const localConfig: { [key: string]: Typings.AppConfig } = {
  'local-mock': baseDeployConfig('local-mock'),
  'local-bff': baseDeployConfig('local-bff'),
  'local-pom': baseDeployConfig('local-pom'),
  dev: baseDeployConfig('dev'),
  int: baseDeployConfig('int'),
  qas: baseDeployConfig('qas'),
  stg: baseDeployConfig('stg'),
  latest: baseDeployConfig('latest'),
};

export default localConfig;
