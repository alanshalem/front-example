import { Dropdown } from '@brick/core';
import { GenericTable } from '@components/Generic/GenericTable';
import React, { useEffect, useState } from 'react';
import CustomCentroCosto from './CustomCentroCosto';
import CustomDivisa from './CustomDivisa';
import CustomImporte from './CustomImporte';
import CustomRubro from './CustomRubro';

type Props = {
  mensajeTablaVacia?: string;
  eventosContables: any[];
  eventosContablesOriginales: any[];
  setEventosContables: React.Dispatch<React.SetStateAction<any[]>>;
  setEventosContablesOriginales: React.Dispatch<React.SetStateAction<any[]>>;
};

const NuevoAnaliticoModalTable = ({
  eventosContablesOriginales,
  setEventosContablesOriginales,
  eventosContables,
  setEventosContables,
}: Props) => {
  // rubro - tipoMovimiento - centroCosto - moneda - importe - esDuplicable
  const columnas = [
    {
      dataField: 'rubro',
      text: 'Rubro',
      sort: true,
      label: true,
    },
    {
      dataField: 'tipoMovimiento',
      text: 'Débito/Crédito',
      sort: true,
      label: true,
    },
    {
      dataField: 'centroCosto',
      text: 'Centro de Costo',
      sort: true,
      label: true,
    },
    {
      dataField: 'divisa',
      text: 'Moneda',
      sort: true,
      label: true,
    },
    {
      dataField: 'importe',
      text: 'Importe',
      sort: true,
    },
    { text: '', dataField: 'elipse', sort: false },
  ];

  const [info, setInfo] = useState<any[]>([]);

  const handleDuplicar = e => {
    const evento = {
      ...e,
      esDuplicado: true,
      idDuplicado: Math.random()
        .toString(36)
        .slice(2, 11),
    };

    // Copiar los datos necesarios del evento original al duplicado
    if (e.divisa) {
      evento.divisa = e.divisa;
    }
    if (e.importe) {
      evento.importe = e.importe;
    }
    if (e.centroCosto) {
      evento.centroCosto = e.centroCosto;
    }

    setEventosContables([...eventosContables, evento]);
    setEventosContablesOriginales([...eventosContablesOriginales, evento]);
  };

  const handleEliminar = e => {
    const newItems = eventosContables.filter(
      item => item.idDuplicado !== e.idDuplicado
    );
    setEventosContables(newItems);
    setEventosContablesOriginales(newItems);
  };

  function pushRows(e: any, idx: number, rows: any) {
    const itemsArr = [
      e.esDuplicado
        ? {
            text: 'Eliminar',
            onClick: () => {
              handleEliminar(e);
            },
          }
        : {
            text: 'Duplicar',
            onClick: () => {
              handleDuplicar(e);
            },
          },
    ];

    rows.push({
      rubro: (
        <CustomRubro
          rubroOriginal={e.rubro}
          fila={e}
          index={idx}
          eventosContables={eventosContables}
          eventosContablesOriginales={eventosContablesOriginales}
          setEventosContables={setEventosContables}
        />
      ),
      tipoMovimiento: e.tipoMovimiento ? e.tipoMovimiento : '-',
      centroCosto: (
        <CustomCentroCosto
          centroCostoOriginal={e.centroCosto}
          fila={e}
          index={idx}
          eventosContables={eventosContables}
          eventosContablesOriginales={eventosContablesOriginales}
          setEventosContables={setEventosContables}
        />
      ),
      divisa: (
        <CustomDivisa
          divisaOriginal={e.divisa}
          fila={e}
          index={idx}
          eventosContables={eventosContables}
          eventosContablesOriginales={eventosContablesOriginales}
          setEventosContables={setEventosContables}
        />
      ),
      importe: (
        <CustomImporte
          importeOriginal={e.importe}
          fila={e}
          index={idx}
          eventosContables={eventosContables}
          eventosContablesOriginales={eventosContablesOriginales}
          setEventosContables={setEventosContables}
        />
      ),
      elipse: (
        <div className="text-right">
          <Dropdown items={itemsArr} disabled={!e.esDuplicable} isStatic />
        </div>
      ),
    });
  }

  // Mapea los datos de la tabla
  useEffect(() => {
    const rows: any[] = [];
    if (eventosContablesOriginales?.length > 0) {
      eventosContablesOriginales.forEach((e: any, idx) => {
        return pushRows(e, idx, rows);
      });
      setInfo(rows);
    }
  }, [eventosContablesOriginales, eventosContables]);

  return (
    <div className="container-fluid">
      <GenericTable checks={false} rows={info} columns={columnas} />
    </div>
  );
};

export default NuevoAnaliticoModalTable;
