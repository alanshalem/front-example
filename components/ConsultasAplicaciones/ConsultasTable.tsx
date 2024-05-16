/* eslint-disable react-hooks/exhaustive-deps */
import { TableToolkit } from '@brick/table';
import { GenericTable } from '@components/Generic/GenericTable';
import { formatConsultasDate } from '@lib/helpers/ConsultasCM.helpers';
import React, { useEffect, useState } from 'react';

type ConsultasProps = {
  consultasTable: any[];
};

type ConsultasItem = {
  rubro: string;
  casa: string;
  saldoInicio: any;
  saldoCierre: any;
  divisa: string;
  fecha: string;
  sumaDb: string;
  sumaCr: string;
};

const ConsultasTable = ({ consultasTable }: ConsultasProps) => {
  const [info, setInfo] = useState<any[]>(consultasTable);
  const rows: any[] = [];

  const columnas = [
    { text: 'Rubro', dataField: 'rubro', sort: true, width: 150 },
    { text: 'Divisa', dataField: 'divisa', sort: true, width: 100 },
    { text: 'Centro de Costos', dataField: 'casa', sort: true, width: 230 },
    {
      text: 'Fecha',
      dataField: 'fecha',
      sort: true,
      width: 250,
    },
    {
      text: 'Saldo Inicial',
      dataField: 'saldoInicio',
      currency: '$',
      currencyPosition: 'before',
    },
    {
      text: 'Suma Débito',
      dataField: 'sumaDb',
      currency: '$',
      currencyPosition: 'before',
    },
    {
      text: 'Suma Credito',
      dataField: 'sumaCr',
      currency: '$',
      currencyPosition: 'before',
    },
    {
      text: 'Saldo Cierre',
      dataField: 'saldoCierre',
      currency: '$',
      currencyPosition: 'before',
    },
  ];

  const pushRows = (e: ConsultasItem) => {
    return rows.push({
      rubro: e.rubro ? e.rubro : '-',
      casa: e.casa ? e.casa : '-',
      saldoInicio: e.saldoInicio ? e.saldoInicio : '-',
      saldoCierre: e.saldoCierre ? e.saldoCierre : '-',
      sumaDb: e.sumaDb ? e.sumaDb : '-',
      sumaCr: e.sumaCr ? e.sumaCr : '-',
      fecha: e.fecha ? formatConsultasDate(e.fecha) : '-',
      divisa: e.divisa ? e.divisa : '-',
    });
  };

  useEffect(() => {
    if (!!consultasTable) {
      consultasTable.forEach((e: ConsultasItem) => {
        return pushRows(e);
      });
      setInfo(rows);
    }
  }, [consultasTable]);

  return (
    <>
      <div className="container-fluid">
        <div className="mb-24">
          <TableToolkit keyField="id" data={info}>
            {() => (
              <>
                <GenericTable
                  columns={columnas}
                  rows={info}
                  pagination
                  checks={false}
                  mensajeTablaVacia={'No hay informacion'}
                  sizePerPage={10}
                  expandible={false}
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

export default ConsultasTable;
