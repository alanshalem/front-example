/* eslint-disable react-hooks/exhaustive-deps */
import { Button, DatePicker, Grid, TextInput } from '@brick/core';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import { getAllConsultasSaldoTable } from '@lib/helpers/ConsultasCM.helpers';
import React, { useEffect, useState } from 'react';
import { FilterContainer } from 'styles/CommonStyles';
import ConsultasTable from './ConsultasTable';

const initialState: any = {
  fechaCreacion: null,
  casa: '',
  rubro: '',
  divisa: '',
};

const ConsultasSaldoPage = ({ tipoConsulta }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [consultasTable, setConsultasTable] = useState<any[]>([]);
  const [filtros, setFiltros] = useState(initialState);
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleBuscar = () => {
    setLoading(true);
    tipoConsulta === 'diario'
      ? getAllConsultasSaldoTable(
          setConsultasTable,
          setLoading,
          filtros,
          'diario'
        )
      : getAllConsultasSaldoTable(
          setConsultasTable,
          setLoading,
          filtros,
          'mensual'
        );
  };

  const handleChange = (value: string, field: string) => {
    setFiltros(() => ({ ...filtros, [field]: value }));
  };

  const handleLimpiar = (event: any) => {
    event.preventDefault();
    setFiltros(initialState);
    setRefresh(true);
  };

  useEffect(() => {
    handleBuscar();
  }, []);

  useEffect(() => {
    if (refresh) {
      handleBuscar();
      setRefresh(false);
    }
  }, [refresh]);

  return (
    <div className="fluid m-4 mx-12 px-32">
      <FilterContainer>
        <Grid className="h-100 mt-5 d-flex justify-content-center mt-40">
          {/* fecha creacion */}
          <Grid.Item sm={3} className="mb-24">
            <DatePicker
              label="Fecha"
              variant="inline"
              value={filtros.fechaCreacion}
              zIndexDpPopper={2}
              placeholder="Desde"
              placeholderrange="Hasta"
              onChangeStartDate={(e: any) => {
                handleChange(e, 'fechaCreacion');
              }}
              rangeDate
              dateFormat="dd/MM/yyyy"
              divider
            />
          </Grid.Item>
          {/* rubro */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Rubro"
              value={filtros.rubro}
              onChange={(e: any) => {
                handleChange(e.target.value, 'rubro');
              }}
            />
          </Grid.Item>
          {/* centro de costos */}
          <Grid.Item sm={3} className="mb-24">
            <TextInput
              size="normal"
              label="Centro de Costos"
              value={filtros.casa}
              onChange={(e: any) => {
                handleChange(e.target.value, 'casa');
              }}
            />
          </Grid.Item>
          {/* divisa */}
          <Grid.Item>
            <TextInput
              size="normal"
              label="Divisa"
              value={filtros.divisa}
              onChange={(e: any) => {
                handleChange(e.target.value, 'divisa');
              }}
            />
          </Grid.Item>
        </Grid>
        <Grid
          direction="row"
          justify="end"
          alignItems="end"
          wrap="wrap"
          spacing={6}
          className="m-16"
        >
          <Grid.Item>
            <Button variant="secondary" size="small" onClick={handleLimpiar}>
              Limpiar
            </Button>
          </Grid.Item>
          <Grid.Item>
            <Button variant="primary" size="small" onClick={handleBuscar}>
              Buscar
            </Button>
          </Grid.Item>
        </Grid>
      </FilterContainer>
      {loading ? (
        <LoadingGalicia />
      ) : (
        <ConsultasTable consultasTable={consultasTable} />
      )}
    </div>
  );
};

export default ConsultasSaldoPage;
