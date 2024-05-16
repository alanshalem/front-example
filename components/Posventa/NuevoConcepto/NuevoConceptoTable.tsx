import { Button } from '@brick/core';
import { GenericTable } from '@components/Generic/GenericTable';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { CustomTextInputConceptoACobrar } from './CustomTextInputConceptoACobrar';
import { CustomTextInputConceptoADevolver } from './CustomTextInputConceptoADevolver';

type ConceptosProps = {
  montoCliente: number;
  datosImpuestos: any[];
  handleImpuestoData: (data: any[]) => void;
  selectedConcepts: any[];
  setSelectedConcepts: (concepto: any) => void;
  impuestosADevolver: any[];
  setImpuestosADevolver: (impuesto: any) => void;
  onFormattingStart: () => void;
  onFormattingEnd: () => void;
};

const NuevoConceptoTable = ({
  handleImpuestoData,
  selectedConcepts,
  setSelectedConcepts,
  impuestosADevolver,
  setImpuestosADevolver,
  onFormattingStart,
  onFormattingEnd,
}: ConceptosProps) => {
  const [conceptoRemove, setConceptoremove] = useState<any>();
  const [elementosComunes, setElementosComunes] = useState<any>([]);

  const columnas = [
    {
      text: 'Concepto',
      dataField: 'concepto',
      sort: true,
      label: true,
    },
    {
      text: 'Divisa Cuenta',
      dataField: 'divisa',
      sort: true,
      label: true,
    },
    {
      text: 'Monto a Acreditar',
      dataField: 'montoADevolver',
      sort: true,
      state: true,
    },
    {
      text: 'Monto a Debitar',
      dataField: 'montoACobrar',
      sort: true,
      state: true,
    },
    {
      text: 'Eliminar',
      dataField: 'removeButton',
      label: false,
    },
  ];

  useEffect(() => {
    // en el useEffect si funciona el eliminado
    let impuestosADevolverAux = impuestosADevolver;
    let impuestosADevolverFiltrados = impuestosADevolverAux.filter(
      concepto => concepto.concepto !== conceptoRemove.concepto
    );
    setImpuestosADevolver(impuestosADevolverFiltrados);
  }, [conceptoRemove]);

  const handleRemoveConcept = conceptToRemove => {
    setConceptoremove(conceptToRemove);
    let selectedConceptsAux = selectedConcepts;
    let selectedConceptsFiltrados = selectedConceptsAux.filter(
      concept => concept.concepto !== conceptToRemove.concepto
    );

    setSelectedConcepts(selectedConceptsFiltrados);

    /*let impuestosADevolverAux = impuestosADevolver;
    let impuestosADevolverFiltrados = impuestosADevolverAux.filter(
      concepto => concepto.concepto !== conceptToRemove.concepto
    );
    setImpuestosADevolver(impuestosADevolverFiltrados);*/

    toast.success('Concepto eliminado');
  };

  //Mapea los datos de la tabla
  const filas = React.useMemo(() => {
    const rows: any[] = [];
    if (selectedConcepts.length > 0) {
      selectedConcepts.forEach((e: any) => {
        return pushRows(e, rows);
      });
    }
    return rows;
  }, [selectedConcepts]);

  useEffect(() => {
    const elementoComun = impuestosADevolver.filter(impuesto =>
      selectedConcepts.some(concepto => concepto.concepto === impuesto.concepto)
    );
    setElementosComunes(elementoComun);
  }, [selectedConcepts, impuestosADevolver]);

  function pushRows(e: any, rows) {
    let filtered;

    if (elementosComunes.length > 0) {
      filtered = elementosComunes.find(x => x.concepto === e.concepto);
    }

    return rows.push({
      concepto: e.concepto ? e.concepto : '-',
      divisa: e.divisa ? e.divisa : '-',
      montoADevolver: (
        <CustomTextInputConceptoADevolver
          concepto={e.concepto}
          divisa={e.divisa}
          handleImpuestoData={handleImpuestoData}
          idPosVentaParametria={e.idPosVentaParametria}
          esDevolucion={e.esDevolucion}
          monto={filtered ? filtered.montoADevolver : ''}
          onFormattingStart={onFormattingStart}
          onFormattingEnd={onFormattingEnd}
        />
      ),
      montoACobrar: (
        <CustomTextInputConceptoACobrar
          montoOriginal={e.montoOriginal}
          concepto={e.concepto}
          handleImpuestoData={handleImpuestoData}
          divisa={e.divisa}
          idPosVentaParametria={e.idPosVentaParametria}
          esCobro={e.esCobro}
          onFormattingStart={onFormattingStart}
          onFormattingEnd={onFormattingEnd}
        />
      ),
      removeButton: (
        <div className="d-flex justify-content-center">
          <Button
            iconType="trash"
            size="small"
            variant="simple"
            onClick={() => handleRemoveConcept(e)}
          />
        </div>
      ),
    });
  }

  return (
    <div className="container-fluid">
      <GenericTable
        rows={filas}
        columns={columnas}
        pagination={false}
        editCells={{
          mode: 'click',
        }}
        checks={false}
      />
    </div>
  );
};
export default NuevoConceptoTable;
