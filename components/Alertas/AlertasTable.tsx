import React, { useEffect, useState } from 'react';
import { TableToolkit } from '@brick/table';
import { GenericTable } from '@components/Generic/GenericTable';
import { AlertasTableProps } from '@lib/types/Alertas/Alertas.types';
import { convertISO8601ToDDMMAAAA } from '@lib/utils/Date';
import { Dropdown } from '@brick/core';

const AlertasTable = (props: AlertasTableProps) => {
  const [info, setInfo] = useState<any>([]);

  const columns = [
    {
      dataField: 'fecha',
      text: 'Fecha',
      sort: true,
    },
    {
      dataField: 'aplicacion',
      text: 'Aplicación',
      sort: true,
    },
    {
      dataField: 'nroOperacionSecuencia',
      text: 'Nro Operacion secuencia',
      sort: true,
    },
    {
      dataField: 'tipoAlerta',
      text: 'Tipo de Alerta',
      sort: true,
    },
    {
      dataField: 'esquemaContable',
      text: 'Esquema Contable',
      sort: true,
    },
    {
      dataField: 'elipse',
      text: '',
    },
  ];

  function pushRows(e: any, rows: any) {
    const itemsArr = [];

    if (e.detalle.length > 0) {
      itemsArr.push({
        text: 'Ver Detalles',
        onClick: () => {
          props.handleModal(e);
        },      
      });
    }

    return rows.push({
      aplicacion: e.aplicacion || '-',
      fecha: e.fecha ? convertISO8601ToDDMMAAAA(e.fecha) : '-',
      nroOperacionSecuencia: e.nroOperacionSecuencia || '-',
      tipoAlerta: e.tipoAlerta || '-',
      esquemaContable: e.esquemaContable || '-',
      elipse: (
        <div className="text-right">
          <Dropdown items={itemsArr} isStatic />
        </div>
      ),
    });
  }

  useEffect(() => {
    const rows: any[] = [];
    if (
      Array.isArray(props.alertasConciliacionList) &&
      props.alertasConciliacionList.length > 0
    ) {
      props.alertasConciliacionList.forEach((e: any) => {
        return pushRows(e, rows);
      });
      setInfo(rows);
    }
  }, [props.alertasConciliacionList]);

  return (
    <>
      <div className="container-fluid">
        <div className="mb-24">
          <>
            <TableToolkit keyField="id" data={info}>
              {() => (
                <GenericTable columns={columns} rows={info} checks={false} />
              )}
            </TableToolkit>
          </>
        </div>
      </div>
    </>
  );
};

export default AlertasTable;