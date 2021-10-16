import { Layout } from 'antd';
import React from 'react';
import styled from 'styled-components';

const { Sider } = Layout;

const StyledSider = styled(Sider)`
  background: ${(props) => props.theme.colors.white};
  max-height: 100%;
  overflow-y: auto;
`;

const Sidebar: React.FC = function (props) {
  const { children } = props;

  return <StyledSider width="440">{children}</StyledSider>;
};

export default Sidebar;
