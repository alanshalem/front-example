import { TableToolkit } from '@brick/table';
import { GenericTable } from '@components/Generic/GenericTable';
import React, { useEffect, useState } from 'react';

type Props = {
  procesos: any;
};

const ProcesosTable = ({ procesos }: Props) => {
  const columnas = [
    {
      text: 'Nombre',
      dataField: 'nombre',
      sort: true,
      label: true,
    },
    {
      text: 'Descripcion',
      dataField: 'descripcion',
      sort: true,
      label: true,
    },
    {
      text: 'Fecha Inicio',
      dataField: 'fechaInicio',
      sort: true,
      label: true,
    },
    {
      text: 'Fecha Fin',
      dataField: 'fechaFin',
      sort: true,
      label: true,
    },
    {
      text: 'Resultado',
      dataField: 'resultado',
      sort: true,
      label: true,
    },
    {
      text: 'Frecuencia',
      dataField: 'frecuencia',
      sort: true,
      label: true,
    },
    {
      text: 'Horario',
      dataField: 'horario',
      sort: true,
      label: true,
    },
  ];

  const [info, setInfo] = useState<any[]>([]);

  const rows: any[] = [];

  function pushRows(e: any) {
    return rows.push({
      nombre: e.nombre || '-',
      descripcion: e.descripcion || '-',
      fechaInicio: new Date(e.fechaInicio).toLocaleDateString() || '-',
      fechaFin: new Date(e.fechaFin).toLocaleDateString() || '-',
      resultado: e.resultado || '-',
      frecuencia: e.frecuencia || '-',
      horario: e.horario || '-',
    });
  }

  useEffect(() => {
    if (!!procesos) {
      procesos.forEach((e: any) => {
        return pushRows(e);
      });
      setInfo(rows);
    }
  }, [procesos]);

  return (
    <>
      <div className="container-fluid">
        <TableToolkit keyField="id" data={info}>
          {() => (
            <>
              <GenericTable
                columns={columnas}
                rows={info}
                checks={false}
                pagination
                mensajeTablaVacia={''}
              />{' '}
            </>
          )}
        </TableToolkit>
      </div>
    </>
  );
};

export default ProcesosTable;
