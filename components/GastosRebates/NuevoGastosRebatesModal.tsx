import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Button,
  Container,
  DatePicker,
  Grid,
  Modal,
  SelectInput,
  TextInput,
} from '@brick/core';
import OverviewContext from '@contexts/Overview';
import {
  buildCorresponsalDivisaInitialValueFilter,
  buildCorresponsalDivisaList,
} from '@lib/helpers/Corresponsal.helpers';
import {
  buildTipoAnaliticoGastosRebatesInitialValueFilter,
  guardarGastoRebate,
  initialStateFiltersModal,
} from '@lib/helpers/GastosRebates.helpers';
import { buildTiposAnaliticoGastoRebatelList } from '@lib/helpers/TiposAnalitico.helpers';
import { Corresponsal } from '@lib/types/Corresponsal/Corresponsa.types';
import { GastosRebatesFilterModalAuxiliar } from '@lib/types/GastosRebates/GastosRebates.types';
import { formatNumberForInput } from '@lib/utils/Importe';
import { toastCallAux } from '@components/Toast/Toast.helpers';
import { useMsal } from '@azure/msal-react';
import { tienePermisos } from '@lib/helpers/Auth.helpers';
import { funcionalidades, acciones } from '../../config/ConfigurationService';
import AuthContext from '@contexts/Auth/AuthContext';
import { CustomTextInputCotizacion } from '@components/Inputs/CustomTextInputCotizacion'

interface NuevoGastosRebatesModalProps {
  isModalActive: boolean;
  closeModal: () => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

export const NuevoGastoRebatesModal: React.FC<NuevoGastosRebatesModalProps> = (
  props: NuevoGastosRebatesModalProps
) => {
  const estadosContext = useContext(OverviewContext);
  const authContext = useContext(AuthContext);
  const [initialValue, setInitialValue] = useState<any>({});
  const [filtroGastosRebatesModal, setfiltroGastosRebatesModal] = useState<
    GastosRebatesFilterModalAuxiliar
  >(initialStateFiltersModal);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const { accounts } = useMsal();
  const [legajoCreacion] = accounts[0].username.split('@');

  const corresponsalDivisaMemo = React.useMemo(() => {
    return buildCorresponsalDivisaList(estadosContext.tiposCorresponsal);
  }, [estadosContext.tiposCorresponsal]);

  const tiposAnaliticoGastoRebateMemo = React.useMemo(() => {
    return buildTiposAnaliticoGastoRebatelList(
      estadosContext.tiposAnaliticoGastoRebate
    );
  }, [estadosContext.tiposAnaliticoGastoRebate]);

  const handleChange = (value, field) => {
    setfiltroGastosRebatesModal(prevModal => ({
      ...prevModal,
      [field]: value,
    }));
  };

  const handleDebounce = useCallback(value => {
    const sanitizedValue = value.replace(/\s/g, '').replace(/\./g, '');
    const parsedValue = parseFloat(sanitizedValue.replace(',', '.'));

    if (!isNaN(parsedValue)) {
      setfiltroGastosRebatesModal(prevFiltro => ({
        ...prevFiltro,
        importe: parsedValue,
      }));
    } else {
      toastCallAux('Monto ingresado no válido', false);
    }
  }, [filtroGastosRebatesModal]);

  const handleChangeInput = (value: any) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      handleDebounce(value);
    }, 1000);

    setDebounceTimer(timer);
  };

  const closeToogle = () => {
    setfiltroGastosRebatesModal(initialStateFiltersModal);
    props.closeModal();
  };

  const obtenerAñoActual = () => {
    let d = new Date();
    let n = d.getFullYear();
    return n;
  };

  const obtenerAñoProximo = () => {
    let d = new Date();
    let n = d.getFullYear();
    return n - 1;
  };

  const handleSaveGastoRebate = () => {
    tienePermisos(
      funcionalidades.gastosRebates,
      acciones.manual,
      authContext.permisos,
      async () => {
        props.setLoading(true);
        guardarGastoRebate(
          filtroGastosRebatesModal,
          props.setLoading,
          corresponsalDivisaMemo,
          tiposAnaliticoGastoRebateMemo,
          props.closeModal,
          props.setRefresh,
          legajoCreacion
        );
      }
    );
  };

  useEffect(() => {
    const tipoLiquidacionGastosId = tiposAnaliticoGastoRebateMemo.find(
      tipo => tipo.text === 'Gastos'
    )?.value;

    if (filtroGastosRebatesModal.tipo === '') {
      setInitialValue(
        buildTipoAnaliticoGastosRebatesInitialValueFilter(
          tiposAnaliticoGastoRebateMemo.find(
            e => filtroGastosRebatesModal.tipo === e.text
          )
        )
      );
    }

    if (filtroGastosRebatesModal.tipo === tipoLiquidacionGastosId) {
      setfiltroGastosRebatesModal({
        ...filtroGastosRebatesModal,
        nroBoleto: '',
        cotizacionBoleto: '',
      });
    }
  }, [filtroGastosRebatesModal.tipo, tiposAnaliticoGastoRebateMemo]);

  useEffect(() => {
    if (filtroGastosRebatesModal.corresponsalDivisa === '') {
      setInitialValue(
        buildCorresponsalDivisaInitialValueFilter(
          estadosContext.tiposCorresponsal?.find(
            (e: Corresponsal) =>
              filtroGastosRebatesModal.corresponsalDivisa ===
              e.corresponsalDivisa
          )
        )
      );
    }
  }, [filtroGastosRebatesModal.corresponsalDivisa]);

  const handleDebounceCotizacion = useCallback(
    (value: string, field: string) => {
      let newValue = value;

      const decimalCount = value.split(/[.,]/).length - 1;

      if (decimalCount > 1) {
        // Si hay más de un punto o coma, no se actualiza el valor
        return;
      }

      const decimalIndex =
        value.indexOf('.') !== -1 ? value.indexOf('.') : value.indexOf(',');

      if (decimalIndex !== -1) {
        const decimals = value.substring(decimalIndex + 1);

        // Limita a 8 decimales después del punto o coma
        if (decimals.length > 8) {
          newValue = value.substring(0, decimalIndex + 9);
        }
      }

      // Reemplaza el punto por una coma
      newValue = newValue.replace('.', ',');

      setfiltroGastosRebatesModal(prevModal => ({
        ...prevModal,
        [field]: newValue,
      }));
    },
    [setfiltroGastosRebatesModal]
  );


  return (
    <>
      <Modal active={props.isModalActive} customWidth="1300px">
        <Modal.Title
          iconCloseAction={() => closeToogle()}
          titleText="Nuevo"
        ></Modal.Title>
        <Modal.Body isStatic>
          <Container maxWidth="fluid">
            <Grid spacing={12} justify="between">
              <Grid.Item sm={4}>
                <DatePicker
                  variant="inline"
                  label="Periodo"
                  placeholder="Seleccionar Periodo."
                  onlyMonths
                  dateFormat="yyyy/MM"
                  value={filtroGastosRebatesModal.periodo}
                  selectYears
                  onChangeStartDate={e => handleChange(e, 'periodo')}
                  divider
                  rangeStartYear={obtenerAñoActual}
                  rangeEndYear={obtenerAñoProximo}
                  zIndexDpPopper={2}
                  popperPlacement="bottom-end"
                />
              </Grid.Item>
              <Grid.Item sm={4}>
                <SelectInput
                  variant="inline"
                  items={tiposAnaliticoGastoRebateMemo}
                  handlerBlur={e => handleChange(e.value, 'tipo')}
                  label="Tipo Analitico"
                  placeholder="Tipo Analitico"
                  initialValue={initialValue}
                />
              </Grid.Item>
              <Grid.Item sm={4}>
                <SelectInput
                  variant="inline"
                  items={corresponsalDivisaMemo}
                  handlerBlur={(e: any) =>
                    handleChange(e.value, 'corresponsalDivisa')
                  }
                  label="Corresponsal Divisa"
                  placeholder="Corresponsal Divisa"
                  initialValue={initialValue}
                />
              </Grid.Item>
              <Grid.Item sm={4}>
                <TextInput
                  label="Referencia Externa"
                  value={filtroGastosRebatesModal.referenciaExterna}
                  onChange={e => {
                    handleChange(e.target.value, 'referenciaExterna');
                  }}
                  maxLength={16}
                  placeholder="Referencia externa"
                />
              </Grid.Item>
              <Grid.Item sm={4}></Grid.Item>
              <Grid.Item sm={4}>
                <TextInput
                  label="Importe"
                  value={formatNumberForInput(filtroGastosRebatesModal.importe)}
                  onChange={e => handleChangeInput(e.target.value)}
                  placeholder="Importe"
                  inputType="currency"
                />
              </Grid.Item>
              {tiposAnaliticoGastoRebateMemo.find(
                t =>
                  t.value === filtroGastosRebatesModal.tipo &&
                  t.text === 'Rebates'
              ) && (
                <Grid spacing={12} justify="between">
                  <Grid.Item sm={4}>
                    <TextInput
                      label="Nro Boleto"
                      value={filtroGastosRebatesModal.nroBoleto}
                      onChange={e => handleChange(e.target.value, 'nroBoleto')}
                      maxLength={30}
                      placeholder="Nro Boleto"
                    />
                  </Grid.Item>
                  <Grid.Item sm={4}>
                    <CustomTextInputCotizacion
                      handleDebounce={handleDebounceCotizacion}
                      cotizacion={filtroGastosRebatesModal.cotizacionBoleto}
                      field="cotizacionBoleto"
                      label="Cotización Boleto"
                    />
                  </Grid.Item>
                </Grid>
              )}
            </Grid>
          </Container>
        </Modal.Body>
        <Modal.Footer alingElement="flex-end">
          <div style={{ marginRight: '8px' }}></div>
          <Button size="small" onClick={handleSaveGastoRebate}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
