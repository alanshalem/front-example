/* eslint-disable react-hooks/exhaustive-deps */
import { Dropdown } from '@brick/core';
import { TableToolkit } from '@brick/table';
import { GenericTable } from '@components/Generic/GenericTable';
import { columnasTable } from '@components/Posventa/PosventaColumns';
import { toastCallAux } from '@components/Toast/Toast.helpers';
import OverviewContext from '@contexts/Overview';
import { EstadosChip } from '@lib/helpers/EstadosComponent.helpers';
import {
  actualizarFilasCheckeadasPosventa,
  formatNumber,
  getEstado,
} from '@lib/helpers/Posventa.helpers';
import { PosventaTableItem } from '@lib/types/Posventa/Posventa.types';
import React, { useEffect, useState } from 'react';
import { funcionalidades } from '../../config/ConfigurationService';
import { PosventaDesplegable } from './PosventaDesplegable';
import WorkflowModal from './WorkflowModal';

type PosventaTableProps = {
  mensajeTablaVacia?: string;
  posventaTable: PosventaTableItem[];
  refreshTable: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setPosventasActualizadas: any;
  posventasActualizadas: any;
  setModalBoletos: any;
  setDivisaCuenta: any;
  setTipoMovimiento: any;
  setIdPosventaDetalle: any;

};

const PosventaTable = ({
  mensajeTablaVacia = 'No hay operaciones para mostrar.',
  posventaTable,
  setPosventasActualizadas,
  posventasActualizadas,
  setModalBoletos,
  setDivisaCuenta,
  setTipoMovimiento,
  setIdPosventaDetalle
}: PosventaTableProps) => {
  const [info, setInfo] = useState<any[]>(posventaTable);
  const [currentPosventa, setCurrentPosventa] = useState<PosventaTableItem>();

  const estadosContext = React.useContext(OverviewContext);

  const rows: any[] = [];

  const [showWorkFlowModal, setShowWorkFlowModal] = useState<boolean>(false);

  const setPosventa = (b: any) => {
    setCurrentPosventa(b);
  };

  const pushRows = (e: any) => {
    const itemsArr = [
      {
        text: 'Ver Workflow',
        onClick: () => {
          setPosventa(e);
          setShowWorkFlowModal(!showWorkFlowModal);
        },
      },
    ];

    const tieneBoleto = e.detalleWorkflow.some((detalle: any) => detalle.workflow === "Boleto");

    if (tieneBoleto && e.idEstado === 13) {
      itemsArr.push({
        text: 'Avanzar',
        onClick: () => {
          setDivisaCuenta(e.divisa)
          setIdPosventaDetalle(e.idPosVentaDetalle)
          setTipoMovimiento(e.idTipoPosventa)
          setModalBoletos(true)
        }
      })
    } 

    return rows.push({
      nroOperacionSecuencia: e.nroOperacionSecuencia
        ? e.nroOperacionSecuencia
        : '-',
      tipoPosventa: e.tipoPosventa ? e.tipoPosventa : '-',
      concepto: e.concepto ? e.concepto : '-',
      montoOriginal: e.montoOriginal
        ? e.divisa + ' ' + formatNumber(e.montoOriginal)
        : '-',
      montoDevolver: e.montoDevolver
        ? e.divisa + ' ' + formatNumber(e.montoDevolver)
        : '-',
      montoCobrar: e.montoCobrar
        ? e.divisa + ' ' + formatNumber(e.montoCobrar)
        : '-',
      fechaAprobacion: e.fechaAprobacion ? e.fechaAprobacion : '-',
      descEstado: e.descEstado ? <EstadosChip estado={e.descEstado} /> : '-',
      idEstado: e.idEstado ? e.idEstado : null,
      idPosVentaDetalle: e.idPosVentaDetalle ? e.idPosVentaDetalle : null,
      log: e.log ? e.log : '-',
      elipse: (
        <div className="text-right">
          <Dropdown items={itemsArr} isStatic />
        </div>
      ),
      expandible: {
        render: (
          <PosventaDesplegable
            posVentaGrillaDetalle={e.posVentaGrillaDetalle}
          />
        ),
      },
    });
  };

  const handleCheck = (rowsAux: any) => {
    if (!Array.isArray(rowsAux.row)) {
      //aca en getEstado devuelvo el estado que corresponda segun la funcionalidad
      const rowsValidationAlta =
        rowsAux.row.idEstado ===
        getEstado(
          funcionalidades.posventa,
          'Alta',
          estadosContext.funcionalidades
        );

      const rowsValidationError =
        rowsAux.row.idEstado ===
        getEstado(
          funcionalidades.posventa,
          'Error',
          estadosContext.funcionalidades
        );

      const rowsValidationPendiente =
        rowsAux.row.idEstado ===
        getEstado(
          funcionalidades.posventa,
          'Pendiente',
          estadosContext.funcionalidades
        );
      // hacer logica para que llame a posventasAprobadas o a posventasRechazadas
      if (
        rowsValidationAlta ||
        rowsValidationError ||
        rowsValidationPendiente
      ) {
        /// funcion que chequea que esten ticados los checks de las filas, sean todas o algunas. Hay 4 casos???
        actualizarFilasCheckeadasPosventa(
          rowsAux,
          setPosventasActualizadas,
          posventasActualizadas
        );
      } else {
        toastCallAux(
          'Solo se pueden Aprobar o Rechazar devoluciones en estado de Alta, Pendiente o Error.',
          false
        );
      }
    } else {
      rowsAux.row = rowsAux.row.filter(
        row => row.idEstado === 1 || row.idEstado === 7
      );
      if (rowsAux.row.length > 0) {
        actualizarFilasCheckeadasPosventa(
          rowsAux,
          setPosventasActualizadas,
          posventasActualizadas
        );
        if (rowsAux.checked === true && rowsAux.rowIndex === 'all') {
          toastCallAux(
            'Solo se aprobaran o rechazar las devoluciones en estado de Alta o Error.',
            true
          );
        }
      }
    }
  };

  const handleOnSelectAll = (checked: boolean) => {
    if (checked) {
      const rowsAux = {
        checked: true,
        row: info,
        rowIndex: 'all',
      };

      rowsAux.row = info.filter(
        row => row.idEstado === 7 || row.idEstado === 1 || row.idEstado === 5
      );

      if (rowsAux.row.length > 0) {
        actualizarFilasCheckeadasPosventa(
          rowsAux,
          setPosventasActualizadas,
          posventasActualizadas
        );
        if (rowsAux.checked === true && rowsAux.rowIndex === 'all') {
          toastCallAux(
            'Solo se aprobaran las devoluciones en estado de Alta o Error.',
            true
          );
        }
      } else {
        toastCallAux('No hay impuestos disponibles para aprobar.', false);
      }
    } else {
      setPosventasActualizadas([]);
    }
  };

  useEffect(() => {
    if (!!posventaTable) {
      posventaTable.forEach((e: PosventaTableItem) => {
        return pushRows(e);
      });
      setInfo(rows);
    }
  }, [posventaTable]);

  return (
    <>
      <div className="container-fluid">
        <div className="mb-24">
          <TableToolkit keyField="id" data={info}>
            {() => (
              <>
                <GenericTable
                  columns={columnasTable}
                  rows={info}
                  expandible
                  pagination
                  handleCheck={handleCheck}
                  mensajeTablaVacia={mensajeTablaVacia}
                  handleOnSelectAll={handleOnSelectAll}
                />
              </>
            )}
          </TableToolkit>
        </div>
        <WorkflowModal
          visible={showWorkFlowModal}
          close={() => setShowWorkFlowModal(false)}
          posventa={currentPosventa}
        />
      </div>
    </>
  );
};

export { PosventaTable };
