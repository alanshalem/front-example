/* eslint-disable react-hooks/exhaustive-deps */
import { Typography } from '@brick/core';
import { RouteComponentProps } from '@reach/router';
import React, { useEffect } from 'react';
import { Title } from 'styles/CommonStyles';
import PosventaReportePage from './PosventaReportePage';

const PosventaReporte: React.FC<RouteComponentProps> = () => {
  useEffect(() => {
    document.title = 'Reporte Posventa - Soluciones de Automatización.';
  }, []);
  return (
    <div className="fluid m-4 mx-12 px-32">
      <Title>
        <Typography variant="s1" className="my-2" weight="bold">
          Reporte Posventa - Soluciones de Automatización
        </Typography>
      </Title>
      <PosventaReportePage />
    </div>
  );
};

export default PosventaReporte;
