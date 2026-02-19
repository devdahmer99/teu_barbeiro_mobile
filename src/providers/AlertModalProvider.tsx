import React, {useRef} from 'react';
import {AlertModal, AlertModalContext, type AlertModalConfig} from '@/components/AlertModal';

interface AlertModalRef {
  show: (config: AlertModalConfig) => void;
  hide: () => void;
}

export function AlertModalProvider({children}: {children: React.ReactNode}) {
  const alertModalRef = useRef<AlertModalRef>(null);

  const showAlert = (config: AlertModalConfig) => {
    alertModalRef.current?.show(config);
  };

  return (
    <AlertModalContext.Provider value={{alertModal: alertModalRef, showAlert}}>
      {children}
      <AlertModal ref={alertModalRef} />
    </AlertModalContext.Provider>
  );
}
