import { Heading } from '@brick/core';
import { RouteComponentProps } from '@reach/router';
import React, { useEffect } from 'react';
import { Title } from 'styles/CommonStyles';
import AlertasPage from './AlertasPage';

const AlertasMain: React.FC<RouteComponentProps> = () => {
  useEffect(() => {
    document.title = 'Alertas Conciliación';
  }, []);

  return (
    <div className="fluid m-4 mx-12 px-32">
      <Title>
        <Heading variant="s1" className="my-20" weight="bold" align="center">
          Alertas Conciliación
        </Heading>
        <AlertasPage />
      </Title>
    </div>
  );
};

export default AlertasMain;