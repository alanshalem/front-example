import React from 'react';
import { Chip } from '@brick/core';

type Props = {
  estado: string;
};

export const EstadosChipContabilidad = (props: Props) => {
  let bgColor = 'brand'; // Valor predeterminado
  let label = props.estado;

  // Verificar el estado y ajustar bgColor y label en consecuencia
  if (props.estado === 'Aprobado' || props.estado === 'Procesado') {
    bgColor = 'success';
  } else if (props.estado === 'Baja') {
    bgColor = 'brand';
  } else if (props.estado === 'Rechazado') {
    bgColor = 'brand';
  } else if (props.estado === 'Error') {
    bgColor = 'error';
  } else if (props.estado === 'Pendiente') {
    bgColor = 'warning';
  } else if (props.estado === 'Alta') {
    bgColor = 'transparent';
  }

  return <Chip bgColor={bgColor} label={label} />;
};
