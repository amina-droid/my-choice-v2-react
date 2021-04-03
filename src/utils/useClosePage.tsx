import React, { useEffect } from 'react';
import { Modal, ModalFuncProps } from 'antd';

function closePage(onOk: () => void, props?: ModalFuncProps) {
  return (e: BeforeUnloadEvent) => {
    if (props) {
      Modal.confirm({
        ...props,
        onOk,
      });
    }
    e.preventDefault();
    e.returnValue = 'Are you sure you want to close?';
  };
}

function changePage(onOk: () => void, props?: ModalFuncProps) {
  return (e: PopStateEvent) => {
    e.preventDefault();
    // eslint-disable-next-line no-restricted-globals
    window.history.pushState(null, 'Мой выбор', location.href);
    // eslint-disable-next-line no-restricted-globals
    window.history.go(1);
    if (props) {
      Modal.confirm({
        ...props,
        onOk,
      });
    }
  };
}

function useClosePage(
  onClose: () => void,
  modalProps?: ModalFuncProps,
  ) {
  useEffect(() => {
    const listener = closePage(onClose, modalProps);
    window.addEventListener('beforeunload', listener);

    return () => window.removeEventListener('beforeunload', listener);
  }, [onClose, modalProps]);

  useEffect(() => {
    const listener = changePage(onClose, modalProps);
    window.addEventListener('popstate', listener);

    return () => window.removeEventListener('popstate', listener);
  }, [onClose, modalProps]);
}

export default useClosePage;
