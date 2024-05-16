/* eslint-disable react-hooks/exhaustive-deps */
import { Dropdown } from '@brick/core';
import { GenericTable } from '@components/Generic/GenericTable';
import {
  addEllipsisIfNeeded,
  transformString,
} from '@lib/helpers/Opcam.helpers';
import React, { useEffect, useState } from 'react';
import { OpcamDesplegable } from './OpcamDesplegable';
import { OpcamAuxiliar } from './OpcamPage';
import { TableToolkit } from '@brick/table';

type Props = {
  opcam: OpcamAuxiliar[];
  mensajeTablaVacia: string;
};

const OpcamTable = ({ opcam, mensajeTablaVacia }: Props) => {
  const columnas = [
    {
      text: 'Fecha Info.',
      dataField: 'fechaInformacion',
      sort: true,
      label: true,
    },
    {
      text: 'Tipo Op.',
      dataField: 'tipoOperacion',
      sort: true,
      label: true,
    },
    {
      text: 'Nro. Boleto',
      dataField: 'nroBoleto',
      sort: true,
      label: true,
    },
    {
      text: 'Nro. Ident.',
      dataField: 'nroIdent',
      sort: true,
      label: true,
    },
    {
      text: 'Denominacion Cliente',
      dataField: 'denominacionClie',
      sort: true,
      label: true,
    },
    {
      text: 'Cod. Concepto',
      dataField: 'codConcepto',
      sort: true,
      label: true,
    },
    {
      text: 'Fecha Embarque',
      dataField: 'fechaEmbarque',
      sort: true,
      label: true,
    },
    {
      text: 'Cod. e Imp. Moneda',
      dataField: 'codImpMoneda',
      sort: true,
      label: true,
    },
    {
      text: 'Nro. Oficializacion',
      dataField: 'nroOficializac',
      sort: true,
      label: true,
    },
  ];

  const [info, setInfo] = useState<any[]>([]);

  const rows: any[] = [];

  function pushRows(e: OpcamAuxiliar) {
    return rows.push({
      // nroOperacion:
      //   { text: e.nroOperacion , label: 'Número de Operación' } ?? '-',
      fechaInformacion: e.fechaInformacion ? e.fechaInformacion : '-',
      tipoOperacion: e.tipoOperacion ? e.tipoOperacion : '-',
      nroBoleto: e.nroBoleto ? e.nroBoleto : '-',
      nroIdent: e.nroIdent ? e.nroIdent : '-',
      denominacionClie: e.denominacionClie
        ? addEllipsisIfNeeded(e.denominacionClie)
        : '-',
      codConcepto: e.codConcepto ? e.codConcepto : '-',
      fechaEmbarque: e.fechaEmbarque ? e.fechaEmbarque : '-',
      codImpMoneda:
        e.codMoneda && e.impMonedaOriginal
          ? e.codMoneda + ' ' + transformString(e.impMonedaOriginal.toString())
          : '-',
      impMonedaOriginal: e.impMonedaOriginal ? e.impMonedaOriginal : '-',
      nroOficializac: e.nroOficializac ? e.nroOficializac : '-',
      expandible: {
        render: <OpcamDesplegable opcam={e} />,
      },
      elipse: (
        <div className="text-right">
          <Dropdown isStatic />
        </div>
      ),
    });
  }

  useEffect(() => {
    if (!!opcam) {
      opcam.forEach((e: any) => {
        return pushRows(e);
      });
      setInfo(rows);
    }
  }, [opcam]);

  return (
    <>
      <div className="container-fluid">
        <TableToolkit keyField="id" data={info}>
          {() => (
            <>
              <GenericTable
                columns={columnas}
                rows={info}
                expandible
                pagination
                mensajeTablaVacia={mensajeTablaVacia}
              />{' '}
            </>
          )}
        </TableToolkit>
      </div>
    </>
  );
};

export default OpcamTable;
