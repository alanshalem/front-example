import React from 'react';
import { Loading, Typography } from '@brick/core';
export const LoadingGalicia = () => {
  return (
    <Loading.Section loading={true}>
      <Typography element="p" variant="s7">
        Cargando...
      </Typography>
    </Loading.Section>
  );
};
