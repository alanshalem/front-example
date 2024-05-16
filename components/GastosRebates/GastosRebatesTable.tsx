import React, { useContext, useEffect, useState } from 'react';
import { Button, Grid } from '@brick/core';
import { GenericTable } from '@components/Generic/GenericTable';
//import { GastosRebatesDesplegable } from './GastosRebatesDesplegable';
import { EstadosChip } from '@lib/helpers/EstadosGastosRebates.helpers';
import { TableToolkit } from '@brick/table';
import {
  actualizarFilasCheckeadas,
  fechaActual,
  prepararParaAprobarGastoRebate,
  prepararParaRechazarGastoRebate,
  verificarRowParaCalendarizar,
} from '@lib/helpers/GastosRebates.helpers';
import { toastCallAux } from '@components/Toast/Toast.helpers';
import { formatNumberForInput } from '@lib/utils/Importe';
import { useMsal } from '@azure/msal-react';
import { GastoRebateResponse, GastosRebatesChecksAprobarRechazar, RowGastoCalendarizado } from '@lib/types/GastosRebates/GastosRebates.types';
import { tienePermisos } from '@lib/helpers/Auth.helpers'
import { acciones, funcionalidades } from '../../config/ConfigurationService';
import AuthContext from '@contexts/Auth/AuthContext'


type PropsGastoRebateTable = {
  gastosRebates: GastoRebateResponse[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAvanzarCalendarizaModal: React.Dispatch<React.SetStateAction<boolean>>;
  setGastoParaCalendarizar: React.Dispatch<React.SetStateAction<RowGastoCalendarizado[]>>
  gastoParaCalendarizar: RowGastoCalendarizado[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

const GastosRebatesTable = ({
  gastosRebates,
  setAvanzarCalendarizaModal,
  setGastoParaCalendarizar,
  gastoParaCalendarizar,
  setLoading,
  setRefresh,
}: PropsGastoRebateTable) => {
  const authContext = useContext(AuthContext);
  const [info, setInfo] = useState<any>([]);
  const [gastosRebatesChecks, setGastosRebatesChecks] = useState<GastosRebatesChecksAprobarRechazar[]>([]);
  const [esFechaValida, setEsFechaValida] = useState<boolean>(false);
  const { accounts } = useMsal();

  const columns = [
    {
      dataField: 'tipoAnalitico',
      text: 'Tipo Analitico',
      sort: true,
    },
    {
      dataField: 'periodo',
      text: 'Periodo',
      sort: true,
    },
    {
      dataField: 'nroReferencia',
      text: 'Nro Referencia',
      sort: true,
    },
    {
      dataField: 'nroLiquidacion',
      text: 'Nro Liquidacion',
      sort: true,
    },
    {
      dataField: 'corresponsalDivisa',
      text: 'Corresponsal Divisa',
      sort: true,
    },
    {
      dataField: 'importe',
      text: 'Importe',
      sort: true,
      currency: '$',
    },
    {
      dataField: 'nombreEstado',
      text: 'Estado',
    },
    {
      dataField: 'fechaCalendarizada',
      text: 'Fecha Calendarizada',
      sort: true,
    },
    {
      dataField: 'fechaUltimaModificacion',
      text: 'Fecha Ultima Modificacion',
      sort: true,
    },
  ];

  function pushRows(e: GastoRebateResponse, rows: any) {
    return rows.push({
      tipoAnalitico: e.nombreTipoAnalitico ? e.nombreTipoAnalitico : '-',
      periodo: e.periodo ? e.periodo : '-',
      nroReferencia: e.referenciaExterna ? e.referenciaExterna : '-',
      nroLiquidacion: e.nroLiquidacion ? e.nroLiquidacion : '-',
      corresponsalDivisa: e.corresponsalDivisa ? e.corresponsalDivisa : '-',
      importe: e.importe ? formatNumberForInput(e.importe) : '-',
      nombreEstado: <EstadosChip estado={e.nombreEstado} />,
      fechaCalendarizada: e.fechaCalendarizada ? e.fechaCalendarizada : '-',
      fechaUltimaModificacion: e.fechaUltimaModificacion
        ? e.fechaUltimaModificacion
        : '-',
      /*expandible: {
        render: <GastosRebatesDesplegable />,
      },*/
      estado: e.nombreEstado,
      idAnalitico: e.idAnalitico,
      idTipoAnalitico: e.idTipoAnalitico,
    });
  }

  useEffect(() => {
    const rows: any[] = [];
    if (Array.isArray(gastosRebates) && gastosRebates.length > 0) {
      gastosRebates.forEach((e: GastoRebateResponse) => {
        return pushRows(e, rows);
      });
      setInfo(rows);
    }
  }, [gastosRebates]);

  const handleCheck = (rowsAux: any) => {
    //No es array es valor individual
    if (!Array.isArray(rowsAux.row)) {
      // en caso para calendarizar solo se permite con fecha actual
      if (
        rowsAux.row.tipoAnalitico === 'Gastos' &&
        rowsAux.row.estado === 'Calendarizado' &&
        rowsAux.row.fechaCalendarizada === fechaActual
      ) {
        verificarRowParaCalendarizar(
          rowsAux,
          setGastoParaCalendarizar,
          gastoParaCalendarizar,
          setEsFechaValida
        );
      }
      // en caso para aprobar
      if (rowsAux.row.estado === 'Alta' || rowsAux.row.estado === 'Calendarizado') {
        actualizarFilasCheckeadas(
          rowsAux,
          setGastosRebatesChecks,
          gastosRebatesChecks
        );
      }
    } else {
      // es array
      verificarRowParaCalendarizar(
        rowsAux,
        setGastoParaCalendarizar,
        gastoParaCalendarizar,
        setEsFechaValida
      );
      rowsAux.row = rowsAux.row.filter(row => row.estado === 'Alta' || row.estado === 'Calendarizado');
      if (rowsAux.row.length > 0) {
        actualizarFilasCheckeadas(
          rowsAux,
          setGastosRebatesChecks,
          gastosRebatesChecks
        );
      }
    }
  };

  const handleAvanzar = () => {
    if (gastoParaCalendarizar && gastoParaCalendarizar.length > 0)  {
      if (gastoParaCalendarizar.length === 1 && esFechaValida) {
        setAvanzarCalendarizaModal(true);
        setEsFechaValida(false)
      } else if( gastoParaCalendarizar.length > 1) {
        toastCallAux('Solo se puede avanzar de una a la vez', false);
      }
    } else {
      setAvanzarCalendarizaModal(false);
      toastCallAux('No puedes avanzar calendarizada', false);
    }
  };

  const handleRechazar = () => {
    if (gastosRebatesChecks && gastosRebatesChecks.length > 0) {
      setLoading(true);
      prepararParaRechazarGastoRebate(
        gastosRebatesChecks,
        setLoading,
        setRefresh
      );
    } else {
      toastCallAux('No hay gasto o rebate para rechazar', false);
    }
  };

  const handleAprobar = () => {
    if (gastosRebatesChecks && gastosRebatesChecks.length > 0) {
      tienePermisos(
        funcionalidades.gastosRebates,
        acciones.sign,
        authContext.permisos,
        async () => {
          const legajoAprobacion = accounts[0].username.slice(0, 8);
          const grupo = (accounts[0].idTokenClaims.groups[0] as string) || '';
          const rol: string = grupo;
          if (rol.endsWith("Firmante")) {
            setLoading(true);
            prepararParaAprobarGastoRebate(
              gastosRebatesChecks,
              setLoading,
              setRefresh,
              legajoAprobacion,
              grupo,
              setGastosRebatesChecks
            );
          } else {
            toastCallAux('No tienes los permisos necesarios para ejecutar esta accion',false);
          }  
        } 
      );
    } else {
      toastCallAux('No hay gasto o rebate para aprobar', false);
    } 
  };

  return (
    <>
      <div className="container-fluid">
        <div className="mb-24">
          <>
            <Grid direction="row" alignItems="start">
              <Grid.Item xs={1} className="mb-24">
                <Button
                  variant="primary"
                  size="small"
                  iconAlign="right"
                  iconType="check"
                  onClick={handleAprobar}
                >
                  Aprobar
                </Button>
              </Grid.Item>
              <Grid.Item xs={1} className="mb-24">
                <Button
                  variant="secondary"
                  size="small"
                  iconAlign="right"
                  iconType="close"
                  onClick={handleRechazar}
                >
                  Rechazar
                </Button>
              </Grid.Item>
              <Grid.Item xs={2} className="mb-24">
                <Button
                  variant="terciary"
                  size="small"
                  iconAlign="right"
                  iconType="check"
                  onClick={handleAvanzar}
                >
                  Avanzar Calendarizada
                </Button>
              </Grid.Item>
            </Grid>

            <TableToolkit keyField="id" data={info}>
              {() => (
                <GenericTable
                  columns={columns}
                  rows={info}
                  //expandible={true}
                  handleCheck={handleCheck}
                />
              )}
            </TableToolkit>
          </>
        </div>
      </div>
    </>
  );
};

export default GastosRebatesTable;