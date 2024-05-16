import { Heading } from '@brick/core';
import { RouteComponentProps } from '@reach/router';
import React, { useEffect } from 'react';
import { Title } from 'styles/CommonStyles';
import ConciliacionComexSAPPage from './ConciliacionComexSAPPage';

const ConciliacionComexSAPMain: React.FC<RouteComponentProps> = () => {
  useEffect(() => {
    document.title = 'Conciliacion COMEX - SAP';
  }, []);
  return (
    <div className="fluid m-4 mx-12 px-32">
      <Title className="mb-40">
        <Heading variant="s1" className="my-20" weight="bold" align="center">
          Conciliacion COMEX - SAP
        </Heading>
      </Title>
      <ConciliacionComexSAPPage />
    </div>
  );
};

export default ConciliacionComexSAPMain;
