import { Dropdown } from '@brick/core';
import { GenericTable } from '@components/Generic/GenericTable';
import React, { useEffect, useState } from 'react';

interface Props {
  esquema: any[];
  refreshTable: () => void;
  mensajeTablaVacia: string;
  setIdUnico: any;
  setIdUnicoEliminar: any;
}

const EsquemaContableConciliacionesTable = ({
  esquema,
  mensajeTablaVacia,
  setIdUnico,
  setIdUnicoEliminar,
}: Props) => {
  const [info, setInfo] = useState<any[]>([]);

  const columnas = [
    {
      text: 'Rubro',
      dataField: 'rubro',
      sort: true,
      label: true,
    },
    {
      text: 'Descripción',
      dataField: 'descripcion',
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
      text: 'Concilia?',
      dataField: 'concilia',
      sort: true,
      label: true,
    },
    {
      dataField: 'elipse',
      text: '',
    },
  ];
  const rows: any[] = [];

  function pushRows(e: any, index: number) {
    const itemsArr = [
      {
        text: 'Editar',
        onClick: () => {
          setIdUnico(index);
        },
      },
      {
        text: 'Eliminar',
        onClick: () => {
          setIdUnicoEliminar(index);
        },
      },
    ];
    return rows.push({
      rubro: e.rubro ? e.rubro : '-',
      descripcion: e.descripcion ? e.descripcion : '-',
      centroCosto: e.centroCosto ? e.centroCosto : '-',
      concilia: e.concilia ? 'SI' : 'NO',
      elipse: (
        <div className="text-right">
          <Dropdown items={itemsArr} isStatic />
        </div>
      ),
    });
  }
  //Mapea los datos de la tabla
  useEffect(() => {
    if (!!esquema) {
      esquema.forEach((e: any, i: number) => {
        return pushRows(e, i);
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

export default EsquemaContableConciliacionesTable;
