import React from 'react';
import { Chip } from '@brick/core';

type Props = {
  estado: string;
  esReporte?: boolean;
};

export const EstadosChip = (props: Props) => {
  let bgColor = 'brand'; // Valor predeterminado
  let label = props.estado;

  // solo en caso de posventa reporte
  if (props.estado.includes('Aprobado') && props.esReporte) {
    bgColor = 'brand';
    return <Chip bgColor={bgColor} label={label} />;
  }
  
  // Verificar el estado y ajustar bgColor y label en consecuencia
  if (props.estado.includes('Aprobado')) {
    bgColor = 'success';
  } else if (props.estado.includes('Baja')) {
    bgColor = 'brand';
  } else if (props.estado.includes('Rechazado')) {
    bgColor = 'brand';
  } else if (props.estado.includes('Error')) {
    bgColor = 'error';
  } else if (props.estado.includes('Pendiente')) {
    bgColor = 'warning';
  } else if (props.estado.includes('Alta')) {
    bgColor = 'transparent';
  }

  return <Chip bgColor={bgColor} label={label} />;
};
