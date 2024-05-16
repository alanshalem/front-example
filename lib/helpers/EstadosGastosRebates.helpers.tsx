import React from 'react';
import { Chip } from '@brick/core';

type Props = {
  estado: string;
};

export const EstadosChip = (props: Props) => {
  let bgColor = 'grey'; // Valor predeterminado
  let label = props.estado;

  if (props.estado === 'Nueva') {
    bgColor = 'grey';  
  } else if (props.estado === 'Alta') {
    bgColor = 'transparent';
  } else if (props.estado === 'Aprobado' || props.estado === 'Calendarizada') {
    bgColor = 'success'
  } else if (props.estado === 'Rechazado') {
    bgColor = 'error'
  }
  return <Chip bgColor={bgColor} label={label} />;
};