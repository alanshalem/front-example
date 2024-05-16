import React, { useEffect, useState, useCallback } from 'react';
import { Dropdown } from '@brick/core';
import { GenericTable } from '@components/Generic/GenericTable';
import { EstadosChip } from '@lib/helpers/EstadosPrevisiones.helpers';
import {
  guardarPrevision,
  mesActual,
  realizarAprobacion,
} from '@lib/helpers/Previsiones.helpers';
import {
  PrevisionPost,
  PrevisionResponse,
  RowsPrevisionesProps,
} from '@lib/types/Previsiones/Previsiones.types';
import { toastCallAux } from '@components/Toast/Toast.helpers';
import { CustomTextInputImportePrevisiones } from './CustomTextInputImportePrevisiones';
import { useMsal } from '@azure/msal-react';
import { tienePermisos } from '@lib/helpers/Auth.helpers';
import { funcionalidades, acciones } from '../../config/ConfigurationService';
import AuthContext from '@contexts/Auth/AuthContext';
import { formatNumberForInput } from '@lib/utils/Importe';
import { ItemDropdown } from '@lib/types/ItemDropdown.types';

type Props = {
  mensajeTablaVacia?: string;
  previsiones: PrevisionResponse[];
  setPrevisionesList: React.Dispatch<React.SetStateAction<PrevisionResponse[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  periodo: string;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  tiposAnaliticoPrevisionesMemo: ItemDropdown[];
};

const PrevisionesTable = ({
  mensajeTablaVacia = 'No hay operaciones para mostrar.',
  previsiones,
  setPrevisionesList,
  setLoading,
  periodo,
  setRefresh,
  tiposAnaliticoPrevisionesMemo,
}: Props) => {
  const [info, setInfo] = useState<any>([]);
  const { accounts } = useMsal();
  const authContext = React.useContext(AuthContext);

  const previsionesCopy = previsiones;

  const columns = [
    {
      dataField: 'periodo',
      text: 'Periodo',
    },
    {
      dataField: 'corresponsal',
      text: 'Corresponsal',
      sort: true,
      label: true,
    },
    {
      dataField: 'divisa',
      text: 'Divisa',
      sort: true,
    },
    {
      dataField: 'promedioUltimosPeriodos',
      text: 'Promedio 3 Ultimos Periodos',
      sort: true,
      currency: '$',
    },
    {
      dataField: 'previsionRemanente',
      text: 'Prevision Remanente',
      sort: true,
      currency: '$',
    },
    {
      dataField: 'previsionAprobada',
      text: 'Prevision Aprobada',
      sort: true,
      currency: '$',
    },
    {
      dataField: 'importePrevisionar',
      text: 'Importe Previsionar',
    },
    {
      dataField: 'estado',
      text: 'Estado',
    },
    {
      dataField: 'elipse',
      text: '',
    },
  ];
  const handleSavePrevision = (prevision: PrevisionResponse) => {
    tienePermisos(
      funcionalidades.prevision,
      acciones.sign,
      authContext.permisos,
      async () => {
        const [legajo] = accounts[0].username.split('@');
        const previsionNew: PrevisionPost = {
          idCorresponsal: prevision.idCorresponsal,
          divisa: prevision.divisa,
          periodo: periodo,
          importePrevisionar: prevision.importePrevisionar,
          idTipoAnalitico: tiposAnaliticoPrevisionesMemo[0].value,
          legajoCreacion: legajo,
        };
        setLoading(true);
        guardarPrevision(previsionNew, setLoading, setRefresh);
      }
    );
  };

  const handleApprovePrevision = (prevision: PrevisionResponse) => {
    tienePermisos(
      funcionalidades.prevision,
      acciones.sign,
      authContext.permisos,
      async () => {
        const legajoAprobacion = accounts[0].username.slice(0, 8);
        const grupo = (accounts[0].idTokenClaims.groups[0] as string) || '';
        const rol: string = grupo
        const id = prevision.idAnalitico;
        if (rol.endsWith("Firmante")) {
          const userFirmante = {
            grupo,
            legajoAprobacion,
          };
          setLoading(true);
          realizarAprobacion(id, userFirmante, setLoading, setRefresh);
        } else {
          toastCallAux('No tienes permisos para ejecutar esta accion', false);
        }
      }
    );
  };

  const handleDebounce = useCallback(
    (index: number, value: string) => {
      const sanitizedValue = value.replace(/\s/g, '').replace(/\./g, '');
      const parsedValue = parseFloat(sanitizedValue.replace(',', '.'));
  
      if (!isNaN(parsedValue)) {
        previsionesCopy[index].importePrevisionar = parsedValue;
        setPrevisionesList([...previsionesCopy]);
      } else {
        toastCallAux('Monto no válido', false);
      }
    },
    [previsionesCopy, setPrevisionesList]
  );
  

  function pushRows(
    e: PrevisionResponse,
    index: number,
    rows: RowsPrevisionesProps[]
  ) {
    const itemsArr = [];

    if (periodo > mesActual) {
      itemsArr.push({
        text: 'Guardar',
        onClick: () => {
          handleSavePrevision(e);
        },
      });
      if (e.nombreEstado === 'Alta' || e.nombreEstado === 'Aprobado') {
        itemsArr.push({
          text: 'Aprobar',
          onClick: () => {
            handleApprovePrevision(e);
          },
        });
      }
    }

    return rows.push({
      periodo: periodo,
      corresponsal: e.swift,
      divisa: e.divisa,
      promedioUltimosPeriodos: formatNumberForInput(e.promedioUltimosPeriodos),
      previsionRemanente: formatNumberForInput(e.previsionAmortizada),
      previsionAprobada: formatNumberForInput(e.previsionAprobada),
      importePrevisionar: (
        <>
          <CustomTextInputImportePrevisiones
            importe={e.importePrevisionar}
            handleDebounce={handleDebounce}
            index={index}
            periodo={periodo}
            montoOriginal={e.importePrevisionar}
          />
        </>
      ),
      estado: <EstadosChip estado={e.nombreEstado} />,
      elipse: (
        <div className="text-right">
          <Dropdown items={itemsArr} isStatic />
        </div>
      ),
    });
  }

  //Mapea los datos de la tabla
  useEffect(() => {
    const rows: RowsPrevisionesProps[] = [];
    if (previsionesCopy.length > 0) {
      previsionesCopy.forEach((e: PrevisionResponse, i: number) => {
        return pushRows(e, i, rows);
      });
      setInfo(rows);
    }
  }, [previsionesCopy]);

  return (
    <>
      <div className="container-fluid">
        <div>
          <GenericTable
            rows={info}
            columns={columns}
            sizePerPage={10}
            paginationSize={10}
            mensajeTablaVacia={mensajeTablaVacia}
            checks={false}
          />
        </div>
      </div>
    </>
  );
};

export default PrevisionesTable;
