import React from 'react';
import { Chip } from '@brick/core';

type Props = {
  estado: string;
};

export const EstadosConciliacionComexSAPChip = (props: Props) => {
  let bgColor = 'grey'; // Valor predeterminado
  let label = props.estado;

  if (props.estado === 'Finalizada') {
    bgColor = 'success';
  } else if (props.estado === 'En Gestión') {
    bgColor = 'brand';
  } else if (props.estado === 'Alta') {
    bgColor = 'grey';
  }

  return <Chip bgColor={bgColor} label={label} />;
}; 