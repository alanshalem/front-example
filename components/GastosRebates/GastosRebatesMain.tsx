import React, { useEffect } from 'react';
import { Heading } from '@brick/core';
import { RouteComponentProps } from '@reach/router';
import { Title } from 'styles/CommonStyles';
import GastosRebatesPage from './GastosRebatesPage'


const GastosRebatesMain: React.FC<RouteComponentProps> = () => {
  
  useEffect(() => {
    document.title = 'Gastos y Rebates';
  }, []);

  return (
    <div className="fluid m-4 mx-12 px-32">
      <Title>
        <Heading variant="s1" className="my-20" weight="bold" align="center">
          Gastos y Rebates
        </Heading>
        <GastosRebatesPage />
      </Title>
    </div>
  );
};

export default GastosRebatesMain;