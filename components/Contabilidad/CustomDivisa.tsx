import { SelectInput } from '@brick/core';
import OverviewContext from '@contexts/Overview';
import { buildMonedasList } from '@lib/helpers/Monedas.helpers';
import React, { useContext, useEffect, useState } from 'react';

type Props = {
  divisaOriginal: any;
  fila: any;
  index: any;
  eventosContables: any;
  eventosContablesOriginales: any;
  setEventosContables: any;
};

const CustomDivisa = (props: Props) => {
  const { monedas } = useContext(OverviewContext);
  const {
    divisaOriginal,
    index,
    eventosContables,
    eventosContablesOriginales,
    setEventosContables,
  } = props;
  const [initialValue, setInitialValue] = useState<any>({});

  const divisasMemo = React.useMemo(() => {
    return buildMonedasList(monedas);
  }, [monedas]);

  const updateRow = (e: any, index) => {
    let eventosContablesCopy = eventosContables;
    eventosContablesCopy[index].divisa = e.value;

    setEventosContables([...eventosContablesCopy]);
  };

  useEffect(() => {
    setInitialValue({
      text: divisaOriginal,
      value: divisaOriginal,
    });
  }, [divisaOriginal]);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <SelectInput
        variant="inline"
        items={divisasMemo}
        initialValue={initialValue}
        handlerBlur={(e: any) => {
          updateRow(e, index);
        }}
        disabled={
          eventosContablesOriginales[index].esDivisaOriginal ||
          (eventosContables[index].divisa &&
            eventosContables[index].esDuplicado)
        }
        inTable
      />
    </div>
  );
};

export default CustomDivisa;
