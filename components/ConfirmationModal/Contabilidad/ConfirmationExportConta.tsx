import { ContabilidadesTableResponse } from '@lib/types/ContabilidadCruces/ContabilidadCruces.types';
import { FuncionalidadAccion } from '@lib/types/SourceSystem';
import React, { useState } from 'react';
import { InternalModal } from '../InternalModal';

interface ConfirmationModalProps {
  visible: boolean;
  close: () => void;
  message: string;
  successMsj: string;
  errorMsj: string;
  cruces: ContabilidadesTableResponse[];
  permisos: FuncionalidadAccion[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  function: (
    crucesList: ContabilidadesTableResponse[],
    permisos: FuncionalidadAccion[],
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
}

export const ConfirmationExportConta: React.FC<ConfirmationModalProps> = props => {
  const [loading, setLoading] = useState<boolean>(false);

  const onAccept = () => {
    setLoading(true);
    props
      ?.function(props.cruces, props.permisos, props.setLoading)
      props.close();
    setLoading(false);
  };

  return (
    <InternalModal 
      visible={props.visible}
      close={props.close}
      message={props.message}
      onAccept={onAccept}
      loading={loading}
    />
  );
};
