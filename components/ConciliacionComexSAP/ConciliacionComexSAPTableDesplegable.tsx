import React from 'react';
import { GenericTable } from '@components/Generic/GenericTable';

type ConciliacionComexSAPData = {
  idAdicional?: string;
  destUtilizacion1?: string;
  destUtilizacion2?: string;
  destUtilizacion3?: string;
  tipoDiferencia?: string;
};

type Props = {
  conciliacionComexSAP: ConciliacionComexSAPData | null;
}; 

const ConciliacionComexSAPTableDesplegable: React.FC<Props> = ({
  conciliacionComexSAP,
}) => {
  const columnas = [
    {
      text: 'ID Adicional',
      dataField: 'idAdicional',
      sort: true,
      label: true,
    },
    {
      text: 'Dest. utilización 1',
      dataField: 'destUtilizacion1',
      sort: true,
    },
    {
      text: 'Dest. utilización 2',
      dataField: 'destUtilizacion2',
      sort: true,
    },
    {
      text: 'Dest. utilización 3',
      dataField: 'destUtilizacion3',
      sort: true,
    },
  ];

  const defaultRowValues: ConciliacionComexSAPData = {
    idAdicional: '-',
    destUtilizacion1: '-',
    destUtilizacion2: '-',
    destUtilizacion3: '-',
  };

  const row: ConciliacionComexSAPData =
    conciliacionComexSAP || defaultRowValues;

  return (
    <div className="container-fluid">
      <GenericTable
        rows={[row]}
        columns={columnas}
        pagination={false}
        checks={false}
      />
    </div>
  );
};

export default ConciliacionComexSAPTableDesplegable;
