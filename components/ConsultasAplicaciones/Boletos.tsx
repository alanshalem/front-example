/* eslint-disable react-hooks/exhaustive-deps */
import { Typography } from '@brick/core';
import { RouteComponentProps } from '@reach/router';
import React, {useEffect} from 'react'
import { Title } from 'styles/CommonStyles';

const Boletos: React.FC<RouteComponentProps> = () => {

  const title = `Boletos`

  useEffect(() => {
    document.title = title;
  }, []);
  
  return (
    <div className="fluid my-32 mx-12 px-32">
      <div className='my-44'>
        <Title>
          <Typography variant="s1" className="my-2" weight="bold">
            Boletos
          </Typography>
        </Title>
      </div>
    </div>
  )
}

export default Boletos