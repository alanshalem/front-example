import { useMsal } from '@azure/msal-react';
import { Button, Dropdown, Grid } from '@brick/core';
import { TableToolkit } from '@brick/table';
import { GenericTable } from '@components/Generic/GenericTable';
import { toastCallAux } from '@components/Toast/Toast.helpers';
import {
  handleAsignarConciliaciones,
  handleFinalizarConciliaciones,
} from '@lib/helpers/ConciliacionComexSAP.helpers';
import { convertISO8601ToDDMMAAAA } from '@lib/utils/Date';
import { formatNumberForInput } from '@lib/utils/Importe';
import React, { useEffect, useState } from 'react';
import ConciliacionComexSAPTableDesplegable from './ConciliacionComexSAPTableDesplegable';
import ObservacionesModal from './Observaciones/ObservacionesModal';
import { EstadosConciliacionComexSAPChip } from './EstadosConciliacionComexSAP.helpers';

type ConciliacionComexSAPRow = {
  idSapAlerta: number;
  fecha: string;
  tipoDiferencia: string;
  aplicacion: string;
  nroOperacionPosventa: string;
  nroRefOperPago: string;
  nroCuenta: string;
  montoCuenta: number;
  divisaCuenta: string;
  idAdicional: string;
  destUtilizacion1: string;
  destUtilizacion2: string;
  destUtilizacion3: string;
  legajoAsignado: string;
  fechaAsignado: string;
  legajoFinalizado: string;
  fechaFinalizado: string;
  estado: string;
}; 

type Props = {
  conciliacionesComexSAP: ConciliacionComexSAPRow[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  refreshTable: any;
  mensajeTablaVacia?: string;
};

const ConciliacionComexSAPTable: React.FC<Props> = ({
  conciliacionesComexSAP,
  setLoading,
  refreshTable,
  mensajeTablaVacia = 'No hay operaciones para mostrar.',
}) => {
  const [
    conciliacionesSeleccionadas,
    setConciliacionesSeleccionadas,
  ] = useState<number[]>([]);
  const { accounts } = useMsal();
  const legajo = accounts[0].username.slice(0, 8);

  const columnas = [
    {
      text: 'Asignado a',
      dataField: 'legajoAsignado',
      sort: true,
      label: true,
    },
    {
      text: 'Estado',
      dataField: 'estado',
      sort: true,
      label: true,
    },
    {
      text: 'Fecha',
      dataField: 'fecha',
      sort: true,
      label: true,
    },
    {
      text: 'Tipo De Diferencia',
      dataField: 'tipoDiferencia',
      sort: true,
      label: true,
    },
    {
      text: 'Aplicación',
      dataField: 'aplicacion',
      sort: true,
      label: true,
    },
    {
      text: 'N° Operacion',
      dataField: 'nroOperacionPosventa',
      sort: true,
      label: true,
    },
    {
      text: 'N° Ref. Oper. Pago',
      dataField: 'nroRefOperPago',
      sort: true,
      label: true,
    },
    {
      text: 'N° Cuenta',
      dataField: 'nroCuenta',
      sort: true,
      label: true,
    },
    {
      text: 'Moneda Cuenta',
      dataField: 'divisaCuenta',
      sort: true,
      label: true,
    },
    {
      text: 'Importe en Mon. Cuenta',
      dataField: 'montoCuenta',
      sort: true,
      label: true,
    },
    { text: '', dataField: 'elipse', sort: false },
  ];

  const botones = (
    <>
      <Grid direction="row" alignItems="center" className="m-12 p-12">
        <Grid.Item xs={1}>
          <Button
            onClick={() => handleButtonAction('asignar')}
            variant="secondary"
            size="small"
            iconAlign="right"
            iconType="check"
          >
            Asignar
          </Button>
        </Grid.Item>
        <Grid.Item xs={1}>
          <Button
            onClick={() => handleButtonAction('finalizar')}
            variant="primary"
            size="small"
            iconAlign="right"
            iconType="close"
          >
            Finalizar
          </Button>
        </Grid.Item>
      </Grid>
    </>
  );

  const handleButtonAction = async (action: 'asignar' | 'finalizar') => {
    if (conciliacionesSeleccionadas.length > 0) {
      if (action === 'asignar') {
        handleAsignarConciliaciones(
          conciliacionesSeleccionadas,
          legajo,
          setLoading,
          refreshTable
        );
      }
      if (action === 'finalizar') {
        handleFinalizarConciliaciones(
          conciliacionesSeleccionadas,
          legajo,
          setLoading,
          refreshTable
        );
      }
    } else {
      toastCallAux(`No hay operaciones seleccionadas para ${action}.`, false);
    }
  };

  const [info, setInfo] = useState<any[]>([]);

  const rows: any[] = [];

  const [showObservacionesModal, setShowObservacionesModal] = useState<boolean>(
    false
  );
  const [currentConciliacion, setCurrentConciliacion] = useState<any>();

  const setConciliacion = (b: any) => {
    setCurrentConciliacion(b);
  };

  function pushRows(e: any) {
    const itemsArr = [
      {
        text: 'Ver Observaciones',
        onClick: () => {
          setConciliacion(e);
          setShowObservacionesModal(!showObservacionesModal);
        },
      },
    ];
    return rows.push({
      legajoAsignado: e.legajoAsignado || '-',
      estado: <EstadosConciliacionComexSAPChip estado={e.estado} /> || '-',
      fecha: convertISO8601ToDDMMAAAA(e.fecha) || '-',
      tipoDiferencia: e.tipoDiferencia || '-',
      aplicacion: e.aplicacion || '-',
      nroOperacionPosventa: e.nroOperacionPosventa || '-',
      nroRefOperPago: e.nroRefOperPago || '-',
      nroCuenta: e.nroCuenta || '-',
      divisaCuenta: e.divisaCuenta || '-',
      montoCuenta: formatNumberForInput(e.montoCuenta) || '-',
      elipse: (
        <div className="text-right">
          <Dropdown items={itemsArr} isStatic />
        </div>
      ),
      expandible: {
        render: (
          <ConciliacionComexSAPTableDesplegable conciliacionComexSAP={e} />
        ),
      },
    });
  }

  const handleCheck = row => {
    const {
      idSapAlerta,
    } = row.row.expandible.render.props.conciliacionComexSAP;
    const isChecked = row.checked;

    if (isChecked) {
      setConciliacionesSeleccionadas(prevState => [...prevState, idSapAlerta]);
    } else {
      setConciliacionesSeleccionadas(prevState =>
        prevState.filter(id => id !== idSapAlerta)
      );
    }
  };

  const handleOnSelectAll = checked => {
    if (checked) {
      const ids = info.map(
        row => row.expandible.render.props.conciliacionComexSAP.idSapAlerta
      );
      setConciliacionesSeleccionadas(ids);
    } else {
      setConciliacionesSeleccionadas([]);
    }
  };

  useEffect(() => {
    if (!!conciliacionesComexSAP) {
      conciliacionesComexSAP.forEach((e: any) => {
        return pushRows(e);
      });
      setInfo(rows);
    }
  }, [conciliacionesComexSAP]);

  return (
    <>
      <div className="container-fluid">
        <div className="mb-24">
          {botones}
          <TableToolkit keyField="id" data={info}>
            {() => (
              <>
                <GenericTable
                  columns={columnas}
                  rows={info}
                  expandible
                  pagination
                  handleCheck={handleCheck}
                  handleOnSelectAll={handleOnSelectAll}
                  mensajeTablaVacia={mensajeTablaVacia}
                />
              </>
            )}
          </TableToolkit>
        </div>
        <ObservacionesModal
          visible={showObservacionesModal}
          close={() => {
            setShowObservacionesModal(false);
          }}
          conciliacion={currentConciliacion}
        />
      </div>
    </>
  );
};

export default ConciliacionComexSAPTable;
