import { TextInput } from '@brick/core';
import { toastCallAux } from '@components/Toast/Toast.helpers';
import { formatNumberForInput } from '@lib/utils/Importe';
import React, { useCallback, useEffect, useState } from 'react';

interface CustomTextInputPosventaADevolverProps {
  montoOriginal: string;
  montoDevuelto: string;
  montoCobrado: string;
  concepto: string;
  handleImpuestoData: (data: any) => void;
  divisa: string;
  idPosVentaParametriaTipo: number;
  alicuota: number;
  esDevolucion: boolean;
  esReversaObligatoria: boolean;
  onFormattingStart: () => void;
  onFormattingEnd: () => void;
  idImpuesto: string;
  index: number;
}

export const CustomTextInputPosventaADevolver = ({
  montoOriginal,
  montoDevuelto,
  montoCobrado,
  concepto,
  handleImpuestoData,
  divisa,
  idPosVentaParametriaTipo,
  alicuota,
  esDevolucion,
  esReversaObligatoria,
  onFormattingStart,
  onFormattingEnd,
  idImpuesto,
  index,
}: CustomTextInputPosventaADevolverProps) => {
  const [montoADevolver, setMontoADevolver] = useState<number | string>('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    setMontoADevolver('');
  }, [esDevolucion]);

  const handleDebounce = useCallback(
    (value: string, parsedMontoOriginal: number) => {
      // value: 2,35 - string
      if (value === '') {
        setMontoADevolver(value);
        handleImpuestoData({
          concepto,
          montoADevolver: value,
          montoACobrar: 0,
          montoOriginal: parsedMontoOriginal,
          divisa,
          idPosVentaParametriaTipo,
          idPosVentaTipo: 1,
          alicuota,
          idImpuesto,
          index
        });
      } else {
        const sanitizedValue = value.replace(/\s/g, '').replace(/\./g, '');
        const parsedValue = parseFloat(sanitizedValue.replace(',', '.'));

        if (!isNaN(Number(parsedValue)) && Number(parsedValue) > 0) {
          setMontoADevolver(parsedValue);
          handleImpuestoData({
            concepto,
            montoADevolver: parsedValue,
            montoACobrar: 0,
            montoOriginal: parsedMontoOriginal,
            divisa,
            idPosVentaParametriaTipo,
            idPosVentaTipo: 1, // Por ahora se deja hardcodeado en devolucion
            alicuota,
            idImpuesto,
            index
          });
        } else {
          toastCallAux('Monto a acreditar no valido.', false);
        }
      }
      onFormattingEnd();
    },
    [handleImpuestoData, concepto, divisa, idPosVentaParametriaTipo]
  );

  const handleChange = (e: any) => {
    if (esDevolucion) {
      let inputValue = e.target.value; // Use e.target.value instead of e.target.rawValue
      // Reemplazamos puntos por comas, ej: 2.35 por 2,35
      const parsedMontoOriginal = Number(montoOriginal);

      // Trigger onFormattingStart callback
      onFormattingStart();
      // Clear the previous debounce timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Start a new debounce timer
      const timer = setTimeout(() => {
        // inputValue: string (2,35), parsedMontoOriginal: Number, maxMontoADevolver: Number
        handleDebounce(inputValue, parsedMontoOriginal);
      }, 2000);

      // Set the timer reference
      setDebounceTimer(timer);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      {esDevolucion && <span style={{ marginRight: '5px' }}>$</span>}
      <TextInput
        id="CustomTextInputPosventaADevolver"
        size="normal"
        value={formatNumberForInput(montoADevolver)}
        inputType="currency"
        onChange={(e: any) => {
          handleChange(e);
        }}
        label={
          (esReversaObligatoria && esDevolucion)
            ? formatNumberForInput(
                Number(montoOriginal) -
                  Number(montoDevuelto) +
                  Number(montoCobrado)
              )
            : ''
        }
        disabled={!esDevolucion || esReversaObligatoria}
      />
    </div>
  );
};
