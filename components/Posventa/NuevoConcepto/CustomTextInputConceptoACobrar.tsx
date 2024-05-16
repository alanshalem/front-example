import { TextInput } from '@brick/core';
import { toastCallAux } from '@components/Toast/Toast.helpers';
import { formatNumberForInput } from '@lib/utils/Importe';
import React, { useCallback, useEffect, useState } from 'react';

interface CustomTextInputConceptoACobrarProps {
  montoOriginal: string;
  concepto: string;
  esCobro: boolean;
  handleImpuestoData: (data: any) => void;
  divisa: string;
  idPosVentaParametria: number;
  onFormattingStart: () => void;
  onFormattingEnd: () => void;
}
export const CustomTextInputConceptoACobrar = ({
  montoOriginal,
  concepto,
  esCobro,
  handleImpuestoData,
  divisa,
  idPosVentaParametria,
  onFormattingStart,
  onFormattingEnd,
}: CustomTextInputConceptoACobrarProps) => {
  const [montoACobrar, setMontoACobrar] = useState<number | string>('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    setMontoACobrar('');
  }, [esCobro]);

  const handleDebounce = useCallback(
    (value: string) => {
      // value: 2,35 - string
      const sanitizedValue = value.replace(/\s/g, '').replace(/\./g, '');
      const parsedValue = parseFloat(sanitizedValue.replace(',', '.'));

      if (!isNaN(Number(parsedValue)) && Number(parsedValue) > 0) {
        setMontoACobrar(parsedValue);
        handleImpuestoData({
          concepto,
          montoACobrar: parsedValue,
          montoADevolver: 0,
          divisa,
          montoOriginal,
          idPosVentaParametria,
          idPosVentaTipo: 2,
        });
      } else {
        toastCallAux('Monto a debitar no valido.', false);
      }
      onFormattingEnd();
    },
    [handleImpuestoData, concepto, idPosVentaParametria]
  );

  const handleChange = (e: any) => {
    if (esCobro) {
      let inputValue = e.target.value;
      const parsedInputValue = inputValue;

      onFormattingStart();

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        // inputValue: string (2,35), parsedMontoOriginal: Number, maxMontoADevolver: Number
        handleDebounce(parsedInputValue);
      }, 2000);

      // Set the timer reference
      setDebounceTimer(timer);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      {esCobro && <span style={{ marginRight: '5px' }}>$</span>}
      <TextInput
        id="CustomTextInputConceptoACobrar"
        size="normal"
        value={formatNumberForInput(montoACobrar)}
        inputType="number"
        onChange={(e: any) => {
          handleChange(e);
        }}
        disabled={!esCobro}
      />
    </div>
  );
};
