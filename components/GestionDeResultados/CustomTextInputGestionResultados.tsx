import React, { useState } from 'react';
import { TextInput } from '@brick/core';
import { formatNumberForInput } from '@lib/utils/Importe';
import { mesActual } from '@lib/helpers/Previsiones.helpers';

interface CustomTextInputGestionResultadosProps {
  importe: number | string;
  handleDebounce: (index: number, value: any) => void;
  index: number;
  periodo: string;
}

export const CustomTextInputGestionResultados = ({
  importe,
  handleDebounce,
  index,
  periodo,
}: CustomTextInputGestionResultadosProps) => {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleChangeInput = (index: number, value: any) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  
    const timer = setTimeout(() => {
      handleDebounce(index, value);
    }, 1000);
  
    setDebounceTimer(timer);
  };
  
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {/* <span style={{ marginRight: '5px', fontSize: '14px' }}>$</span> */}
      <TextInput
        value={formatNumberForInput(importe)}
        size={'xs'}
        onChange={(x) => handleChangeInput(index, x.target.value)}
        inputType="currency"
        disabled={periodo < mesActual}
      />
    </div>
  );
};