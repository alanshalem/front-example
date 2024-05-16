/* eslint-disable react-hooks/exhaustive-deps */
import { GenericTable } from '@components/Generic/GenericTable';
import React, { useState, useEffect } from 'react';
import { Diferencia, OpcamTopsAuxiliar } from './CruceOpcamTopsPage';

type Props = {
  cruces: OpcamTopsAuxiliar;
  diferencias: Diferencia[];
};

const CruceOpcamTopsDesplegable = ({ cruces, diferencias }: Props) => {
  const [info, setInfo] = useState<any[]>([]);

  const columnas = [
    {
      text: 'Tipo de Diferencia',
      dataField: 'tipoDiferencia',
      sort: true,
      label: true,
    },
    {
      text: 'Valor de Aplicación',
      dataField: 'valorAplicacion',
      sort: true,
    },
    {
      text: 'Valor de OPCAM',
      dataField: 'valorOpcam',
      sort: true,
      label: true,
    },
  ];
  const rows: any[] = [];

  //Mapea los datos de la tabla
  useEffect(() => {
    if (!!diferencias) {
      diferencias.forEach((e: any) => {
        return pushRows(e);
      });
      setInfo(rows);
    }
  }, [diferencias]);

  function pushRows(e: Diferencia) {
    return rows.push({
      tipoDiferencia: e.tipoDiferencia,
      valorAplicacion:
        e.valorAplicacion.length > 0
          ? e.valorAplicacion
          : `No existe valor en ${cruces.aplicacion}`,
      valorOpcam:
        e.valorOpcam.length > 0 ? e.valorOpcam : 'No existe el valor en OPCAM',
    });
  }

  return (
    <div className="container-fluid">
      <GenericTable rows={info} columns={columnas} pagination={false} />
    </div>
  );
};

export default CruceOpcamTopsDesplegable;
