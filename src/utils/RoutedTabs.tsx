import React, { FC, useCallback } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import Tabs from 'antd/es/tabs';

const generateChildren = (propsChildren: any, location: RouteComponentProps['location']) => {
  let activeKey = null;

  const children = React.Children.map(propsChildren, child => {
    if (!child) return null;
    const [pathname] = child.props.to.split('?');
    if (location.pathname === pathname) {
      activeKey = `.$${child.key.toString()}`;
    }

    return React.cloneElement(child, { to: undefined });
  });
  return [activeKey, children];
};
type TabsProps = Omit<React.ComponentProps<typeof Tabs>, 'onChange' | 'activeKey'>;
type Props = RouteComponentProps & TabsProps & {
  action?: 'push' | 'replace';
}

const RoutedTabs: FC<Props> = ({
  history,
  location,
  children,
  action = 'push',
  ...tabProps
}) => {
  const onChange = useCallback((key: string) => {
    const childkey = key.substring(2);
    let route;
    React.Children.forEach(children, child => {
      if (child && (child as any).key.toString() === childkey) route = (child as any).props.to;
    });
    if (route) history.push(route, { resetScroll: false });
  }, [history]);

  const [activeKey, childs] = generateChildren(children, location);

  return (
    <Tabs activeKey={activeKey} onChange={onChange} {...tabProps}>
      {childs}
    </Tabs>
  );
};

export default withRouter(RoutedTabs);
