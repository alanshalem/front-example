import { Grid, Typography } from '@brick/core'
import { Contabilidad } from '@lib/types/Contabilidad/Contabilidad.types'
import React from 'react'

interface Props {
  cruceCorresponsal: Contabilidad
}
export const ContabilidadDesplegable = ({cruceCorresponsal} :Props) => {
  return (
    <Grid direction="row" className="pl-40">
            <Grid.Item className="pl-20 ml-24">
              <Typography
                variant="s7"
                color="grey_text_dark"
                className="mb-4 pl-24 ml-24"
                bold
              >
                Fecha Modificación: {cruceCorresponsal.fechaModificacion ? cruceCorresponsal.fechaModificacion : '-'}
              </Typography>
            </Grid.Item>
            <Grid.Item className="pl-20 ml-24">
              <Typography
                variant="s7"
                color="grey_text_dark"
                className="mb-4 pl-24 ml-24"
                bold
              >
                Legajo Ult. Modificación: {cruceCorresponsal.legajoUltimaModificacion ? cruceCorresponsal.legajoUltimaModificacion : '-'}
              </Typography>
            </Grid.Item>
            <Grid.Item className="pl-20 ml-24">
              <Typography
                variant="s7"
                color="grey_text_dark"
                className="mb-4 pl-24 ml-24"
                bold
              >
                Legajo Creación: {cruceCorresponsal.legajoCreacion ? cruceCorresponsal.legajoCreacion : '-'}
              </Typography>
            </Grid.Item>
          </Grid>
  )
}
