import React, { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';

import s from './Chat.module.sass';

type EditorProps = {
  onSubmit: (value: string) => void;
  submitting?: boolean;
};
const Editor: React.FC<EditorProps> = ({ onSubmit, submitting }) => {
  const [message, setMessage] = useState('');
  const handleChange = (e: any) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    if (submitting) {
      setMessage('');
    }
  }, [submitting]);

  const handleSubmit = () => {
    onSubmit(message);
  };
  const handlerKeyPress = (e: any) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      onSubmit(message);
    }
  };

  return (
    <div className={s.editorContainer}>
      <Form.Item className={s.textarea}>
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
