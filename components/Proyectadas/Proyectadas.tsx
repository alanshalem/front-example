/* eslint-disable react-hooks/exhaustive-deps */
import { Heading } from '@brick/core';
import { BusquedaProyectadas } from '@components/Proyectadas/BusquedaProyectadas';
import { RouteComponentProps } from '@reach/router';
import React, { useEffect } from 'react';
import { Title } from 'styles/CommonStyles';

export const Proyectadas: React.FC<RouteComponentProps> = () => {
  useEffect(() => {
    document.title = 'Proyectadas';
  }, []);

  return (
    <div className="fluid m-4 mx-12 px-32">
      <Title>
        <Heading variant="s1" className="my-20" weight="bold" align="center">
          Proyectadas
        </Heading>
      </Title>
      <BusquedaProyectadas />
    </div>
  );
};
