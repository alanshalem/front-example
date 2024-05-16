/* eslint-disable react-hooks/exhaustive-deps */
import { GenericTable } from '@components/Generic/GenericTable';
import { calcularEstado } from '@lib/helpers/Contabilidad.helpers';
import { ordenarFecha } from '@lib/helpers/Proyectadas.helpers';
import { Contabilidad } from '@lib/types/Contabilidad/Contabilidad.types';
import React, { useEffect, useState } from 'react';
import { ContabilidadDesplegable } from './ContabilidadDesplegable';

interface Props {
  cruces: Contabilidad[];
  refreshTable: () => void;
  mensajeTablaVacia: string;
}

export const ContabilidadTable = ({ cruces, mensajeTablaVacia }: Props) => {
  const [info, setInfo] = useState<any[]>([]);

  //ver las columnas que deberia tener
  const columnas = [
    {
      text: 'Nro. Operación',
      dataField: 'nroOperacion',
      sort: true,
      label: true,
    },
    {
      text: 'Nro. Operación 2',
      dataField: 'nroOperacion2',
      sort: true,
      label: true,
    },
    {
      text: 'Debe',
      dataField: 'debe',
      sort: true,
      currency: '$',
      arsCurrencyFormat: true,
      currencyPosition: 'before',
    },
    {
      text: 'Haber',
      dataField: 'haber',
      sort: true,
      currency: '$',
      arsCurrencyFormat: true,
      currencyPosition: 'before',
    },
    {
      text: 'Corresponsal',
      dataField: 'codcta',
      sort: true,
    },
    {
      text: 'Diferencia',
      dataField: 'diferencia',
      sort: true,
    },
    {
      text: 'Fecha Contable',
      dataField: 'fhcontable',
      sort: true,
    },
    {
      text: 'Fecha de Creación',
      dataField: 'fechaCreacion',
      sort: true,
      sortFunc: ordenarFecha,
    },
  ];

  const rows: any[] = [];

  function pushRows(e: Contabilidad) {
    return rows.push({
      nroOperacion: e.numOp1 ? e.numOp1 : '-',
      nroOperacion2: e.numOp2 ? e.numOp2 : '-',
      debe: e.debe ? e.debe : '0',
      haber: e.haber ? e.haber : '0',
      diferencia: e.diferencia ? e.diferencia : '-',
      codcta: e.codcta ? e.codcta : '-',
      fhcontable: e.fechaContable ? e.fechaContable : '-',
      fechaCreacion: e.fechaCreacion
        ? new Date(e.fechaCreacion).toLocaleDateString()
        : '-',
      state: calcularEstado(e.idEstado),
      expandible: {
        render: <ContabilidadDesplegable cruceCorresponsal={e} />,
      },
    });
  }

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
        <GenericTable
          rows={info}
          columns={columnas}
          mensajeTablaVacia={mensajeTablaVacia}
          expandible
        />
      </div>
    </>
  );
};
