import './App.less';

import { Button } from 'antd';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 20px;
`;

const App: React.FC = function () {
  return (
    <Wrapper>
      <Button type="primary">Primary Button</Button>
    </Wrapper>
  );
};

export default App;
