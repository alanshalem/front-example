import React, { useEffect, useState } from 'react';
import { Modal } from '@brick/core';
import { convertISO8601ToDDMMAAAA } from '@lib/utils/Date';
import { formatNumberForInput } from '@lib/utils/Importe';
import {
  AvisosModalDetalleProps,
  DetalleAviso,
} from '@lib/types/Alertas/Alertas.types';
import { GenericTable } from '@components/Generic/GenericTable';

const AlertasModalDetalle: React.FC<AvisosModalDetalleProps> = ({
  isModalActive,
  closeModal,
  alertasConciliacionList = [],
  dataModal,
  setDataModal,
}) => {
  const [info, setInfo] = useState<any>([]);
  const [dataDetalle, setDataDetalle] = useState<DetalleAviso[]>([]);

  const closeToogle = () => {
    setDataDetalle([]);
    setDataModal(null);
    closeModal();
  };

  useEffect(() => {
    if (dataModal !== null) {
      const findDetalle = alertasConciliacionList.find(e => e.id === dataModal);
      const detalle = findDetalle?.detalle || [];
      setDataDetalle(detalle);
    }
  }, [dataModal]);

  const columns = [
    {
      dataField: 'rubro',
      text: 'Rubro',
      sort: true,
    },
    {
      dataField: 'centroDeCosto',
      text: 'Centro de Costo',
      sort: true,
    },
    {
      dataField: 'tipoMovimiento',
      text: 'Tipo de Movimiento',
      sort: true,
    },
    {
      dataField: 'divisa',
      text: 'Divisa',
      sort: true,
    },
    {
      dataField: 'importe',
      text: 'Importe',
      sort: true,
    },
    {
      dataField: 'fechaValor',
      text: 'Fecha Valor',
    },
  ];

  function pushRows(e: any, rows: any) {
    return rows.push({
      importe: e.importe ? formatNumberForInput(e.importe) : '-',
      fechaValor: e.fechaValor ? convertISO8601ToDDMMAAAA(e.fechaValor) : '-',
      divisa: e.divisa || '-',
      tipoMovimiento: e.tipoMovimiento || '-',
      centroDeCosto: e.centroDeCosto || '-',
      rubro: e.rubro || '-',
    });
  }

  useEffect(() => {
    const rows: any[] = [];
    if (Array.isArray(dataDetalle) && dataDetalle.length > 0) {
      dataDetalle.forEach((e: any) => {
        return pushRows(e, rows);
      });
      setInfo(rows);
    }
  }, [dataDetalle]);

  return (
    <>
      <Modal active={isModalActive} customWidth="1300px">
        <Modal.Title
          iconCloseAction={() => closeToogle()}
          titleText="Detalles"
        ></Modal.Title>
        <Modal.Body customHeight={'100vh'}>
          <>
            <GenericTable columns={columns} rows={info} checks={false} />
          </>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AlertasModalDetalle;