/* eslint-disable react-hooks/exhaustive-deps */
import { useMsal } from '@azure/msal-react';
import { Button, Grid } from '@brick/core';
import { TableToolkit } from '@brick/table';
import { GenericTable } from '@components/Generic/GenericTable';
import { toastCallAux } from '@components/Toast/Toast.helpers';
import AuthContext from '@contexts/Auth/AuthContext';
import OverviewContext from '@contexts/Overview';
import { tienePermisos } from '@lib/helpers/Auth.helpers';
import {
  actualizarFilasCheckeadas,
  getEstado,
  prepareFirmaDeContabilidades,
} from '@lib/helpers/ContabilidadCruces/ContabilidadCruces.helpers';
import { EstadosChipContabilidad } from '@lib/helpers/EstadosContabilidad.helpers';
import { columnasContabilidad } from '@lib/helpers/helpers';
import { ContabilidadesTableResponse } from '@lib/types/ContabilidadCruces/ContabilidadCruces.types';
import React, { useEffect, useState } from 'react';
import { acciones, funcionalidades } from '../../config/ConfigurationService';
import { ContabilidadDesplegableTable } from './ContabilidadDesplegableTable';

interface Props {
  cruces: ContabilidadesTableResponse[];
  refreshTable: () => void;
  mensajeTablaVacia: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ContabilidadCrucesTable = ({
  cruces,
  mensajeTablaVacia,
  setLoading,
  refreshTable,
}: Props) => {
  const [info, setInfo] = useState<any[]>([]);
  const [contabilidadesFirmadas, setContabilidadesFirmadas] = useState<
    string[]
  >([]);
  const { accounts } = useMsal();
  const authContext = React.useContext(AuthContext);
  const estadosContext = React.useContext(OverviewContext);

  const rows: any[] = [];

  function pushRows(e: ContabilidadesTableResponse) {
    return rows.push({
      idEstado: e.idEstado,
      evento: e.descEvento,
      fechaCreacion: new Date(e.fechaCreacion).toLocaleDateString(),
      nroOperacion: e.nroOperacion,
      monto: e.monto,
      divisa: e.divisa,
      estado: <EstadosChipContabilidad estado={e.descEstado} />,
      expandible: {
        render: (
          <ContabilidadDesplegableTable
            conta={e.contabilidad}
            nroOperacion={e.nroOperacion}
            mensajeTablaVacia={mensajeTablaVacia}
          />
        ),
      },
    });
  }

  const handleCheck = (rowsAux: any) => {
    //No es array/ valor individual
    if (!Array.isArray(rowsAux.row)) {
      //aca en getEstado devuelvo el estado que corresponda segun la funcionalidad
      if (
        rowsAux.row.idEstado ===
          getEstado(
            funcionalidades.contabilidad,
            'Pendiente',
            estadosContext.funcionalidades
          ) ||
        rowsAux.row.idEstado ===
          getEstado(
            funcionalidades.contabilidad,
            'Alta',
            estadosContext.funcionalidades
          )
      ) {
        actualizarFilasCheckeadas(
          rowsAux,
          setContabilidadesFirmadas,
          contabilidadesFirmadas
        );
      } else {
        toastCallAux(
          'Solo se pueden aprobar contabilidades en estado ALTA o PENDIENTE.',
          false
        );
      }
    } else {
      /// es array
      /// estan todas en pendiente
      rowsAux.row = rowsAux.row.filter(
        row =>
          row.idEstado ===
            getEstado(
              funcionalidades.contabilidad,
              'Pendiente',
              estadosContext.funcionalidades
            ) ||
          row.idEstado ===
            getEstado(
              funcionalidades.contabilidad,
              'Alta',
              estadosContext.funcionalidades
            )
      );
      /// si hay mas de 0 en pendiente
      if (rowsAux.row.length > 0) {
        actualizarFilasCheckeadas(
          rowsAux,
          setContabilidadesFirmadas,
          contabilidadesFirmadas
        );
        /// si seleccione todos
        if (rowsAux.checked === true && rowsAux.rowIndex === 'all') {
          toastCallAux(
            'Solo se aprobaran las contabilidades en estado PENDIENTE.',
            true
          );
        }
      } else {
        toastCallAux('No hay contabilidades disponibles para aprobar.', false);
      }
    }
  };

  //Mapea los datos de la tabla
  useEffect(() => {
    if (!!cruces) {
      cruces.forEach((e: any) => {
        return pushRows(e);
      });
      setInfo(rows);
    }
  }, [cruces]);

  return (
    <>
      <div className="container-fluid">
        <div className="mb-24">
          <Grid direction="row" alignItems="center">
            <Grid.Item xs={3} className="mb-24">
              <Button
                onClick={() => {
                  if (contabilidadesFirmadas.length > 0) {
                    tienePermisos(
                      funcionalidades.contabilidad,
                      acciones.sign,
                      authContext.permisos,
                      () =>
                        prepareFirmaDeContabilidades(
                          contabilidadesFirmadas,
                          accounts[0].username.slice(0, 8),
                          setLoading,
                          refreshTable
                        )
                    );
                  } else {
                    toastCallAux(
                      'No hay contabilidades seleccionadas para aprobar.',
                      false
                    );
                  }
                }}
                variant="secondary"
                size="small"
              >
                Aprobar Contabilidades
              </Button>
            </Grid.Item>
          </Grid>

          <TableToolkit keyField="id" data={info}>
            {() => (
              <GenericTable
                rows={info}
                columns={columnasContabilidad}
                mensajeTablaVacia={mensajeTablaVacia}
                handleCheck={handleCheck}
                expandible
              />
            )}
          </TableToolkit>
        </div>
      </div>
    </>
  );
};
