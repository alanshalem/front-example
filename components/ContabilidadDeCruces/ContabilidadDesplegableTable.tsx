/* eslint-disable react-hooks/exhaustive-deps */
import { GenericTable } from '@components/Generic/GenericTable';
import { ContabilidadCruces } from '@lib/types/ContabilidadCruces/ContabilidadCruces.types';
import React, { useEffect, useState } from 'react';

interface Props {
  conta: ContabilidadCruces[];
  nroOperacion: string;
  mensajeTablaVacia: string;
}

export const ContabilidadDesplegableTable = ({
  conta,
  nroOperacion,
}: Props) => {
  const [info, setInfo] = useState<any[]>([]);
  const columnas = [
    {
      text: 'Nro. Operación',
      dataField: 'nroOperacion',
      sort: true,
      label: true,
    },
    {
      text: 'Rubro',
      dataField: 'rubro',
      sort: true,
      label: true,
    },
    {
      text: 'Desc. Rubro',
      dataField: 'descripcionRubro',
      sort: true,
    },
    {
      text: 'Centro de Costo',
      dataField: 'centroCosto',
      sort: true,
    },
    {
      text: 'Monto',
      dataField: 'monto',
      sort: true,
      currency: '$',
      arsCurrencyFormat: true,
      currencyPosition: 'before',
    },
    {
      text: 'Divisa',
      dataField: 'divisa',
      sort: true,
    },
    {
      text: 'Tipo de Movimiento',
      dataField: 'tipoMovimiento',
      sort: true,
    },
    {
      text: 'Legajo de Creación',
      dataField: 'legajoCreacion',
      sort: true,
    },
  ];

  const rows: any[] = [];

  function pushRows(e: ContabilidadCruces) {
    return rows.push({
      nroOperacion: nroOperacion ? nroOperacion : '-',
      rubro: e.rubro ? e.rubro : '-',
      descripcionRubro: e.descripcionRubro ? e.descripcionRubro : '-',
      centroCosto: e.centroCosto ? e.centroCosto : '-',
      monto: e.monto ? e.monto : '0',
      divisa: e.divisa ? e.divisa : '-',
      tipoMovimiento: e.tipoMovimiento ? e.tipoMovimiento : '-',
      legajoCreacion: e.legajoCreacion ? e.legajoCreacion : '-',
    });
  }

  //Mapea los datos de la tabla
  useEffect(() => {
    if (!!conta) {
      conta.forEach((e: any) => {
        return pushRows(e);
      });
      setInfo(rows);
    }
  }, [conta]);

  return (
    <>
      <div className="container-fluid">
        <GenericTable
          checks={false}
          rows={info}
          columns={columnas}
          pagination={false}
        />
      </div>
    </>
  );
};
