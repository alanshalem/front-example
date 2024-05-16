import React from 'react';
import { GenericTable } from '@components/Generic/GenericTable';

type Observacion = {
  id: number; // Assuming you have an ID field for each observacion
  observacion: string;
  legajo: string;
  fechaObservacion: string;
};

type Props = {
  observaciones: Observacion[] | null | undefined;
};
 
const ObservacionesTable: React.FC<Props> = ({ observaciones }) => {
  const columnas = [
    {
      text: 'Observación',
      dataField: 'observacion',
      sort: false,
      label: true,
    },
    {
      text: 'Legajo',
      dataField: 'legajo',
      sort: false,
      label: true,
    },
    {
      text: 'Fecha de Observación',
      dataField: 'fechaObservacion',
      sort: false,
      label: true,
    },
  ];

  const rows = observaciones
    ? observaciones.map((observacion, index) => ({
        id: index,
        observacion: observacion.observacion,
        legajo: observacion.legajo,
        fechaObservacion: new Date(
          observacion.fechaObservacion
        ).toLocaleString(),
      }))
    : [];

  return (
    <div className="container-fluid">
      <GenericTable
        columns={columnas}
        rows={rows}
        pagination
        mensajeTablaVacia="No se encontraron observaciones"
        checks={false}
      />
    </div>
  );
};

export default ObservacionesTable;
