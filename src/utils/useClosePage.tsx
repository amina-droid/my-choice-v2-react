import React from 'react';
import Modal, { ModalFuncProps } from 'antd/es/modal';
import useEventListener from './useEventListener';

const closePage = (onOk: () => void, props?: ModalFuncProps) => (e: BeforeUnloadEvent) => {
  if (props) {
    Modal.confirm({
      ...props,
      onOk,
    });
  }
  e.preventDefault();
  e.returnValue = 'Вы уверены, что хотите выйти?';
};

const changePage = (onOk: () => void, props?: ModalFuncProps) => {
  window.history.pushState('', 'Мой выбор', window.location.pathname);
  return (e: PopStateEvent) => {
    if (props) {
      Modal.confirm({
        ...props,
        onOk,
      });
    }
  };
};

function useClosePage(
  onClose: () => void,
  modalProps?: ModalFuncProps,
) {
  useEventListener('beforeunload', closePage(onClose, modalProps));
  useEventListener('popstate', changePage(onClose, modalProps));
}

export default useClosePage;
