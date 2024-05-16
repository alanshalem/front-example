import { TextInput } from '@brick/core';
import React, { useEffect, useState } from 'react';

type Props = {
  rubroOriginal: any;
  fila: any;
  index: any;
  eventosContables: any;
  eventosContablesOriginales: any;
  setEventosContables: any;
};

const CustomRubro = (props: Props) => {
  const {
    rubroOriginal,
    index,
    eventosContables,
    eventosContablesOriginales,
    setEventosContables,
  } = props;
  const [rubro, setRubro] = useState<string>('');

  const updateRow = index => {
    let eventosContablesCopy = eventosContables;
    eventosContablesCopy[index].rubro = rubro;

    setEventosContables([...eventosContablesCopy]);
  };
  useEffect(() => {
    setRubro(rubroOriginal);
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <TextInput
        id="CustomRubro"
        size="normal"
        value={rubro}
        inputType="text"
        onChange={(e: any) => {
          setRubro(e.target.value);
        }}
        onBlur={() => {
          updateRow(index);
        }}
        disabled={
          eventosContablesOriginales[index].esRubroOriginal ||
          (eventosContables[index].rubro && eventosContables[index].esDuplicado)
        }
      />
    </div>
  );
};

export default CustomRubro;
