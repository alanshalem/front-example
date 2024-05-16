/* eslint-disable react-hooks/exhaustive-deps */
import { GenericTable } from '@components/Generic/GenericTable';
import React, { useState, useEffect } from 'react';
import CruceOpcamTopsDesplegable from './CruceOpcamTopsDesplegable';
import { OpcamTopsAuxiliar } from './CruceOpcamTopsPage';

interface Props {
  cruces: OpcamTopsAuxiliar[];
  refreshTable: () => void;
  mensajeTablaVacia: string;
}

const CruceOpcamTopsTable = ({ cruces, mensajeTablaVacia }: Props) => {
  const [info, setInfo] = useState<any[]>([]);

  const columnas = [
    {
      text: 'Fecha Cruce',
      dataField: 'fechaCruce',
      sort: true,
      label: true,
    },
    {
      text: 'Nro. Boleto',
      dataField: 'nroBoleto',
      sort: true,
    },
    {
      text: 'Tipo de Operación',
      dataField: 'tipoOperacion',
      sort: true,
      label: true,
    },
    {
      text: 'Tipo de Condición',
      dataField: 'tipoCondicion',
      sort: true,
    },
    {
      text: 'Aplicacion',
      dataField: 'aplicacion',
      sort: true,
    },
  ];
  const rows: any[] = [];

  //Mapea los datos de la tabla
  useEffect(() => {
    if (!!cruces) {
      cruces.forEach((e: any) => {
        return pushRows(e);
      });
      setInfo(rows);
    }
  }, [cruces]);

  function pushRows(e: OpcamTopsAuxiliar) {
    return rows.push({
      fechaCruce: e.fechaCruce
        ? new Date(e.fechaCruce).toLocaleDateString()
        : '-',
      nroBoleto: e.nroBoleto ? e.nroBoleto : '-',
      tipoOperacion: e.tipoOperacion ? e.tipoOperacion : '-',
      tipoCondicion: e.tipoCondicion ? e.tipoCondicion : '-',
      aplicacion: e.aplicacion ? e.aplicacion : '-',
      expandible: {
        render: (
          <CruceOpcamTopsDesplegable cruces={e} diferencias={e.diferencias} />
        ),
      },
    });
  }
  return (
    <div className="container-fluid">
      <GenericTable
        columns={columnas}
        rows={info}
        pagination
        mensajeTablaVacia={mensajeTablaVacia}
        expandible
      />
    </div>
  );
};

export default CruceOpcamTopsTable;
