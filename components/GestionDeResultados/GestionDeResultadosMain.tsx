import React, { useEffect } from 'react';
import { Heading } from '@brick/core';
import { RouteComponentProps } from '@reach/router';
import { Title } from 'styles/CommonStyles';
import GestionDeResultadosPage from './GestionDeResultadosPage';


const GestionDeResultadosMain: React.FC<RouteComponentProps> = () => {
  useEffect(() => {
    document.title = 'Gestión de Resultados';
  }, []);

  return (
    <div className="fluid m-4 mx-12 px-32">
      <Title>
        <Heading variant="s1" className="my-20" weight="bold" align="center">
          Gestión de Resultados
        </Heading>
        <GestionDeResultadosPage /> 
      </Title>
    </div>
  );
};

export default GestionDeResultadosMain;