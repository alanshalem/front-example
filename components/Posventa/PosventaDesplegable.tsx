import React from 'react';
import { GenericTable } from '@components/Generic/GenericTable';
import { formatNumber } from '@lib/helpers/Posventa.helpers';

interface Props {
  posVentaGrillaDetalle: any;
}

export const PosventaDesplegable = ({ posVentaGrillaDetalle }: Props) => {
  const columnas = [
    {
      text: 'CUIT',
      dataField: 'cuit',
      sort: true,
      label: true,
    },
    {
      text: 'Razon Social',
      dataField: 'razonSocial',
      sort: true,
      label: true,
    },
    {
      text: 'Monto Operacion',
      dataField: 'montoOperacion',
      sort: true,
      label: true,
    },
    {
      text: 'Codigo de Concepto',
      dataField: 'codConcepto',
      sort: true,
    },

    {
      text: 'Nro. Cuenta',
      dataField: 'nroCuenta',
      sort: true,
      label: true,
    },
    {
      text: 'Monto Debitado',
      dataField: 'montoDebitado',
      sort: true,
      label: true,
    },
    {
      text: 'Monto Acreditado',
      dataField: 'montoAcreditado',
      sort: true,
      label: true,
    },
    {
      text: 'Fecha de Creacion',
      dataField: 'fechaCreacion',
      sort: true,
      label: true,
    },
    {
      text: 'Legajo Creacion',
      dataField: 'legajoCreacion',
      sort: true,
      label: true,
    },
  ];

  const row = posVentaGrillaDetalle
    ? {
        cuit: posVentaGrillaDetalle.cuit || '-',
        razonSocial: posVentaGrillaDetalle.razonSocial || '-',
        montoOperacion: posVentaGrillaDetalle.montoOperacion
          ? formatNumber(posVentaGrillaDetalle.montoOperacion)
          : '-',
        codConcepto: posVentaGrillaDetalle.codConcepto || '-',
        nroCuenta: posVentaGrillaDetalle.nroCuenta || '-',
        montoDebitado: posVentaGrillaDetalle.montoDebitado || '-',
        montoAcreditado: posVentaGrillaDetalle.montoAcreditado || '-',
        fechaCreacion: posVentaGrillaDetalle.fechaCreacion || '-',
        legajoCreacion: posVentaGrillaDetalle.legajoCreacion || '-',
      }
    : {};

  return (
    <div className="container-fluid">
      <GenericTable
        checks={false}
        rows={[row]}
        columns={columnas}
        pagination={false}
      />
    </div>
  );
};
