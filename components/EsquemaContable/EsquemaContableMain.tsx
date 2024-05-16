import { Heading } from '@brick/core';
import { RouteComponentProps } from '@reach/router';
import React, { useEffect } from 'react';
import { Title } from 'styles/CommonStyles';
import EsquemaContablePage from './EsquemaContablePage';

const EsquemaContableMain: React.FC<RouteComponentProps> = () => {
  useEffect(() => {
    document.title = 'Esquema Contable';
  }, []);

  return (
    <div className="fluid m-4 mx-12 px-32">
      <Title>
        <Heading variant="s1" className="my-20" weight="bold" align="center">
          Esquema Contable
        </Heading>
        <EsquemaContablePage />
      </Title>
    </div>
  );
};

export default EsquemaContableMain;
