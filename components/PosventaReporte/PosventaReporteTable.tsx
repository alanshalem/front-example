/* eslint-disable react-hooks/exhaustive-deps */
import { TableToolkit } from '@brick/core';
import { GenericTable } from '@components/Generic/GenericTable';
import { PosventaGenericaTableItem } from '@lib/types/Posventa/Posventa.types';
import React, { useEffect, useState } from 'react';
import { columnasReporteTable } from './PosventaReporteColumns';
import { formatNumber } from '@lib/helpers/helpers';
import { EstadosChip } from '@lib/helpers/EstadosComponent.helpers'

type PosventaTableProps = {
  mensajeTablaVacia?: string;
  posventaTable: PosventaGenericaTableItem[];
  refreshTable: () => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const PosventaReporteTable = ({
  mensajeTablaVacia = 'No hay operaciones para mostrar.',
  posventaTable,
}: PosventaTableProps) => {
  const [info, setInfo] = useState<any[]>(posventaTable);

  const rows: any[] = [];

  const pushRows = (e: any) => {
    return rows.push({
      nroOperacion: e.nroOperacion ? e.nroOperacion : '-',
      secuencia: e.secuencia ? e.secuencia : '-',
      aplicacion: e.aplicacion ? e.aplicacion : '-',
      cuit: e.cuit ? e.cuit : '-',
      razonSocial: e.razonSocial ? e.razonSocial : '-',
      concepto: e.concepto ? e.concepto : '-',
      tipoPosVenta: e.tipoPosVenta ? e.tipoPosVenta : '-',
      monto: e.monto ? formatNumber(e.monto) : '-',
      fechaAprobacion: e.fechaAprobacion ? e.fechaAprobacion : '-',
      legajoCreacion: e.legajoCreacion ? e.legajoCreacion : '-',
      estado: e.estado ? <EstadosChip estado={ e.estado} esReporte={true}/> : '-',
    });
  };

  useEffect(() => {
    if (!!posventaTable) {
      posventaTable.forEach((e: PosventaGenericaTableItem) => {
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
                  columns={columnasReporteTable}
                  rows={info}
                  pagination
                  checks={false}
                  mensajeTablaVacia={mensajeTablaVacia}
                  sizePerPage={10}
                  paginationSize={10}
                />
              </>
            )}
          </TableToolkit>
        </div>
      </div>
    </>
  );
};

export default PosventaReporteTable;
