import { Grid, Typography } from '@brick/core'
import { Proyectada } from '@lib/types/Proyectada.types'
import React from 'react'

interface Props {
  proyectada: Proyectada
}
export const ProyectadasDesplegable = ({proyectada}: Props) => {
  return (
    <Grid direction="row" className="pl-40">
            <Grid.Item className="pl-20 ml-24">
              <Typography
                variant="s7"
                color="grey_text_dark"
                className="mb-4 pl-24 ml-24"
                bold
              >
                Fecha Creación: {proyectada.fechaCreacion ? new Date(proyectada.fechaCreacion).toLocaleDateString() : '-'}
              </Typography>
            </Grid.Item>
            <Grid.Item className="pl-20 ml-24">
              <Typography
                variant="s7"
                color="grey_text_dark"
                className="mb-4 pl-24 ml-24"
                bold
              >
                Legajo Ult. Modificación:
                {proyectada.legajoUltimaModificacion ? proyectada.legajoUltimaModificacion : '-'}
              </Typography>
            </Grid.Item>
            <Grid.Item className="pl-20 ml-24">
              <Typography
                variant="s7"
                color="grey_text_dark"
                className="mb-4 pl-24 ml-24"
                bold
              >
                Legajo Creación: {proyectada.legajoCreacion ? proyectada.legajoCreacion : '-'}
              </Typography>
            </Grid.Item>
            <Grid.Item className="pl-20 ml-24">
              <Typography
                variant="s7"
                color="grey_text_dark"
                className="mb-4 pl-24 ml-24"
                bold
              >
                Beneficiario: {proyectada.beneficiario ? proyectada.beneficiario : 'NO APLICA'}
              </Typography>
            </Grid.Item>
            <Grid.Item className="pl-20 ml-24">
              <Typography
                variant="s7"
                color="grey_text_dark"
                className="mb-4 pl-24 ml-24"
                bold
              >
                Vinculada: {proyectada.vinculada === 'S' ? 'Si' : 'No'}
              </Typography>
            </Grid.Item>
          </Grid>
  )
}
