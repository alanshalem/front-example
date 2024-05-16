import React from 'react';
import { GenericTable } from '@components/Generic/GenericTable';
import { AnaliticoDetalle } from '@lib/types/Contabilidad/Eventos/Inventario/EventoInventario.types';
import { formatNumber } from '@lib/helpers/helpers';
type AsientosProps = {
  datosAsientos: AnaliticoDetalle[];
};

export const AsientosContables = ({ datosAsientos }: AsientosProps) => {
  const columnas = [
    {
      text: 'Rubro',
      dataField: 'rubro',
      sort: true,
      label: true,
    },
    {
      text: 'Concepto',
      dataField: 'concepto',
      sort: true,
    },
    {
      text: 'Monto',
      dataField: 'importe',
      sort: true,
      label: true,
    },
    {
      text: 'Tipo de Movimiento',
      dataField: 'tipoMovimiento',
      sort: true,
      label: true,
    },
    {
      text: 'Centro de Costo',
      dataField: 'centroCosto',
      sort: true,
      label: true,
    },
    {
      text: 'Divisa',
      dataField: 'divisa',
      sort: true,
      label: true,
    },
  ];

  //Mapea los datos de la tabla
  const filas = React.useMemo(() => {
    const rows: any[] = [];
    if (!!datosAsientos) {
      datosAsientos.forEach((e: AnaliticoDetalle) => {
        return pushRows(e, rows);
      });
    }
    return rows;
  }, [datosAsientos]);

  function pushRows(e: AnaliticoDetalle, rows: any[]) {
    return rows.push({
      rubro: e.rubro,
      concepto: e.concepto,
      descripcionRubro: e.descripcionRubro,
      importe: formatNumber((e.importe).toString()),
      tipoMovimiento: e.tipoMovimiento,
      centroCosto: e.centroCosto,
      divisa: e.divisa,
    });
  }

  return (
    <div className="container-fluid">
      <GenericTable rows={filas} columns={columnas} pagination={false} />
    </div>
  );
};
