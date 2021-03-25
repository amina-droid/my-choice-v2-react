import React, { FC } from 'react';
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
  resource = 0,
  children,
  color,
  title,
}) => (
  <Animate
    start={{ resource }}
    enter={{ resource: [resource], timing: TIMING }}
    update={{ resource: [resource], timing: TIMING }}
  >
    {(state) => {
      console.log(state);
      return (
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
      );
    }}
  </Animate>
);

export default Resource;
