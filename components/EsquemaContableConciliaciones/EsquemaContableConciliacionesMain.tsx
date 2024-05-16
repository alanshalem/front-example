import { Heading } from '@brick/core';
import { RouteComponentProps } from '@reach/router';
import React, { useEffect } from 'react';
import { Title } from 'styles/CommonStyles';
import EsquemaContableConciliacionesPage from './EsquemaContableConciliacionesPage';

const EsquemaContableConciliacionesMain: React.FC<RouteComponentProps> = () => {
  useEffect(() => {
    document.title = 'ABM: Rubro, Centro de Costo';
  }, []);

  return (
    <div className="fluid m-4 mx-12 px-32">
      <Title>
        <Heading variant="s1" className="my-20" weight="bold" align="center">
          ABM: Rubro, Centro de Costo
        </Heading>
        <EsquemaContableConciliacionesPage />
      </Title>
    </div>
  );
};

export default EsquemaContableConciliacionesMain;
