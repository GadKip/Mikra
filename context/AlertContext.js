import React, { createContext, useContext, useState } from 'react';
import CustomAlert from '../components/CustomAlert';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    visible: false,
    title: '',
    message: '',
    onClose: null,
    onConfirm: null,
    confirmText: 'Ok',
    cancelText: 'Cancel',
    showCancel: false,
  });

  const showAlert = (alertProps) => {
    setAlert({ ...alertProps, visible: true });
  };

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <CustomAlert {...alert} onClose={hideAlert} />
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);