import {
  CopyOutlined,
  MessageFilled,
  MessageOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import styled from 'styled-components';

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
`;

const ChatButton = styled(Button)`
  border: none;
  background: none;
`;

const LeetCodeButton = styled(Button)`
  border: 1px solid #1890ff;
  color: #1890ff;
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
      <CopyButton onClick={handleCopy}>
        <CopyOutlined />
      </CopyButton>
      <select value={editorLanguage} onChange={handleLanguageChange}>
        {questionTemplates.map((language) => (
          <option key={language.value} value={language.value}>
            {language.text}
          </option>
        ))}
      </select>
      <ChatButton onClick={toggleChat}>
        {isChatVisible ? <MessageFilled /> : <MessageOutlined />}
      </ChatButton>
      <LeetCodeButton target="_blank" href={questionLink}>
        Go to Leetcode
      </LeetCodeButton>
    </StyledTopToolBar>
  );
};

export default TopToolBar;
