import SnackBar from "@/components/MUI/snackbar";
import useToastProps, { useToastPropsTypes } from "@/utils/hooks/useToastProps";
import React, { useContext } from "react";

interface ToastContextType {
  toastProps: useToastPropsTypes;
}

const ToastContext = React.createContext<ToastContextType>(
  {} as ToastContextType
);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toastProps = useToastProps();
  return (
    <ToastContext.Provider value={{ toastProps: toastProps }}>
      <SnackBar {...toastProps} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
