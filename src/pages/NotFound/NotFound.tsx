import React from 'react';
import { useHistory } from 'react-router-dom';

import Button from 'antd/es/button';
import Result from 'antd/es/result';

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
