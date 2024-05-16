/* eslint-disable react-hooks/exhaustive-deps */
import { Heading } from '@brick/core';
import { ContabilidadPage } from '@components/Contabilidad/ContabilidadPage';
import { RouteComponentProps } from '@reach/router';
import React, { useEffect } from 'react';
import { Title } from 'styles/CommonStyles';

export const ContabilidadMain: React.FC<RouteComponentProps> = () => {
  useEffect(() => {
    document.title = 'Contabilidad';
  }, []);

  return (
    <div className="fluid m-4 mx-12 px-32">
      <Title>
        <Heading variant="s1" className="my-20" weight="bold" align="center">
          Consulta Cruces de Corresponsales
        </Heading>
      </Title>
      <ContabilidadPage />
    </div>
  );
};
