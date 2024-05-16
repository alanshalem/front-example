import React, { useEffect, useState } from 'react';
import { TextInput } from '@brick/core';

interface Props {
  handleDebounce: (value: string, field: string) => void;
  cotizacion: number | string;
  field: string;
  label?: string;
  esDisabled?: boolean;
};

export const CustomTextInputCotizacion = ({
  handleDebounce,
  cotizacion,
  field,
  label,
  esDisabled
}: Props) => {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  function formatNumber(value: string | number) {
    let newValue = value.toString();
    if (newValue === '') return value
  
    const decimalCount = newValue.includes(',') || newValue.includes('.') ? newValue.split(/[.,]/)[1].length : 0;
  
    if (decimalCount === 0) {
      newValue += ',00000000';
    }
  
    return newValue;
  };

  function handleChangeInput(value: string | number, field: string) {
    const regex = /^-?\d*([,.]?\d{0,8})?$/; // Expresión regular para validar el formato numérico
    const regexAllowed = /^[\d.,-]*$/; // Expresión regular para validar los caracteres permitidos: dígitos, comas, puntos y el signo negativo
  
    const sanitizedValue = value.toString().replace(/,/g, '.');
  
    if (!regex.test(sanitizedValue) || !regexAllowed.test(value.toString())) {
      return;
    }
  
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  
    const timer = setTimeout(() => {
      handleDebounce(sanitizedValue, field);
    }, 100);
  
    setDebounceTimer(timer);
  };
  
  useEffect(() => {
    const formatearDecimales = (value: string | number, field: string) => {
      const formattedValue = formatNumber(value);
      handleDebounce(`${formattedValue}`, field);
    };
    const timer = setTimeout(() => {
      formatearDecimales(cotizacion, field);
    }, 1500);

    return () => clearTimeout(timer);
  }, [cotizacion, field]);

  return (
    <TextInput
      label={ label }
      value={cotizacion}
      onChange={(e: any) => handleChangeInput(e.target.value, field)}
      placeholder={label}
      disabled={esDisabled ? true : false}
    />
  );
};
