import { useMsal } from '@azure/msal-react';
import { Container, Heading } from '@brick/core';
import LogoSA from '../../public/assets/logo_sa.png';
import {
  GridPrincipal,
  PrimerDiv,
  PrimerHeading,
  SegundoDiv,
  UltimoDiv,
} from './Hero.styles';
import React from 'react'

const Hero = () => {
  const { accounts } = useMsal();
  return (
    <Container maxWidth="fluid">
      <GridPrincipal
        direction="row"
        justify="between"
        alignItems="center"
        wrap="wrap"
        spacing={24}
      >
        <Container className="text-center">
          <div className="row justify-content-center align-middle">
            <PrimerDiv>
              <PrimerHeading align="left" weigth="Bold" variant="s1">
                {`¡Hola ${accounts[0].name}! `}
              </PrimerHeading>
              <PrimerHeading variant="s1" align="left">
                Te damos la bienvenida a
              </PrimerHeading>
              <PrimerHeading variant="s1" color="primary" align="left">
                {'OASYS'}
              </PrimerHeading>
              <PrimerHeading size="24px" align="left" variant="s4">
                Elegí alguna de las opciones del menú superior para comenzar a
                trabajar.
              </PrimerHeading>

              <SegundoDiv>
                <Heading element="span" variant="s7" color="grey_text_light">
                  {`Roles: ${accounts[0].idTokenClaims.groups}`}
                  <br />
                </Heading>
              </SegundoDiv>
            </PrimerDiv>
            <UltimoDiv>
              <img src={LogoSA} width="300px" height="300px" alt="logo-sa" />
            </UltimoDiv>
          </div>
        </Container>
      </GridPrincipal>
    </Container>
  );
};

export default Hero;
