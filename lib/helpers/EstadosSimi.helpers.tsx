import React from 'react';
import { Chip } from '@brick/core';

type Props = {
  estado: string;
};

export const EstadosChip = (props: Props) => {
  let bgColor = 'grey'; // Valor predeterminado
  let label = props.estado;

  if (props.estado === 'Activo') {
    bgColor = 'success';
  } else if (props.estado === 'Desconocido') {
    bgColor = 'grey';
  }

  return <Chip bgColor={bgColor} label={label} />;
};
