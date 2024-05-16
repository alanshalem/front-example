/* eslint-disable react-hooks/exhaustive-deps */
import { useMsal } from '@azure/msal-react';
import {
  Alert,
  Button,
  Card,
  Collapse,
  Divider,
  Grid,
  Heading,
  Typography,
  Upload,
} from '@brick/core';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import AuthContext from '@contexts/Auth/AuthContext';
import { tienePermisos } from '@lib/helpers/Auth.helpers';
import { createMasivoCruces } from '@lib/services/Contabilidad.services';
import { toBase64 } from '@lib/utils/blob';
import { transformArray } from '@lib/utils/ConciliacionMasivaUtil';
import { getMonthName } from '@lib/utils/Date';
import { accept } from '@lib/utils/variables';
import { RouteComponentProps } from '@reach/router';
import React, { useContext, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { acciones, funcionalidades } from '../../config/ConfigurationService';
import { ConciliacionMasivaTitle } from './ConciliacionMasivaStyles';
import { Table, TableToolkit } from '@brick/table';
interface ResponseInterface {
  name: string;
  type: string;
  size: string;
  errorServerText?: string;
}

const ConciliacionMasiva: React.FC<RouteComponentProps> = () => {
  const [filesUploaded, setFilesUploaded] = useState<any>([]);
  const [response, setResponse] = useState<ResponseInterface[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [tieneErrores, setTieneErrores] = useState<boolean>(false);
  const [estaVacio, setEstaVacio] = useState<boolean>(false);
  const [cargaCorrecta, setCargaCorrecta] = useState<boolean>(false);
  const [cargaIncorrecta, setCargaIncorrecta] = useState<boolean>(false);
  const [responseData, setHasResponseData] = useState<boolean>(false);
  const { accounts } = useMsal();
  const legajo = accounts[0].username.slice(0, 8);
  const authContext = useContext(AuthContext);
  const [infoTabla, setInfoTabla] = useState<any[]>();
  const [tieneParaAnalizar, setTieneParaAnalizar] = useState<any>();
  const [paraAnalizar, setParaAnalizar] = useState<any>();
  const rows: any[] = [];

  const columnas = [
    { dataField: 'sector', text: 'Sector', sort: true },
    { dataField: 'codcta', text: 'Corresponsal', sort: true },
    { dataField: 'origen', text: 'Origen', sort: true },
    { dataField: 'fhcontable', text: 'Fecha Contable', sort: true },
    { dataField: 'numop1', text: 'Num Op 1', sort: true },
    { dataField: 'numop2', text: 'Num Op 2', sort: true },
    {
      dataField: 'debe',
      text: 'Debe',
      sort: true,
      currency: '$',
      arsCurrencyFormat: true,
      currencyPosition: 'before',
    },
    {
      dataField: 'haber',
      text: 'Haber',
      sort: true,
      currency: '$',
      arsCurrencyFormat: true,
      currencyPosition: 'before',
    },
    {
      dataField: 'diferencia',
      text: 'Diferencia',
      sort: true,
      currency: '$',
      arsCurrencyFormat: true,
      currencyPosition: 'before',
    },
    { dataField: 'fhproceso', text: 'Fecha Proceso', sort: true },
  ];
  const date = new Date();

  const downloadExcelCrucesMasivos = arrayDeObjetosCruces => {
    const header =
      'Sector;Corresponsal;Origen;Fecha Contable; Num Op 1; Num Op 2; Debe; Haber; Diferencia; Fecha Proceso\n';
    const arrayDeCruces = arrayDeObjetosCruces.map(obj => [
      obj.sector,
      obj.codcta,
      obj.origen,
      obj.fhcontable,
      obj.numop1,
      obj.numop2,
      obj.debe,
      obj.haber,
      obj.diferencia,
      obj.fhproceso,
    ]);
    const result = header + arrayDeCruces.map(row => row.join(';')).join('\n');
    const blob = new Blob([result], { type: 'octet-stream' });
    const href = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href,
      style: 'display:none',
      download: `partidas_pendientes_regularizacion_${date.getDate()}-${getMonthName(
        date.getMonth()
      )}-${date.getFullYear()}_${date.getHours()}.${(date.getMinutes() < 10
        ? '0'
        : '') + date.getMinutes()}.csv`,
    });
    a.click();
    URL.revokeObjectURL(href);
    a.remove();
  };

  // ! Mapea los datos de la tabla
  const renderizarTabla = infoResponse => {
    if (!!infoResponse) {
      infoResponse.forEach((e: any) => {
        return rows.push({
          sector: e.sector ?? '-',
          codcta: e.codcta ?? '-',
          origen: e.origen ?? '-',
          fhcontable: e.fhcontable ?? '-',
          numop1: e.numop1 ?? '-',
          numop2: e.numop2 ?? '-',
          debe: e.debe ?? '-',
          haber: e.haber ?? '-',
          diferencia: e.diferencia ?? '-',
          fhproceso: e.fhproceso ?? '-',
        });
      });
      setInfoTabla(rows);
    }
  };

  const retryUpload = () => {
    setTieneErrores(false);
    setHasResponseData(false);
  };

  // ! Funcion que envia el archivoExcelBase64 al backend
  const createMasivo = (archivoExcelBase64: string) => {
    setLoading(true);
    createMasivoCruces(archivoExcelBase64, legajo).then((result: any) => {
      if (result) {
        setHasResponseData(true);
        setTieneParaAnalizar(!!result.paraAnalizar);
        setParaAnalizar(result.paraAnalizar);
        downloadExcelCrucesMasivos(result.paraAnalizar);
        const nuevaTablaConNumber = transformArray(result.paraAnalizar);
        renderizarTabla(nuevaTablaConNumber);
        let isOk = result.hasErrors ? false : true;
        isOk ? setCargaCorrecta(true) : setCargaIncorrecta(true);
        setTieneErrores(result.hasErrors);
        setEstaVacio(!result);
        setResponse([
          {
            name: filesUploaded[0].name,
            type: filesUploaded[0].type,
            size: filesUploaded[0].size,
            errorServerText: result.status.hasErrors
              ? 'Cuidado! Tu archivo tiene errores'
              : '',
          },
        ]);
      } else {
        setResponse([
          {
            name: filesUploaded[0].name,
            type: filesUploaded[0].type,
            size: filesUploaded[0].size,
            errorServerText:
              'No se pudo cargar el archivo, por favor intenta de nuevo.',
          },
        ]);
      }
    });
    setLoading(false);
  };

  // UseEffect que transforma el excel a Base64 y llama al createMasivo
  useEffect(() => {
    if (filesUploaded.length > 0) {
      tienePermisos(
        funcionalidades.crucesContables,
        acciones.masivo,
        authContext.permisos,
        () => {
          toBase64(filesUploaded[0]).then((res: string) => {
            if (res) {
              createMasivo(res);
            }
          });
        }
      );
    }
  }, [filesUploaded]);
  const resultBoolean = (): boolean => response === undefined;
  return (
    <>
      <Typography variant="s1" className="my-2" weight="bold">
        <ConciliacionMasivaTitle>
          Conciliación de corresponsales
        </ConciliacionMasivaTitle>
      </Typography>
      {/* UPLOAD */}
      {!tieneErrores && !responseData && (
        <Grid justify="center">
          <Grid.Item xs={6} className="mb-24">
            <Upload
              handlerFiles={file => {
                setFilesUploaded(file);
              }}
              response={response}
              infoText={
                'Debe ser un archivo excel con formato .xslx o .xlsm de hasta 3 MB.'
              }
              errorText={'Error al cargar'}
              accept={accept}
              maxFiles={1}
              maxSize={3000000}
              cleanFiles={resultBoolean()}
            >
              <Upload.Action type="button">
                Hacé click acá o arrastrá tus archivos
              </Upload.Action>
            </Upload>
          </Grid.Item>
        </Grid>
      )}
      {cargaCorrecta && responseData && (
        <Heading color="green" align="center" bold element="h2" variant="s2">
          Carga Exitosa!
          <span role="img" aria-label="green-tick-emoji">
            ✔️
          </span>
        </Heading>
      )}
      {cargaIncorrecta && (
        <Heading
          transform="capitalize"
          color="red"
          align="center"
          bold
          element="h2"
          variant="s2"
        >
          ¡Cuidado! Carga incorrecta. El archivo que subiste contiene errores
          internos o esta vacio.
          <span role="img" aria-label="green-tick-emoji">
            ❌
          </span>
        </Heading>
      )}
      {tieneErrores && (
        <>
          <Divider spacingY={25} darkColor />
          <Alert
            variant="error"
            title="Cuidado! El archivo que subiste contiene errores de formato de datos internos o esta vacio."
            description="Considera solucionar estos conflictos y subir el archivo nuevamente."
            iconName="alert"
            className="mb-16"
          />
          <Heading
            transform="capitalize"
            color="red"
            align="center"
            bold
            element="h2"
            variant="s2"
          >
            Errores:
          </Heading>
          <Grid justify="center">
            {estaVacio && (
              <>
                <Heading
                  color="red"
                  align="center"
                  bold
                  element="h4"
                  variant="s4"
                >
                  El archivo que subiste esta vacio. Intenta de nuevo.
                </Heading>
              </>
            )}
          </Grid>
        </>
      )}
      {tieneParaAnalizar && responseData && (
        <>
          <Grid className="m-24">
            <Grid.Item xs={12} className="mb-24">
              <Card>
                <Collapse
                  title={{
                    main: (
                      <Typography bold variant="s3" color="state_warning">
                        Partidas pendientes de análisis para su regularización.
                      </Typography>
                    ),
                  }}
                >
                  <TableToolkit
                    keyField="id"
                    data={infoTabla}
                    columns={columnas}
                    widthFix
                  >
                    {props => (
                      <>
                        <div className="d-flex justify-content-center">
                          <Button
                            onClick={() =>
                              downloadExcelCrucesMasivos(paraAnalizar)
                            }
                            variant="primary"
                            size="regular"
                            className="p-12"
                          >
                            Exportar
                          </Button>
                        </div>
                        <Table
                          {...props.baseProps}
                          hover
                          data={infoTabla}
                          columns={columnas}
                          pagination
                          sizePerPage={5}
                          paginationSize={5}
                          showPages
                          textEmpty={'No encontramos resultados.'}
                          iconEmpty="tooltip"
                        />
                      </>
                    )}
                  </TableToolkit>
                </Collapse>
              </Card>
            </Grid.Item>
            {responseData && (
              <Grid justify="end" className="mr-16 mb-16">
                <Button onClick={retryUpload}>Volver a intentar</Button>
              </Grid>
            )}
          </Grid>
        </>
      )}
      {loading && <LoadingGalicia />}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </>
  );
};

export default ConciliacionMasiva;
