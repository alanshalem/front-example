/* eslint-disable react-hooks/exhaustive-deps */
import { Typography } from '@brick/core';
import { RouteComponentProps } from '@reach/router';
import React, { useEffect } from 'react';
import { Title } from 'styles/CommonStyles';
import { ContabilidadCrucesPage } from './ContabilidadCrucesPage';

export const ContabilidadCrucesMain: React.FC<RouteComponentProps> = () => {
  useEffect(() => {
    document.title = 'Gestion de Contabilidades';
  }, []);

  return (
    <div className="fluid m-4 mx-12 px-32">
      <Title>
        <Typography variant="s1" className="my-2" weight="bold">
          Gestión de Contabilidades
        </Typography>
      </Title>
      <ContabilidadCrucesPage />
    </div>
  );
};
