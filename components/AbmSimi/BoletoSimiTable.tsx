/* eslint-disable react-hooks/exhaustive-deps */
import { useMsal } from '@azure/msal-react';
import { Dropdown } from '@brick/core';
import { ConfirmationModal } from '@components/ConfirmationModal/ConfirmationModal';
import { GenericTable } from '@components/Generic/GenericTable';
import AuthContext from '@contexts/Auth/AuthContext';
import { tienePermisos } from '@lib/helpers/Auth.helpers';
import { returnEstado, returnExcepcion } from '@lib/helpers/BoletoSimi.helpers';
import { EstadosChip } from '@lib/helpers/EstadosSimi.helpers';
import { bajaBoletoSimi } from '@lib/services/BoletoSimi/Boletosimi.services';
import { BoletoSimi } from '@lib/types/BoletoSimi/BoletoSimi.types';
import React, { useContext, useEffect, useState } from 'react';
import { acciones, funcionalidades } from '../../config/ConfigurationService';

interface Props {
  boletosSimi: BoletoSimi[];
  refreshTable: () => void;
  toastCall: (title: string, success: boolean) => void;
}

interface RowsProps {
  nroBoleto: string;
  nroSimi: string;
  ccuce: string;
  secuenciaBoletoMultiple: string;
  excepcion: string;
  fechaCreacion: string;
  fechaExportacion: string;
  fechaModificacion: string;
  legajoCreacion: string;
  legajoUltimaModificacion: string;
  legajoAutorizacion: string;
  idEstado: JSX.Element;
  elipse: JSX.Element;
}

export const BoletoSimiTable = ({
  boletosSimi,
  refreshTable,
  toastCall,
}: Props) => {
  const [info, setInfo] = useState<RowsProps[]>([]);
  const [currentBoletoSimi, setCurrentBoletoSimi] = useState<BoletoSimi>();
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(
    false
  );

  const authContext = useContext(AuthContext);
  const { accounts } = useMsal();

  const setBoletoSimi = (b: any) => {
    setCurrentBoletoSimi(b);
  };

  const calcularHoras = (fecha: string): string => {
    if (new Date(fecha).getHours() >= 10) {
      return new Date(fecha).toLocaleTimeString().slice(0, 5);
    } else {
      return new Date(fecha).toLocaleTimeString().slice(0, 4);
    }
  };

  const columnas = [
    { text: 'Nro. Boleto', dataField: 'nroBoleto', sort: true },
    { text: 'Nro. SIRA', dataField: 'nroSimi', sort: true },
    { text: 'Nro. Ccuce', dataField: 'ccuce', sort: true },
    {
      text: 'Secuencia Boletos Multiples',
      dataField: 'secuenciaBoletoMultiple',
      sort: true,
    },
    { text: 'Excepción', dataField: 'excepcion', sort: true },
    { text: 'Fecha de Creación', dataField: 'fechaCreacion', sort: true },
    { text: 'Fecha de Exportación', dataField: 'fechaExportacion', sort: true },
    {
      text: 'Fecha de Ult. Modificación',
      dataField: 'fechaModificacion',
      sort: true,
    },
    { text: 'Legajo Creación', dataField: 'legajoCreacion', sort: true },
    {
      text: 'Legajo Ult. Modificación',
      dataField: 'legajoUltimaModificacion',
      sort: true,
    },
    {
      text: 'Legajo Autorización',
      dataField: 'legajoAutorizacion',
      sort: true,
    },
    { text: 'Estado', dataField: 'idEstado', sort: true },
    { text: '', dataField: 'elipse', sort: false },
  ];

  const rows: RowsProps[] = [];

  function pushRows(e: BoletoSimi) {
    const itemsArr = [
      {
        text: 'Eliminar',
        onClick: () => {
          tienePermisos(
            funcionalidades.simi,
            acciones.delete,
            authContext.permisos,
            () => {
              setBoletoSimi(e);
              setShowConfirmationModal(!showConfirmationModal);
            }
          );
        },
      },
    ];
    return rows.push({
      nroBoleto: e.nroBoleto ? e.nroBoleto : '-',
      nroSimi: e.nroSimi ?? '-',
      ccuce: e.ccuce ?? '-',
      secuenciaBoletoMultiple: e.secuenciaBoletoMultiple ?? '-',
      excepcion:
        e.codigoExcepcion && e.descExcepcion
          ? returnExcepcion(e.codigoExcepcion, e.descExcepcion)
          : 'Sin Excepcion',
      fechaCreacion: e.fechaCreacion
        ? `${new Date(e.fechaCreacion).toLocaleDateString()} ${calcularHoras(
            e.fechaCreacion
          )}`
        : '-',
      fechaExportacion: e.fechaExportacion
        ? `${new Date(e.fechaExportacion).toLocaleDateString()} ${calcularHoras(
            e.fechaExportacion
          )}`
        : '-',
      fechaModificacion: e?.fechaModificacion
        ? `${new Date(
            e.fechaModificacion
          ).toLocaleDateString()} ${calcularHoras(e.fechaModificacion)}`
        : '-',
      legajoCreacion: e.legajoCreacion ? e.legajoCreacion : '-',
      legajoUltimaModificacion: e.legajoUltimaModificacion
        ? e.legajoUltimaModificacion
        : '-',
      legajoAutorizacion: e.legajoAutorizador ? e.legajoAutorizador : '-',
      idEstado: <EstadosChip estado={returnEstado(e.idEstado)} />,
      elipse: (
        <div className="text-right">
          <Dropdown items={itemsArr} disabled={e.idEstado !== 1} isStatic />
        </div>
      ),
    });
  }

  //Mapea los datos de la tabla
  useEffect(() => {
    if (boletosSimi.length > 0) {
      boletosSimi.forEach((e: any) => {
        return pushRows(e);
      });
      setInfo(rows);
    }
  }, [boletosSimi]);

  return (
    <>
      <div className="container-fluid">
        <div>
          <GenericTable rows={info} columns={columnas} />
          {/* nueva proyectada modal con la prop isEdition */}
          <ConfirmationModal
            visible={showConfirmationModal}
            close={() => setShowConfirmationModal(false)}
            message={'¿Esta seguro/a que desea eliminar?'}
            successMsj={'Borrado exitosamente'}
            errorMsj={'No se pudo borrar'}
            objectId={currentBoletoSimi?.id}
            legajo={accounts[0].username.slice(0, 8)}
            bajaFunc={bajaBoletoSimi}
            refreshTable={refreshTable}
            toastCall={toastCall}
          />
        </div>
      </div>
    </>
  );
};
