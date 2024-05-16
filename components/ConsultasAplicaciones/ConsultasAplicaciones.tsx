/* eslint-disable react-hooks/exhaustive-deps */
import { Typography } from '@brick/core';
import { RouteComponentProps } from '@reach/router';
import React, {useEffect} from 'react'
import { Title } from 'styles/CommonStyles';
import ConsultasSaldoPage from './ConsultasSaldoPage';

const Consultas: React.FC<RouteComponentProps> = () => {

  const saldoDiario = RegExp('diario')
  const tipoConsulta = saldoDiario.test(window.location.pathname)
  const title = `Consultas ${ tipoConsulta ? 'Saldo Diario' : 'Saldo Mensual'}`

  useEffect(() => {
    document.title = title;
  }, []);
  
  return (
    <div className="fluid my-32 mx-12 px-32">
      <div className='my-44'>
        <Title>
          <Typography variant="s1" className="my-2" weight="bold">
            {title}
          </Typography>
        </Title>
      </div>
    
      <ConsultasSaldoPage tipoConsulta={tipoConsulta ? 'diario' : 'mensual'}/>
    </div>
  )
}

export default Consultas