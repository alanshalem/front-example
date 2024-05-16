/* eslint-disable react-hooks/exhaustive-deps */
import { GenericTable } from '@components/Generic/GenericTable';
import React from 'react';
import { CustomTextInputPosventaACobrar } from './CustomTextInputPosventaACobrar';
import { CustomTextInputPosventaADevolver } from './CustomTextInputPosventaADevolver';

type ImpuestosProps = {
  datosImpuestos: any[];
  handleImpuestoData: (data: any[]) => void;
  onFormattingStart: () => void;
  onFormattingEnd: () => void;
};

export const ImpuestosTable = ({
  datosImpuestos,
  handleImpuestoData,
  onFormattingStart,
  onFormattingEnd,
}: ImpuestosProps) => {
  const columnas = [
    {
      text: 'Concepto',
      dataField: 'concepto',
      sort: true,
      label: true,
    },
    {
      text: 'Divisa Cuenta',
      dataField: 'divisa',
      sort: true,
      label: true,
    },
    {
      text: 'Monto Original',
      dataField: 'montoOriginal',
      sort: true,
      currency: '$',
      arsCurrencyFormat: true,
      currencyPosition: 'before',
    },
    {
      text: 'Monto Acreditado',
      dataField: 'montoDevuelto',
      sort: true,
      currency: '$',
      arsCurrencyFormat: true,
      currencyPosition: 'before',
    },
    {
      text: 'Monto Debitado',
      dataField: 'montoCobrado',
      sort: true,
      currency: '$',
      arsCurrencyFormat: true,
      currencyPosition: 'before',
    },
    {
      text: 'Monto a Acreditar',
      dataField: 'montoADevolver',
      sort: true,
      state: true,
    },
    {
      text: 'Monto a Debitar',
      dataField: 'montoACobrar',
      sort: true,
      state: true,
    },
  ];

  const rows: any[] = [];
  //Mapea los datos de la tabla
  const filas = React.useMemo(() => {
    if (datosImpuestos.length > 0) {
      datosImpuestos.forEach((e: any, index:number) => {
        return pushRows(e, index);
      });
    }
    return rows;
  }, [datosImpuestos]);

  function pushRows(e: any, index: number) {
    return rows.push({
      concepto: e.concepto ? e.concepto : '-',
      divisa: e.divisa ? e.divisa : '-',
      montoOriginal: e.montoOriginal !== null ? e.montoOriginal : '-',
      montoDevuelto: e.montoDevuelto !== null ? e.montoDevuelto : '-',
      montoCobrado: e.montoCobrado !== null ? e.montoCobrado : '-',
      montoADevolver: (
        <CustomTextInputPosventaADevolver
          concepto={e.concepto}
          montoOriginal={JSON.stringify(e.montoOriginal)}
          montoDevuelto={JSON.stringify(e.montoDevuelto)}
          montoCobrado={JSON.stringify(e.montoCobrado)}
          handleImpuestoData={handleImpuestoData}
          divisa={e.divisa}
          alicuota={e.alicuota}
          idPosVentaParametriaTipo={e.idPosVentaParametriaTipo}
          esDevolucion={e.esDevolucion}
          esReversaObligatoria={e.esReversaObligatoria}
          onFormattingStart={onFormattingStart}
          onFormattingEnd={onFormattingEnd}
          idImpuesto={e.idImpuesto}
          index={index}
        />
      ),
      montoACobrar: (
        <CustomTextInputPosventaACobrar
          concepto={e.concepto}
          montoOriginal={JSON.stringify(e.montoOriginal)}
          handleImpuestoData={handleImpuestoData}
          divisa={e.divisa}
          alicuota={e.alicuota}
          idPosVentaParametriaTipo={e.idPosVentaParametriaTipo}
          esCobro={e.esCobro}
          esReversaObligatoria={e.esReversaObligatoria}
          onFormattingStart={onFormattingStart}
          onFormattingEnd={onFormattingEnd}
          montoCobrado={e.montoCobrado}
          montoDevuelto={e.montoDevuelto}
          idImpuesto={e.idImpuesto}
          index={index}
        />
      ),
    });
  }

  return (
    <div className="container-fluid">
      <GenericTable
        rows={filas}
        columns={columnas}
        pagination={false}
        editCells={{
          mode: 'click',
        }}
        checks={false}
      />
    </div>
  );
};
