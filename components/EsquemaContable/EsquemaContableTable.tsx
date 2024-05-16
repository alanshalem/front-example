import { GenericTable } from '@components/Generic/GenericTable';
import React, { useEffect, useState } from 'react';

interface Props {
  esquema: any[];
  refreshTable: () => void;
  mensajeTablaVacia: string;
}

const EsquemaContableTable = ({ esquema, mensajeTablaVacia }: Props) => {
  const [info, setInfo] = useState<any[]>([]);

  const columnas = [
    {
      text: 'Aplicacion',
      dataField: 'aplicacion',
      sort: true,
      label: true,
    },
    {
      text: 'Grupo',
      dataField: 'grupo',
      sort: true,
      label: true,
    },
    {
      text: 'Esquema Contable',
      dataField: 'esquemaContable',
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
      text: 'Concepto',
      dataField: 'concepto',
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
      dataField: 'centroDeCosto',
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
  const rows: any[] = [];

  function pushRows(e: any) {
    return rows.push({
      aplicacion: e.aplicacion ? e.aplicacion : '-',
      esquemaContable: e.esquemaContable ? e.esquemaContable : '-',
      grupo: e.grupo ? e.grupo : '-',
      rubro: e.rubro ? e.rubro : '-',
      concepto: e.concepto ? e.concepto : '-',
      tipoMovimiento: e.tipoMovimiento === 0 ? 'Débito' : 'Crédito',
      centroDeCosto: e.centroDeCosto ? e.centroDeCosto : '-',
      divisa: e.divisa ? e.divisa : '-',
    });
  }
  //Mapea los datos de la tabla
  useEffect(() => {
    if (!!esquema) {
      esquema.forEach((e: any) => {
        return pushRows(e);
      });
      setInfo(rows);
    }
  }, [esquema]);

  return (
    <div className="container-fluid">
      <GenericTable
        rows={info}
        columns={columnas}
        mensajeTablaVacia={mensajeTablaVacia}
        checks={false}
      />
    </div>
  );
};

export default EsquemaContableTable;
