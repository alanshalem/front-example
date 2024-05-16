import { newProyectada } from '@lib/helpers/Proyectadas.helpers';
import { NuevaProyectadaType } from '@lib/types/Proyectada.types';
import React, { useState } from 'react';
import { InternalModal } from './InternalModal';

interface ConfirmationModalProps {
  visible: boolean;
  close: () => void;
  message: string;
  dataProyectada: NuevaProyectadaType;
}

export const ConfirmationModalProyectada: React.FC<ConfirmationModalProps> = props => {
  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  const {
    proyectada,
    isEdition,
    model,
    persona,
    genericFunc,
    setLoading,
    setShowToast,
    setMessage,
    setTitle,
    closeModal,
    clearForm,
    refreshTable,
    toastCall,
    username,
  } = props.dataProyectada;

  const onAccept = () => {
    setLoadingForm(true);
    newProyectada({
      proyectada,
      isEdition,
      model,
      persona,
      genericFunc,
      setLoading,
      setShowToast,
      setMessage,
      setTitle,
      closeModal,
      clearForm,
      refreshTable,
      toastCall,
      username,
    });
    setLoadingForm(false);
    props.close();
  };

  return (
    <InternalModal 
    visible={props.visible}
    close={props.close}
    message={props.message}
    onAccept={onAccept}
    loading={loadingForm}
  />
  );
};
