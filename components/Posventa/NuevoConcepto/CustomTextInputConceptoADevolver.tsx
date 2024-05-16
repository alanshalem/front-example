import { TextInput } from '@brick/core';
import { toastCallAux } from '@components/Toast/Toast.helpers';
import { formatNumberForInput } from '@lib/utils/Importe';
import React, { useCallback, useEffect, useState } from 'react';

interface CustomTextInputConceptoADevolverProps {
  concepto: string;
  esDevolucion: boolean;
  handleImpuestoData: (data: any) => void;
  divisa: string;
  idPosVentaParametria: number;
  monto?: any;
  onFormattingStart: () => void;
  onFormattingEnd: () => void;
}
export const CustomTextInputConceptoADevolver = ({
  concepto,
  esDevolucion,
  handleImpuestoData,
  divisa,
  idPosVentaParametria,
  monto,
  onFormattingStart,
  onFormattingEnd,
}: CustomTextInputConceptoADevolverProps) => {
  const [montoADevolver, setMontoADevolver] = useState<number | string>(monto);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    setMontoADevolver('');
  }, [esDevolucion]);

  useEffect(() => {
    if (monto !== '') setMontoADevolver(monto);
  }, [monto]);

  const handleDebounce = useCallback(
    (value: string) => {
      // value: 2,35 - string
      const sanitizedValue = value.replace(/\s/g, '').replace(/\./g, '');
      const parsedValue = parseFloat(sanitizedValue.replace(',', '.'));

      if (!isNaN(Number(parsedValue)) && Number(parsedValue) > 0) {
        setMontoADevolver(parsedValue);
        handleImpuestoData({
          concepto,
          montoADevolver: parsedValue,
          montoACobrar: 0,
          divisa,
          idPosVentaParametria,
          idPosVentaTipo: 1,
        });
      } else {
        toastCallAux('Monto a acreditar no valido.', false);
      }
      onFormattingEnd();
    },
    [handleImpuestoData, concepto, divisa, idPosVentaParametria]
  );

  const handleChange = (e: any) => {
    if (esDevolucion) {
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
      {esDevolucion && <span style={{ marginRight: '5px' }}>$</span>}
      <TextInput
        id="CustomTextInputConceptoADevolver"
        size="normal"
        value={formatNumberForInput(montoADevolver)}
        inputType="number"
        onChange={(e: any) => {
          handleChange(e);
        }}
        disabled={!esDevolucion}
      />
    </div>
  );
};
