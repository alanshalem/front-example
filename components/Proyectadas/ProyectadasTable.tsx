/* eslint-disable react-hooks/exhaustive-deps */
import { useMsal } from '@azure/msal-react';
import { Dropdown } from '@brick/core';
import { ConfirmationModal } from '@components/ConfirmationModal/ConfirmationModal';
import { GenericTable } from '@components/Generic/GenericTable';
import { funcionalidades,acciones } from '../../config/ConfigurationService';
import AuthContext from '@contexts/Auth/AuthContext';
import { tienePermisos } from '@lib/helpers/Auth.helpers';
import { ordenarFecha } from '@lib/helpers/Proyectadas.helpers';
import { bajaProyectada } from '@lib/services/Proyectadas.services';
import { Proyectada } from '@lib/types/Proyectada.types';
import React, { useContext, useEffect, useState } from 'react';
import { ProyectadasDesplegable } from './ProyectadasDesplegable';

interface Props {
  proyectadas: Proyectada[];
  refreshTable: () => void;
  toastCall: (title: string, success: boolean) => void;
  mensajeTablaVacia: string;
}

export const ProyectadasTable = ({
  proyectadas,
  refreshTable,
  toastCall,
  mensajeTablaVacia,
}: Props) => {
  const [info, setInfo] = useState<any[]>([]);
  const [currentProyectada, setCurrentProyectada] = useState<Proyectada>();
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(
    false
  );

  const authContext = useContext(AuthContext);

  const setComision = (b: any) => {
    setCurrentProyectada(b);
  };

  const columnas = [
    { text: 'CUIT/CUIL', dataField: 'cuit', sort: true },
    { text: 'Nombre/Razón social', dataField: 'denominacion', sort: true },
    { text: 'Moneda', dataField: 'moneda', sort: true },
    {
      text: 'Monto',
      dataField: 'monto',
      sort: true,
      currency: '$',
      arsCurrencyFormat: true,
      currencyPosition: 'before',
    },
    {
      text: 'Monto USD',
      dataField: 'montoUsd',
      sort: true,
      currency: '$',
      arsCurrencyFormat: true,
      currencyPosition: 'before',
    },
    { text: 'Nro RAyPE', dataField: 'raype', sort: true },
    { text: 'Código de Concepto', dataField: 'concepto', sort: true },
    {
      text: 'Fecha de Proyección',
      dataField: 'fechaProyectada',
      sort: true,
      sortFunc: ordenarFecha,
    },
    { text: '', dataField: 'elipse', sort: false },
  ];

  const rows: any[] = [];

  function pushRows(e: Proyectada) {
    const itemsArr = [
      {
        text: 'Eliminar',
        onClick: () => {
          tienePermisos(funcionalidades.proyectada, acciones.delete, authContext.permisos, () => {
            setComision(e);
            setShowConfirmationModal(!showConfirmationModal);
          });
        },
      },
    ];
    return rows.push({
      cuit: e.cuit ?? '-',
      denominacion: e.denominacion ? e.denominacion : '-',
      monto: e.monto ? e.monto : '-',
      montoUsd: e.montoUsd ? e.montoUsd : '-',
      moneda: e.moneda ? e.moneda : '-',
      concepto: e.codigoConcepto ? e.codigoConcepto : '-',
      raype: e.raype ? e.raype : '-',
      fechaProyectada: e.fechaProyectada ? e.fechaProyectada.slice(0, 10) : '-',
      elipse: (
        <div className="text-right">
          <Dropdown items={itemsArr} isStatic />
        </div>
      ),
      expandible: {
        render: (
          <ProyectadasDesplegable proyectada={e} />
        ),
      },
    });
  }

  const { accounts } = useMsal();
  const legajo = accounts[0].username;

  //Mapea los datos de la tabla
  useEffect(() => {
    if (!!proyectadas) {
      proyectadas.forEach((e: any) => {
        return pushRows(e);
      });
      setInfo(rows);
    }
  }, [proyectadas]);

  return (
    <>
      <div className="container-fluid">
        <div>
          <GenericTable 
            rows={info}
            columns={columnas}
            mensajeTablaVacia={mensajeTablaVacia}
            expandible
          />
          {/* nueva proyectada modal con la prop isEdition */}
          <ConfirmationModal
            visible={showConfirmationModal}
            close={() => setShowConfirmationModal(false)}
            message={'¿Esta seguro/a que desea eliminar?'}
            successMsj={'Borrado exitosamente'}
            errorMsj={'No se pudo borrar'}
            objectId={currentProyectada?.id}
            legajo={legajo}
            bajaFunc={bajaProyectada}
            refreshTable={refreshTable}
            toastCall={toastCall}
          />
        </div>
      </div>
    </>
  );
};
