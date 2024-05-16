import React, { useState } from 'react';
import { InternalModal } from './InternalModal';

interface ConfirmationModalProps {
  visible: boolean;
  close: () => void;
  message: string;
  successMsj: string;
  errorMsj: string;
  objectId: number;
  legajo?: string;
  bajaFunc: (id: number, legajo?: string) => Promise<any>;
  refreshTable: () => void;
  toastCall: (title: string, success: boolean) => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = props => {
  const [loading, setLoading] = useState<boolean>(false);

  const onAccept = () => {
    setLoading(true);
    props
      ?.bajaFunc(props.objectId, props.legajo?.slice(0, 8) ?? '')
      .then(() => {
        setLoading(false);
        props?.toastCall(props.successMsj, true);
        props.close();
        props.refreshTable();
      })
      .catch((error: any) => {
        if (error.status === 404) {
          setLoading(false);
          props?.toastCall(props.errorMsj, false);
          props.close();
        }
      });
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
