import React, { FC, useState } from 'react';
import { Button, Modal, Tooltip } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { SHARE_RESOURCES, ShareResources, ShareResourcesVariables } from '../../../apollo';
import { ReactComponent as ChangerBtn } from './changer.svg';

import s from './ChangeResources.module.sass';
import { ResourcesInput, ResourceType } from '../../../types';
import { RESOURCES_DICT_OBJ } from '../PlayersTable/PlayerRow';

type ChangeResourcesProps = {
  className?: string;
  iconClass?: string;
  resources?: ResourcesInput | null;
};

const ChangeResources: FC<ChangeResourcesProps> = ({ className, iconClass, resources }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [changeResources] = useMutation<ShareResources, ShareResourcesVariables>(SHARE_RESOURCES);

  const changeResourceHandler = (from: ResourceType, to: ResourceType) => () => {
    changeResources({ variables: { from, to } });
  };

  return (
    <>
      <Tooltip title="Обмен ресурсов">
        <button
          type="button"
          className={className}
          onClick={() => setVisible(true)}
          disabled={!resources}
        >
          <ChangerBtn className={iconClass} />
        </button>
      </Tooltip>
      <Modal
        footer={null}
        title="Обмен ресурсов"
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <div className={s.modalContainer}>
          <Tooltip title="Обменять 1 СК(Ч) за 50 монет">
            <Button
              className={s.changeBtn}
              disabled={resources?.money! < 50 || !resources?.dark}
              onClick={changeResourceHandler(ResourceType.dark, ResourceType.money)}
            >
              {RESOURCES_DICT_OBJ['dark']}x1
              <SwapOutlined />
              {RESOURCES_DICT_OBJ['money']}x50
            </Button>
          </Tooltip>
          <Tooltip title="Обменять 1 СК(Ч) за 5 СК(Б)">
            <Button
              className={s.changeBtn}
              disabled={resources?.white! < 5 || !resources?.dark}
              onClick={changeResourceHandler(ResourceType.dark, ResourceType.white)}
            >
              {RESOURCES_DICT_OBJ['dark']}x1
              <SwapOutlined />
              {RESOURCES_DICT_OBJ['white']}x5
            </Button>
          </Tooltip>
          <Tooltip title="Обменять 1 СК(Ч) за 5 жизней">
            <Button
              className={s.changeBtn}
              disabled={resources?.lives! < 5 || !resources?.dark}
              onClick={changeResourceHandler(ResourceType.dark, ResourceType.lives)}
            >
              {RESOURCES_DICT_OBJ['dark']}x1
              <SwapOutlined />
              {RESOURCES_DICT_OBJ['lives']}x5
            </Button>
          </Tooltip>
          <Tooltip title="Обменять 10 монет на 1 жизнь">
            <Button
              className={s.changeBtn}
              disabled={resources?.money! < 10}
              onClick={changeResourceHandler(ResourceType.lives, ResourceType.money)}
            >
              {RESOURCES_DICT_OBJ['money']}x10
              <SwapOutlined />
              {RESOURCES_DICT_OBJ['lives']}x1
            </Button>
          </Tooltip>
        </div>
      </Modal>
    </>
  );
};

export default ChangeResources;
