import { Heading } from '@brick/core';
import { RouteComponentProps } from '@reach/router';
import React, { useEffect } from 'react';
import { Title } from 'styles/CommonStyles';
import PrevisionesPage from './PrevisionesPage';

const PrevisionesMain: React.FC<RouteComponentProps> = () => {
  useEffect(() => {
    document.title = 'Previsiones';
  }, []);

  return (
    <div className="fluid m-4 mx-12 px-32">
      <Title>
        <Heading variant="s1" className="my-20" weight="bold" align="center">
          Previsiones
        </Heading>
        <PrevisionesPage />
      </Title>
    </div>
  );
};

export default PrevisionesMain;
