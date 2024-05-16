## Setup Básico

- `NodeJS 14.17.0+` instalado

- Se debe crear un archivo `.npmrc` en el directorio raíz del proyecto para utilizar el **Nexus Corporativo**:

.npmrc

```
registry=http://nexus.bancogalicia.com.ar/repository/npm-group/
always-auth=true
```

**Nota:** se deberá obtener un token de Nexus siguiendo las siguientes [instrucciones](https://help.sonatype.com/repomanager2/node-packaged-modules-and-npm-registries#NodePackagedModulesandnpmRegistries-EncodingCredentialsonLinux)

- `git clone https://github.bancogalicia.com.ar/exoa-oasys/oasys-front.git`
- `npm i` para instalar las dependencias sobre la carpeta del proyecto

- Para ejecutar correctamente el proyecto de manera local crear el archivo `env-config.js` en la carpeta `public/conf` con las siguientes variables:

env-config.js

```
window.ENV='dev'
window.IsStandAlone=true
window.NEXT_PUBLIC_API_OASYS_BASE_URL = "http://oasys-exoa-oasys-dev.devcloud.bancogalicia.com.ar"
window.NEXT_PUBLIC_API_GATEWAY_BASEURL = "https://gateway-exto-tops-dev.devcloud.bancogalicia.com.ar"
window.NEXT_PUBLIC_API_COMEX_BASEURL = "https://secopa-exse-secopa-dev.devcloud.bancogalicia.com.ar"
window.NEXT_APP_GALICIA_CDN_URL = "https://static-pre.bancogalicia.com.ar/"
```

- `npm run dev:mock` para iniciar la aplicación en modo desarrollo

Para correr los test se instalo jest y react-testing-library.
Se agrego el archivo setupTests.js y se modifico el archivo jest.config.js para que reconozca los absolute paths de typescript. Tambien se instalaron paquetes de npm tales como polyfill y ts jest
