import React, { FC } from 'react';
import { isNil } from 'lodash';
import { Animate } from 'react-move';
import { easeExpOut } from 'd3-ease';
import { Tooltip } from 'antd';

type ResourceProps = {
  className?: string
  resource?: number | null;
  color: string;
  title: string;
}

const TIMING = {
  duration: 1000,
  ease: easeExpOut,
};

const Resource: FC<ResourceProps> = ({
  className,
  resource,
  children,
  color,
  title,
}) => {
  if (isNil(resource)) {
    return (
      <div className={className}>
        <Tooltip
          placement="right"
          title={title}
          color={color}
        >
          {children}
        </Tooltip>
      </div>
    );
  }
  return (
    <Animate
      start={{ resource }}
      enter={{ resource: [resource], timing: TIMING }}
      update={{ resource: [resource], timing: TIMING }}
    >
      {(state) => (
        <div className={className}>
          <Tooltip
            placement="right"
            title={title}
            color={color}
          >
            {children}
          </Tooltip>
          {Math.round(state.resource)}
        </div>
      )}
    </Animate>
  );
};

export default Resource;
