import { Button } from 'antd';
import React from 'react';
import styled from 'styled-components';

interface BottomToolBarProps {}

const ChangeQuestionButton = styled(Button)`
  border: 1px solid #1890ff;
  color: #1890ff;
`;

const StyledBottomToolBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #e9f7fe;
  height: 64px;
  border-top: 1px solid #91d5ff;
`;

const BottomToolBar: React.FC<BottomToolBarProps> = function ({}) {
  return (
    <StyledBottomToolBar>
      <ChangeQuestionButton>Change the question</ChangeQuestionButton>
      <Button type="primary">Finish Session</Button>
    </StyledBottomToolBar>
  );
};

export default BottomToolBar;
