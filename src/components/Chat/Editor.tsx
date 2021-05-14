import React, { useEffect, useReducer } from 'react';
import { Button, Form, Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { Actions } from '../../types';
import { obsceneFilter } from '../../utils/obsceneFilter';

import s from './Chat.module.sass';

type EditorProps = {
  onSubmit: (value: string) => void;
  submitting?: boolean;
};

type EditorState = {
  message: string;
  isObscene: boolean;
  isOversize: boolean;
}

const initialEditorState: EditorState = {
  message: '',
  isObscene: false,
  isOversize: false,
};

type EditorActions = Actions<{
  writing: string;
  clear: never;
  obsceneError: never;
}>

const MSG_LENGTH_MAX = 255;

const editorReducer = (prevState: EditorState, action: EditorActions): EditorState => {
  switch (action.type) {
    case 'writing': {
      if (action.payload.length > MSG_LENGTH_MAX) {
        return {
          ...prevState,
          isOversize: true,
        };
      }
      return {
        message: action.payload,
        isObscene: false,
        isOversize: false,
      };
    }
    case 'clear': {
      return {
        message: '',
        isObscene: false,
        isOversize: false,
      };
    }
    case 'obsceneError': {
      return {
        ...prevState,
        isObscene: true,
      };
    }
    default: {
      return prevState;
    }
  }
};

const Editor: React.FC<EditorProps> = ({ onSubmit, submitting }) => {
  const [{
    message,
    isObscene,
    isOversize,
  }, editorDispatch] = useReducer(editorReducer, initialEditorState);
  const handleChange = (e: any) => {
    editorDispatch({ type: 'writing', payload: e.target.value });
  };

  useEffect(() => {
    if (submitting) {
      editorDispatch({ type: 'clear' });
    }
  }, [submitting]);

  const sendMessage = (msg: string) => {
    if (obsceneFilter.containsMat(message)) {
      editorDispatch({ type: 'obsceneError' });
      return;
    }
    onSubmit(msg);
  };

  const handleSubmit = () => {
    sendMessage(message);
  };

  const handlerKeyPress = (e: any) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      sendMessage(message);
    }
  };

  return (
    <div className={s.editorContainer}>
      <Form.Item
        className={s.textarea}
        validateStatus={isObscene || isOversize ? 'error' : undefined}
        help={isObscene
          ? 'Обсценная лексика!'
          : isOversize
            ? 'Превышен лимит сообщения!'
            : undefined}
      >
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 2 }}
          onKeyDown={handlerKeyPress}
          onChange={handleChange}
          value={message}
        />
      </Form.Item>
      <Form.Item className={s.sendBtn}>
        <Button
          htmlType="submit"
          loading={submitting}
          onClick={handleSubmit}
          type="primary"
          shape="circle"
          icon={<SendOutlined />}
        />
      </Form.Item>
    </div>
  );
};

export default Editor;
