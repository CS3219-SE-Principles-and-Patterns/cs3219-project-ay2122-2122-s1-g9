import {
  CopyOutlined,
  MessageFilled,
  MessageOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import styled from 'styled-components';

import { Spacer } from './Styles';

interface TopToolBarProps {
  editorLanguage: string;
  handleLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  questionTemplates: {
    value: string;
    text: string;
    defaultCode: string;
  }[];
  handleCopy: () => void;
  isChatVisible: boolean;
  toggleChat: () => void;
  questionLink: string;
}

const StyledTopToolBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #e9f7fe;
  height: 64px;
  border-bottom: 1px solid #91d5ff;
`;

const CopyButton = styled(Button)`
  border: none;
  background: none;
  color: #40a9ff;
`;

const ChatButton = styled(Button)`
  border: none;
  background: none;
  color: #40a9ff;
`;

const LeetCodeButton = styled(Button)`
  border: 1px solid #1890ff;
  color: #1890ff;
`;

const StyledSelect = styled.select`
  padding: 4px;
  border: 1px solid #1890ff;
  color: #40a9ff;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TopToolBar: React.FC<TopToolBarProps> = function ({
  editorLanguage,
  handleLanguageChange,
  questionTemplates,
  handleCopy,
  isChatVisible,
  toggleChat,
  questionLink,
}) {
  return (
    <StyledTopToolBar>
      <LeftContainer>
        <Spacer $width="16px" />
        <CopyButton onClick={handleCopy} icon={<CopyOutlined />} size="large" />
        <Spacer $width="16px" />
        <StyledSelect value={editorLanguage} onChange={handleLanguageChange}>
          {questionTemplates.map((language) => (
            <option key={language.value} value={language.value}>
              {language.text}
            </option>
          ))}
        </StyledSelect>
      </LeftContainer>
      <RightContainer>
        <ChatButton
          onClick={toggleChat}
          icon={isChatVisible ? <MessageFilled /> : <MessageOutlined />}
          size="large"
        />
        <Spacer $width="16px" />
        <LeetCodeButton
          rel="noopener noreferrer"
          target="_blank"
          href={questionLink}
        >
          Go to Leetcode
        </LeetCodeButton>
        <Spacer $width="16px" />
      </RightContainer>
    </StyledTopToolBar>
  );
};

export default TopToolBar;
