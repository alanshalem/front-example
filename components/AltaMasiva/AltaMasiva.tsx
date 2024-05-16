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
import { Table } from '@brick/table';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import AuthContext from '@contexts/Auth/AuthContext';
import { tienePermisos } from '@lib/helpers/Auth.helpers';
import { createMasivoProyectadas } from '@lib/services/Proyectadas.services';
import { toBase64 } from '@lib/utils/blob';
import { accept } from '@lib/utils/variables';
import { RouteComponentProps } from '@reach/router';
import React, { useContext, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Subtitle, Title } from 'styles/CommonStyles';
import { acciones, funcionalidades } from '../../config/ConfigurationService';
interface ResponseInterface {
  name: string;
  type: string;
  size: string;
  errorServerText?: string;
}

export interface ProyectadaDuplicada {
  cuit: string;
  denominacion: string;
  codigoConcepto: string;
  raype: null | string;
  moneda: string;
  monto: string;
  montoUsd: number;
}

const AltaMasiva: React.FC<RouteComponentProps> = () => {
  const [filesUploaded, setFilesUploaded] = useState<any>([]);
  const [response, setResponse] = useState<ResponseInterface[]>();
  const [proyectadasDuplicadas, setProyectadasDuplicadas] = useState<
    ProyectadaDuplicada[]
  >([]);
  const [responseData, setHasResponseData] = useState<boolean>(false);
  const [infoTabla, setInfoTabla] = useState<any[]>();
  const [infoTablaDuplicados, setInfoTablaDuplicados] = useState<any[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [tieneErrores, setTieneErrores] = useState<boolean>(false);
  const [estaVacio, setEstaVacio] = useState<string>('');
  const [fechaProyectada, setFechaProyectada] = useState<string>('');
  const { accounts } = useMsal();
  const legajo = accounts[0].username.slice(0, 8);

  const authContext = useContext(AuthContext);

  //#region tabla de errores
  const rows: any[] = [];
  const columnas = [
    { dataField: 'error', text: 'Error', sort: true },
    { dataField: 'description', text: 'Descripcion', sort: true },
    { dataField: 'fila', text: 'Fila', sort: true },
  ];
  // ! Mapea los datos de la tabla
  const renderizarTabla = infoResponse => {
    if (!!infoResponse) {
      infoResponse.proyectadaExcelResult.forEach((e: any) => {
        return rows.push({
          error: e.propertyName.toUpperCase() ?? '-',
          description: e.descError ?? '-',
          fila: e.collectionIndex ?? '-',
        });
      });
      setInfoTabla(rows);
      setTieneErrores(infoResponse.status.hasErrors);
      setEstaVacio(infoResponse.status.statusCode);
    }
  };
  //#endregion
  //#region tabla de duplicadas
  const rowsDuplicadas: any[] = [];
  const columnasTablaDuplicados = [
    { dataField: 'cuit', text: 'CUIT', sort: true },
    { dataField: 'codigoConcepto', text: 'Codigo de Concepto', sort: true },
    { dataField: 'raype', text: 'RAYPE', sort: true },
    { dataField: 'beneficiario', text: 'Beneficiario', sort: true },
    {
      dataField: 'vinculada',
      text: 'Vinculada',
      sort: true,
    },
  ];
  // ! Mapea los datos de la tabla
  const renderizarTablaDuplicados = infoResponse => {
    if (!!infoResponse) {
      infoResponse.forEach((e: any) => {
        return rowsDuplicadas.push({
          cuit: e.cuit ?? '-',
          codigoConcepto: e.codigoConcepto ?? '-',
          raype: e.raype ?? '-',
          beneficiario: e.beneficiario ?? '-',
          vinculada: e.vinculada ?? '-',
        });
      });
      setInfoTablaDuplicados(rowsDuplicadas);
    }
  };
  //#endregion

  const retryUpload = () => {
    setTieneErrores(false);
    setHasResponseData(false);
  };

  // ! Funcion que envia el archivoExcelBase64 al backend
  const createMasivo = archivoExcelBase64 => {
    setLoading(true);
    createMasivoProyectadas(archivoExcelBase64, legajo).then((result: any) => {
      if (result) {
        setHasResponseData(true);
        renderizarTabla(result);
        renderizarTablaDuplicados(result.proyectadaDuplicates);
        setFechaProyectada(result.fechaProyectada);
        setProyectadasDuplicadas(result.proyectadaDuplicates);
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
    })
    .catch(() => {
      setResponse([
        {
          name: filesUploaded[0].name,
          type: filesUploaded[0].type,
          size: filesUploaded[0].size,
          errorServerText:
            'No se pudo cargar el archivo, por favor intenta de nuevo.',
        },
      ])
    });
    setLoading(false);
  };

  const subirArchivo = () => {
    toBase64(filesUploaded[0]).then((res: string) => {
      if (res) {
        createMasivo(res);
      }
    });
  };

  // UseEffect que transforma el excel a Base64 y llama al createMasivo
  useEffect(() => {
    if (filesUploaded.length > 0) {
      tienePermisos(
        funcionalidades.proyectada,
        acciones.masivo,
        authContext.permisos,
        () => subirArchivo()
      );
    }
  }, [filesUploaded]);

  const llamarExcel = () => {
    const data = 'CUIT;Concepto;RAYPE;Importe;Beneficiario;Vinculada';
    const blob = new Blob([data], { type: 'octet-stream' });
    const href = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href,
      style: 'display:none',
      download: 'plantilla.csv',
    });
    a.click();
    URL.revokeObjectURL(href);
    a.remove();
  };
  const resultBoolean = (): boolean => response === undefined

  return (
    <>
      <Title>
        <Typography variant="s1" className="my-2" weight="bold">
          Alta Masiva
        </Typography>
      </Title>
      <Subtitle>
        Recordá que tenes tiempo para calendarizar tus operaciones en la
        presentación del dia hasta las 15:00hs, luego quedan para el envío de
        mañana (72hs).
      </Subtitle>
      <div className="d-flex fs-4 m-32">
        <Button onClick={llamarExcel}>Descargar Plantilla</Button>
      </div>
      {/* UPLOAD */}
      {!tieneErrores && !responseData && (
        <Grid justify="center">
          <Grid.Item xs={6} className="mb-24">
            <Upload
              handlerFiles={file => setFilesUploaded(file)}
              response={response}
              infoText={
                'Debe ser un archivo excel con formato .xlsx o .xlsm de hasta 3 MB.'
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
      {!!fechaProyectada && !!responseData && (
        <Heading color="green" align="center" bold element="h2" variant="s2">
          Carga Exitosa!
          <span role="img" aria-label="green-tick-emoji">
            ✔️
          </span>
          <br />
          Tu fecha de proyeccion es: {fechaProyectada.split('T')[0]}
        </Heading>
      )}
      {proyectadasDuplicadas.length > 0 && !!responseData && (
        <>
          <Grid className="m-24">
            <Grid.Item xs={12} className="mb-24">
              <Card>
                <Collapse
                  title={{
                    main: (
                      <Typography bold variant="s3" color="state_warning">
                        Advertencia! Tu archivo posee proyectadas duplicadas.
                      </Typography>
                    ),
                  }}
                >
                  <Table
                    hover
                    data={infoTablaDuplicados}
                    columns={columnasTablaDuplicados}
                    pagination
                    sizePerPage={5}
                    paginationSize={5}
                    showPages
                    textEmpty={'No encontramos resultados.'}
                    iconEmpty="tooltip"
                  />
                </Collapse>
              </Card>
            </Grid.Item>
          </Grid>
        </>
      )}
      {tieneErrores && !!responseData && (
        <>
          <Divider spacingY={25} darkColor />
          <Alert
            variant="error"
            title="Cuidado! El archivo que subiste contiene errores de formato de datos internos o esta vacio."
            description="Considera solucionar estos conflictos y subir el archivo nuevamente."
            iconName="alert"
            className="mb-16 mx-32"
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
          <Grid>
            {estaVacio === '406' ? (
              <>
                <Heading
                  className="m-32"
                  color="red"
                  align="center"
                  bold
                  element="h3"
                  variant="s3"
                >
                  El archivo que subiste esta vacio. Intenta de nuevo.
                </Heading>
              </>
            ) : (
              <Grid.Item xs={12} className="mb-24">
                <Table
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
              </Grid.Item>
            )}
          </Grid>
        </>
      )}
      {responseData && (
        <Grid justify="end" className="mr-16">
          <Button onClick={retryUpload}>Volver a intentar</Button>
        </Grid>
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

export default AltaMasiva;
