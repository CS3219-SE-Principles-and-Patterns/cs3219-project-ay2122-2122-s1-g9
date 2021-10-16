import { Layout } from 'antd';
import React from 'react';
import styled from 'styled-components';

import Nav from './Nav';

const StyledLayout = styled(Layout)`
  height: 100vh;
`;

const PageLayout: React.FC = function (props) {
  const { children } = props;

  return (
    <StyledLayout>
      <Nav />
      {children}
    </StyledLayout>
  );
};

export default PageLayout;
