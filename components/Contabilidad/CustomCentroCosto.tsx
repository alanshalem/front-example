import { SelectInput } from '@brick/core';
import OverviewContext from '@contexts/Overview';
import { transformarArrayCentrosDeCostoContabilidadManual } from '@lib/helpers/Contabilidad.helpers';
import React, { useContext, useEffect, useState } from 'react';

type Props = {
  centroCostoOriginal: any;
  fila: any;
  index: any;
  eventosContables: any;
  eventosContablesOriginales: any;
  setEventosContables: any;
};

const CustomCentroCosto = (props: Props) => {
  const {
    centroCostoOriginal,
    index,
    eventosContables,
    eventosContablesOriginales,
    setEventosContables,
  } = props;
  const { centrosDeCosto } = useContext(OverviewContext);

  const [centrosDeCostoSelectInput, setCentrosDeCostoSelectInput] = useState<
    any
  >();

  useEffect(() => {
    if (centrosDeCosto) {
      setCentrosDeCostoSelectInput(
        transformarArrayCentrosDeCostoContabilidadManual(centrosDeCosto)
      );
    }
  }, [centrosDeCosto]);

  const [, setCentroCosto] = useState<string>('');
  const [initialValue, setInitialValue] = useState<any>({});

  const updateRow = (e: any, index) => {
    let eventosContablesCopy = eventosContables;
    eventosContablesCopy[index].centroCosto = e.value;

    setEventosContables([...eventosContablesCopy]);
  };

  useEffect(() => {
    setCentroCosto(centroCostoOriginal);
  }, []);

  useEffect(() => {
    setInitialValue({
      text: centroCostoOriginal,
      value: centroCostoOriginal,
    });
  }, [centroCostoOriginal]);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <SelectInput
        variant="inline"
        items={centrosDeCostoSelectInput}
        initialValue={initialValue}
        handlerBlur={(e: any) => {
          updateRow(e, index);
        }}
        disabled={
          eventosContablesOriginales[index].esCentroCostoOriginal ||
          (eventosContables[index].centroCosto &&
            eventosContables[index].esDuplicado)
        }
        inTable
      />
    </div>
  );
};

export default CustomCentroCosto;
