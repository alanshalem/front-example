import { Button, Grid, Modal, SelectInput } from '@brick/core';
import { LoadingGalicia } from '@components/LoadingGalicia/LoadingGalicia';
import { getConceptosByIdPosVentaTipo } from '@lib/helpers/Posventa.helpers';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface SeleccionConceptoModalProps {
  nroOperacion: string;
  idAplicacion: number | string;
  idPosVentaTipo: string;
  isOpen: boolean;
  closeModal: () => void;
  onSelectConcepto?: (selectedConcept: any) => void;
  selectedConcepts: any;
  datosImpuestos: any;
}

const SeleccionConceptoModal: React.FC<SeleccionConceptoModalProps> = ({
  nroOperacion,
  idAplicacion,
  idPosVentaTipo,
  isOpen,
  closeModal,
  onSelectConcepto,
  selectedConcepts,
  datosImpuestos,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [rawConceptos, setRawConceptos] = useState<any>([]);
  const [conceptos, setConceptos] = useState<any>([]);
  const [selectedConcept, setSelectedConcept] = useState<any>(null);

  const [initialValue] = useState<any>({
    value: '',
    text: '',
  });

  const closeToggle = () => {
    closeModal();
  };

  useEffect(() => {
    // Verifico que en todas las variables hay datos antes de hacer la llamada
    if (
      nroOperacion !== '' &&
      nroOperacion.length === 7 &&
      idAplicacion !== '' &&
      idPosVentaTipo !== ''
    ) {
      getConceptosByIdPosVentaTipo(
        nroOperacion,
        idAplicacion,
        idPosVentaTipo,
        false,
        setLoading,
        setConceptos,
        setRawConceptos
      );
    }
  }, [nroOperacion, idAplicacion, idPosVentaTipo]);

  const handleSeleccionar = () => {
    if (onSelectConcepto) {
      // Combine the selectedConcepts array and the backend-loaded concepts array (datosImpuestos)
      const allConcepts = [...selectedConcepts, ...datosImpuestos];
      // Check if the selected concept already exists in the combined array
      const conceptExists = allConcepts.some(
        concept => concept.concepto === selectedConcept.text
      );

      const fullConcept = rawConceptos.find(
        concept => concept.nombre === selectedConcept.text
      );
      if (!conceptExists) {
        onSelectConcepto(fullConcept);
      } else {
        // Display a message that the concept is a duplicate
        toast.error('Concepto Duplicado.');
      }
    }
    closeModal();
  };

  return (
    <>
      {loading ? (
        <LoadingGalicia />
      ) : (
        <Modal active={isOpen} modalClose={closeModal} customWidth="1300px">
          <Modal.Title
            titleText="Seleccionar Concepto"
            iconCloseAction={() => {
              closeToggle();
            }}
          />
          <Modal.Body isStatic>
            {isOpen && (
              <SelectInput
                variant="inline"
                items={conceptos}
                initialValue={initialValue}
                handlerBlur={(selectedValue: any) => {
                  setSelectedConcept(selectedValue);
                }}
                label="Seleccione un concepto"
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Grid spacing={1}>
              <Grid.Item>
                <Button
                  size="small"
                  variant="secondary"
                  onClick={handleSeleccionar}
                >
                  Seleccionar
                </Button>
              </Grid.Item>
            </Grid>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default SeleccionConceptoModal;
