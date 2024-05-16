import { TextInput } from '@brick/core';
import React, { useEffect, useState } from 'react';

type Props = {
  importeOriginal: any;
  fila: any;
  index: any;
  eventosContables: any;
  eventosContablesOriginales: any;
  setEventosContables: any;
};

const CustomImporte = (props: Props) => {
  const {
    importeOriginal,
    index,
    eventosContables,
    eventosContablesOriginales,
    setEventosContables,
  } = props;
  const [importe, setImporte] = useState<string>('');

  const updateRow = index => {
    let eventosContablesCopy = eventosContables;
    eventosContablesCopy[index].importe = importe;
    setEventosContables([...eventosContablesCopy]);
  };

  useEffect(() => {
    // Formatear el importe original al formato de número adecuado
    if (importeOriginal !== undefined) {
      setImporte(
        importeOriginal.toLocaleString('es-AR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    }
  }, [importeOriginal]);
  return (
    <div className="d-flex justify-content-center align-items-center">
      <TextInput
        variant="inline"
        inputType="currency"
        thousandDelimiter="."
        decimalDelimiter=","
        size="normal"
        value={importe}
        onChange={(e: any) => {
          setImporte(e.target.value);
        }}
        onBlur={() => {
          updateRow(index);
        }}
        disabled={
          eventosContablesOriginales[index].esImporteOriginal ||
          (eventosContables[index].importe &&
            eventosContables[index].esDuplicado)
        }
      />
    </div>
  );
};

export default CustomImporte;
