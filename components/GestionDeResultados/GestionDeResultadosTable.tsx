import React, { useEffect, useState, useCallback, useContext } from 'react';
import { EstadosChip } from '@lib/helpers/EstadosPrevisiones.helpers';
import { GenericTable } from '@components/Generic/GenericTable';
import { toastCallAux } from '@components/Toast/Toast.helpers';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';
import { Dropdown} from '@brick/core';
import { TableToolkit } from '@brick/table';
import { tienePermisos } from '@lib/helpers/Auth.helpers';
import { funcionalidades, acciones } from '../../config/ConfigurationService';
import AuthContext from '@contexts/Auth/AuthContext';
import { useMsal } from '@azure/msal-react';
import { CustomTextInputGestionResultados } from './CustomTextInputGestionResultados';
import { mesActual } from '@lib/helpers/Previsiones.helpers';
import {
  guardarPrevisionGestionDeResultados,
  realizarAprobacionGestionDeResultados,
} from '@lib/helpers/GestionDeResultados.helpers';

type Props = {
  previsiones: any[]; // por ahora any despues tipear
  setGestionDeResultadosList: React.Dispatch<React.SetStateAction<any[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  tiposAnaliticoPrevisionesMemo: ItemDropdown[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  periodo: string;
};

const GestionDeResultadosTable = ({
  previsiones,
  tiposAnaliticoPrevisionesMemo,
  setGestionDeResultadosList,
  setLoading,
  setRefresh,
  periodo,
}: Props) => {
  const authContext = useContext(AuthContext);
  const { accounts } = useMsal();
  const [info, setInfo] = useState<any[]>([]);
  const previsionesCopy = previsiones;

  const columns = [
    {
      dataField: 'periodo',
      text: 'Periodo',
    },
    {
      dataField: 'tipoResultado',
      text: 'Tipo de Resultado',
      sort: true,
      label: true,
    },
    {
      dataField: 'divisa',
      text: 'Divisa',
      sort: true,
    },
    {
      dataField: 'previsionRealizada',
      text: 'Prevision Realizada',
      sort: true,
    },
    {
      dataField: 'previsionAprobada',
      text: 'Prevision Aprobada',
      sort: true,
    },
    {
      dataField: 'importePrevisionar',
      text: 'Importe Previsionar',
    },
    {
      dataField: 'estado',
      text: 'Estado',
    },
    {
      dataField: 'elipse',
      text: '',
    },
  ];

  const handleSavePrevision = (prevision: any) => {
    // tienePermisos(
    //   funcionalidades.prevision,
    //   acciones.sign,
    //   authContext.permisos,
    //   async () => {
    const [legajo] = accounts[0].username.split('@');
    const previsionNew = {
      idGestionResultados: prevision.idGestionResultados,
      divisa: prevision.divisa,
      periodo: periodo,
      importePrevisionar: prevision.importePrevisionar,
      idtipoAnalitico: tiposAnaliticoPrevisionesMemo[0].value,
      legajoCreacion: legajo,
    };
    setLoading(true);
    guardarPrevisionGestionDeResultados(previsionNew, setLoading, setRefresh);
    //   }
    // );
  };

  const handleApprovePrevision = (prevision: any) => {
    tienePermisos(
      funcionalidades.prevision,
      acciones.sign,
      authContext.permisos,
      async () => {
        const legajoAprobacion = accounts[0].username.slice(0, 8);
        const grupo = (accounts[0].idTokenClaims.groups[0] as string) || '';
        const rol: string = grupo;
        const id = prevision.idAnalitico;
        if (rol.endsWith('Firmante')) {
          const userFirmante = {
            grupo,
            legajoAprobacion,
          };
          setLoading(true);
          realizarAprobacionGestionDeResultados(
            id,
            userFirmante,
            setLoading,
            setRefresh
          );
        } else {
          toastCallAux('No tienes permisos para ejecutar esta accion', false);
        }
      }
    );
  };

  const handleDebounce = useCallback(
    (index: number, value: string) => {
      const sanitizedValue = value.replace(/\s/g, '').replace(/\./g, '');
      const parsedValue = parseFloat(sanitizedValue.replace(',', '.'));

      if (!isNaN(parsedValue)) {
        previsionesCopy[index].importePrevisionar = parsedValue;
        setGestionDeResultadosList([...previsionesCopy]);
      } else {
        toastCallAux('Monto no válido', false);
      }
    },
    [previsionesCopy, setGestionDeResultadosList]
  );

  function pushRows(e: any, index: number, rows: any) {
    const itemsArr: any[] = [];
    // poner periodo
    if (periodo === mesActual) {
      itemsArr.push({
        text: 'Guardar',
        onClick: () => {
          handleSavePrevision(e);
        },
      });
      if (e.nombreEstado === 'Alta' || e.nombreEstado === 'Aprobado') {
        itemsArr.push({
          text: 'Aprobar',
          onClick: () => {
            handleApprovePrevision(e);
          },
        });
      }
    }

    return rows.push({
      periodo: periodo,
      tipoResultado: e.nombreTipo || '-',
      divisa: e.divisa,
      previsionRealizada: e.previsionRealizada,
      previsionAprobada: e.previsionAprobada,
      importePrevisionar: (
        <CustomTextInputGestionResultados
          importe={e.importePrevisionar}
          handleDebounce={handleDebounce}
          index={index}
          periodo={periodo}
        />
      ),
      estado: <EstadosChip estado={e.nombreEstado} />,
      elipse: (
        <div className="text-right">
          <Dropdown items={itemsArr} isStatic />
        </div>
      ),
    });
  }

  // Mapea los datos de la tabla
  useEffect(() => {
    if (Array.isArray(previsionesCopy) && previsionesCopy.length > 0) {
      const rows = [];
      previsionesCopy.forEach((e: any, i: number) => {
        pushRows(e, i, rows);
      });
      setInfo(rows);
    }
  }, [previsionesCopy]);

  return (
    <>
      <div className="container-fluid">
        <div className="mb-24">
          {/* <Grid direction="row" alignItems="center" > 
              <Grid.Item xs={1} className="mb-24">
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => {}}
                >
                  Nueva
                </Button>
              </Grid.Item>
            </Grid>*/}
          <TableToolkit keyfield="id" data={info}>
            {() => (
              <GenericTable
                columns={columns}
                rows={info}
                sizePerPage={10}
                paginationSize={10}
                mensajeTablaVacia={'No hay operaciones para mostrar.'}
                checks={false}
              />
            )}
          </TableToolkit>
        </div>
      </div>
    </>
  );
};

export default GestionDeResultadosTable;
