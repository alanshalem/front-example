import { Heading } from '@brick/core';
import { RouteComponentProps } from '@reach/router';
import React, { useEffect } from 'react';
import { Title } from 'styles/CommonStyles';
import CruceOpcamTopsPage from './CruceOpcamTopsPage';

const CruceOpcamTopsMain: React.FC<RouteComponentProps> = () => {
  useEffect(() => {
    document.title = 'Cruce OPCAM vs Analitico TOPS';
  }, []);
  return (
    <div className="fluid m-4 mx-12 px-32">
      <Title className='mb-40'>
        <Heading variant="s1" className="my-20" weight="bold" align="center">
          PreOPCAM vs Analitico TOPS
        </Heading>
      </Title>
      <CruceOpcamTopsPage />
    </div>
  );
};

export default CruceOpcamTopsMain;
