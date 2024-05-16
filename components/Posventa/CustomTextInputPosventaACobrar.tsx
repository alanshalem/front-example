import { TextInput } from '@brick/core';
import { toastCallAux } from '@components/Toast/Toast.helpers';
import { formatNumberForInput } from '@lib/utils/Importe';
import React, { useCallback, useEffect, useState } from 'react';

interface CustomTextInputPosventaACobrarProps {
  montoOriginal: string;
  concepto: string;
  handleImpuestoData: (data: any) => void;
  divisa: string;
  idPosVentaParametriaTipo: number;
  alicuota: number;
  esCobro: boolean;
  esReversaObligatoria: boolean;
  onFormattingStart: () => void;
  onFormattingEnd: () => void;
  montoDevuelto: string;
  montoCobrado: string;
  idImpuesto: string;
  index: number;
}
export const CustomTextInputPosventaACobrar = ({
  montoOriginal,
  concepto,
  handleImpuestoData,
  divisa,
  idPosVentaParametriaTipo,
  alicuota,
  esCobro,
  esReversaObligatoria,
  onFormattingStart,
  onFormattingEnd,
  montoCobrado,
  montoDevuelto,
  idImpuesto,
  index
}: CustomTextInputPosventaACobrarProps) => {
  const [montoACobrar, setMontoACobrar] = useState<number | string>('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    setMontoACobrar('');
  }, [esCobro]);

  const handleDebounce = useCallback(
    (value: string, parsedMontoOriginal: number) => {
      // value: 2,35 - string
      if (value === '') {
        setMontoACobrar(value);
        handleImpuestoData({
          concepto,
          montoACobrar: value,
          montoADevolver: 0,
          montoOriginal: parsedMontoOriginal,
          divisa,
          idPosVentaParametriaTipo,
          idPosVentaTipo: 2,
          alicuota,
          idImpuesto,
          index
        });
      } else {
        const sanitizedValue = value.replace(/\s/g, '').replace(/\./g, '');
        const parsedValue = parseFloat(sanitizedValue.replace(',', '.'));

        if (!isNaN(Number(parsedValue)) && Number(parsedValue) > 0) {
          setMontoACobrar(parsedValue);
          handleImpuestoData({
            concepto,
            montoADevolver: 0,
            montoACobrar: parsedValue,
            montoOriginal,
            divisa,
            idPosVentaParametriaTipo,
            idPosVentaTipo: 2, // Por ahora se deja hardcodeado en cobro
            alicuota,
            idImpuesto,
            index
          });
        } else {
          toastCallAux('Monto a debitar no valido.', false);
        }
      }
      onFormattingEnd();
    },
    [handleImpuestoData, concepto, divisa, idPosVentaParametriaTipo]
  );

  const handleChange = (e: any) => {
    if (esCobro) {
      let inputValue = e.target.value;
      const parsedMontoOriginal = Number(montoOriginal);

      onFormattingStart();
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        handleDebounce(inputValue, parsedMontoOriginal);
      }, 1000);

      setDebounceTimer(timer);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      {esCobro && <span style={{ marginRight: '5px' }}>$</span>}
      <TextInput
        id="CustomTextInputPosventaACobrar"
        size="normal"
        value={formatNumberForInput(montoACobrar)}
        inputType="currency"
        onChange={(e: any) => {
          handleChange(e);
        }}
        label={
          esReversaObligatoria && esCobro
            ? formatNumberForInput(
                Number(montoOriginal) -
                  Number(montoDevuelto) +
                  Number(montoCobrado)
              )
            : ''
        }
        disabled={!esCobro || esReversaObligatoria}
      />
    </div>
  );
};
