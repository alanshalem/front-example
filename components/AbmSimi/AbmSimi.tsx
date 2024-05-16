/* eslint-disable react-hooks/exhaustive-deps */

import { Heading } from '@brick/core';
import { RouteComponentProps } from '@reach/router';
import React, { useEffect } from 'react';
import { Title } from 'styles/CommonStyles';
import { BusquedaSimi } from './BusquedaSimi';

export const AbmSimi: React.FC<RouteComponentProps> = () => {
  useEffect(() => {
    document.title = 'ABM Contingencia SIRA';
  }, []);
  return (
    <div className="fluid m-4 mx-12 px-32">
      <Title>
        <Heading variant="s1" className="my-20" weight="bold" align="center">
          ABM Contingencia SIRA
        </Heading>
      </Title>
      <BusquedaSimi />
    </div>
  );
};
