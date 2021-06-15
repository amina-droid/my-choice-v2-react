import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Result } from 'antd';

const NotFound = () => {
  const history = useHistory();

  const goToHome = () => {
    history.push('/');
  };
  return (
    <Result
      status="404"
      title="404"
      subTitle="Извините, эта страница либо в разработке, либо не существует."
      extra={
        <Button type="primary" onClick={goToHome}>
          Вернуться на главную
        </Button>
      }
    />
  );
};

export default NotFound;
