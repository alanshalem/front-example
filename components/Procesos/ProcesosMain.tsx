import { Heading } from '@brick/core';
import { RouteComponentProps } from '@reach/router';
import React, { useEffect } from 'react';
import { Title } from 'styles/CommonStyles';
import ProcesosPage from './ProcesosPage';

const ProcesosMain: React.FC<RouteComponentProps> = () => {
  useEffect(() => {
    document.title = 'Procesos';
  }, []);

  return (
    <div className="fluid m-4 mx-12 px-32">
      <Title>
        <Heading variant="s1" className="my-20" weight="bold" align="center">
          Procesos
        </Heading>
        <ProcesosPage />
      </Title>
    </div>
  );
};

export default ProcesosMain;
