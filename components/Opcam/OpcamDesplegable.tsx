import { Grid, Typography } from '@brick/core';
import { transformString } from '@lib/helpers/Opcam.helpers';
import React from 'react';
import { OpcamAuxiliar } from './OpcamPage';

interface Props {
  opcam: OpcamAuxiliar;
}
export const OpcamDesplegable = ({ opcam }: Props) => {
  return (
    <>
      <Typography
        variant="s7"
        color="grey_text_dark"
        className="pl-20 ml-2 mb-2"
        bold
      >
        Denominacion del Cliente:
        {opcam.denominacionClie ? opcam.denominacionClie : '-'}
      </Typography>
      <Grid direction="row" className="pl-40">
        <Grid.Item className="pl-20 ml-24">
          <span
            style={{
              display: 'flex',
              borderLeft: '2px solid gray',
              marginBottom: '3px',
            }}
          >
            <Typography
              variant="s7"
              color="grey_text_dark"
              className="pl-20 ml-2 mb-2"
              bold
            >
              Codigo Jurisdiccion:
              {opcam.codJurisdiccion ? opcam.codJurisdiccion : '-'}
            </Typography>
          </span>
        </Grid.Item>
        <Grid.Item className="pl-20 ml-24">
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              borderLeft: '2px solid gray',
              marginBottom: '3px',
            }}
          >
            <Typography
              variant="s7"
              color="grey_text_dark"
              className="pl-20 ml-2 mb-2"
              bold
            >
              Tipo Ident.: {opcam.tipoIdent ? opcam.tipoIdent : '-'}
            </Typography>
          </span>
        </Grid.Item>
        <Grid.Item className="pl-20 ml-24">
          <span
            style={{
              display: 'flex',
              borderLeft: '2px solid gray',
              marginBottom: '3px',
            }}
          >
            <Typography
              variant="s7"
              color="grey_text_dark"
              className="pl-20 ml-2 mb-2"
              bold
            >
              Cod. Pais Resid.: {opcam.codPaisResid ? opcam.codPaisResid : '-'}
            </Typography>
          </span>
        </Grid.Item>
        <Grid.Item className="pl-20 ml-24">
          <span
            style={{
              display: 'flex',
              borderLeft: '2px solid gray',
              marginBottom: '3px',
            }}
          >
            <Typography
              variant="s7"
              color="grey_text_dark"
              className="pl-20 ml-2 mb-2"
              bold
            >
              Cond. Clie.: {opcam.condClie ? opcam.condClie : '-'}
            </Typography>
          </span>
        </Grid.Item>
        <Grid.Item className="pl-20 ml-24">
          <span
            style={{
              display: 'flex',
              borderLeft: '2px solid gray',
              marginBottom: '3px',
            }}
          >
            <Typography
              variant="s7"
              color="grey_text_dark"
              className="pl-20 ml-2 mb-2"
              bold
            >
              Cod. Inst. Vendido:
              {opcam.codInstVendido ? opcam.codInstVendido : '-'}
            </Typography>
          </span>
        </Grid.Item>
        <Grid.Item className="pl-20 ml-24">
          <span
            style={{
              display: 'flex',
              borderLeft: '2px solid gray',
              marginBottom: '3px',
            }}
          >
            <Typography
              variant="s7"
              color="grey_text_dark"
              className="pl-20 ml-2 mb-2"
              bold
            >
              Cod. Inst. Recibido:
              {opcam.codInstRecibido ? opcam.codInstRecibido : '-'}
            </Typography>
          </span>
        </Grid.Item>
        <Grid.Item className="pl-20 ml-24">
          <span
            style={{
              display: 'flex',
              borderLeft: '2px solid gray',
              marginBottom: '3px',
            }}
          >
            <Typography
              variant="s7"
              color="grey_text_dark"
              className="pl-20 ml-2 mb-2"
              bold
            >
              Cod. Pais: {opcam.codPais ? opcam.codPais : '-'}
            </Typography>
          </span>
        </Grid.Item>
        <Grid.Item className="pl-20 ml-24">
          <span
            style={{
              display: 'flex',
              borderLeft: '2px solid gray',
              marginBottom: '3px',
            }}
          >
            <Typography
              variant="s7"
              color="grey_text_dark"
              className="pl-20 ml-2 mb-2"
              bold
            >
              Denominación: {opcam.denominacion ? opcam.denominacion : '-'}
            </Typography>
          </span>
        </Grid.Item>
        <Grid.Item className="pl-20 ml-24">
          <span
            style={{
              display: 'flex',
              borderLeft: '2px solid gray',
              marginBottom: '3px',
            }}
          >
            <Typography
              variant="s7"
              color="grey_text_dark"
              className="pl-20 ml-2 mb-2"
              bold
            >
              Pais origen: {opcam.paisOrigen ? opcam.paisOrigen : '-'}
            </Typography>
          </span>
        </Grid.Item>
        <Grid.Item className="pl-20 ml-24">
          <span
            style={{
              display: 'flex',
              borderLeft: '2px solid gray',
              marginBottom: '3px',
            }}
          >
            <Typography
              variant="s7"
              color="grey_text_dark"
              className="pl-20 ml-2 mb-2"
              bold
            >
              Imp. en pesos:{' '}
              {opcam.impEnPesos
                ? transformString(opcam.impEnPesos.toString())
                : '-'}
            </Typography>
          </span>
        </Grid.Item>
        <Grid.Item className="pl-20 ml-24">
          <span
            style={{
              display: 'flex',
              borderLeft: '2px solid gray',
              marginBottom: '3px',
            }}
          >
            <Typography
              variant="s7"
              color="grey_text_dark"
              className="pl-20 ml-2 mb-2"
              bold
            >
              Cod. DJ.: {opcam.codDj ? opcam.codDj : '-'}
            </Typography>
          </span>
        </Grid.Item>
        <Grid.Item className="pl-20 ml-24">
          <span
            style={{
              display: 'flex',
              borderLeft: '2px solid gray',
              marginBottom: '3px',
            }}
          >
            <Typography
              variant="s7"
              color="grey_text_dark"
              className="pl-20 ml-2 mb-2"
              bold
            >
              Rectificativa: {opcam.rectificativa ? opcam.rectificativa : '-'}
            </Typography>
          </span>
        </Grid.Item>
      </Grid>
    </>
  );
};
