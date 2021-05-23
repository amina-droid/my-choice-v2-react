import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import Button from 'antd/es/button';
import Modal from 'antd/es/modal';
import Menu from 'antd/es/menu';
import Avatar from 'antd/es/avatar';
import Form from 'antd/es/form';
import Input from 'antd/es/input';

import { useAuth } from '../../context/auth';
import {
  UPDATE_NICKNAME,
  UpdateNickname,
  UpdateNicknameVariables,
} from '../../apollo';
import { formicObsceneValidator } from '../../utils/obsceneFilter';

import s from './Profile.module.sass';

const Profile = () => {
  const { user, logout } = useAuth();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>();
  const [mutation, { loading }] = useMutation<
    UpdateNickname,
    UpdateNicknameVariables
    >(UPDATE_NICKNAME, {
    update: (cache, mutationResult) => {
      if (!mutationResult.data?.updateNickname.nickname) return;
      cache.modify({
        id: cache.identify({
          __typename: 'User',
          _id: user?._id,
        }),
        fields: {
          nickname: () => {
            return mutationResult.data?.updateNickname.nickname;
          },
        },
      });
    },
  });

  const handlerOpenModal = () => {
    setVisible(true);
  };

  const handlerUpdateNickname = async (values: { nickname: string }) => {
    await mutation({ variables: { nickname: values.nickname.trim() } });
    setVisible(false);
  };

  const handlerCloseModal = () => {
    setVisible(false);
  };

  return (
    <>
      <Menu
        theme="light"
        className={s.profileNav}
        defaultSelectedKeys={['']}
        mode="horizontal"
      >
        <Menu.SubMenu
          key="key1"
          title={(
            <>
              <span className={s.profileName}>{user?.nickname}</span>
              <Avatar src={user?.photos[0].url} />
            </>
          )}
        >
          <Menu.Item disabled>{user?.name.givenName} {user?.name.familyName}</Menu.Item>
          <Menu.Item onClick={handlerOpenModal}>Изменить никнейм</Menu.Item>
          <Menu.Item>
            <Button type="text" block danger onClick={logout}>Выйти</Button>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
      <Modal
        visible={visible}
        destroyOnClose
        onCancel={handlerCloseModal}
        title="Изменить никнейм"
        okText="Сохранить"
        cancelText="Закрыть"
        confirmLoading={loading}
        onOk={() => {
          form
            .validateFields()
            .then(handlerUpdateNickname);
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="nickname_form"
          initialValues={{ nickname: user?.nickname }}
        >
          <Form.Item
            name="nickname"
            rules={[{ required: true, message: 'Не может быть пустым' }, formicObsceneValidator]}
          >
            <Input maxLength={50} disabled={loading} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Profile;
