/* eslint-disable react-hooks/exhaustive-deps */
import { Typography } from '@brick/core';
import { RouteComponentProps } from '@reach/router';
import React, { useEffect } from 'react';
import { Title } from 'styles/CommonStyles';
import PosventaPage from './PosventaPage';

const Posventa: React.FC<RouteComponentProps> = () => {
  useEffect(() => {
    document.title = 'Posventa';
  }, []);
  return (
    <div className="fluid m-4 mx-12 px-32">
      <Title>
        <Typography variant="s1" className="my-2" weight="bold">
          Posventa
        </Typography>
      </Title>
      <PosventaPage />
    </div>
  )
}

export default Posventa