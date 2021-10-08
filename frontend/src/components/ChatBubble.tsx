import { Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';

import { Spacer } from './Styles';

interface ChatBubbleProps {
  displayName?: string;
  content: string;
}

interface BubbleProps {
  $displayName?: string;
}

const { Text } = Typography;

const StyledText = styled(Text)`
  color: #1890ff;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.div<BubbleProps>`
  background: ${(props) => (props.$displayName ? '#f5f5f5' : '#1890FF')};
  color: ${(props) => (props.$displayName ? '#000' : '#fff')};
  align-self: ${(props) => (props.$displayName ? 'flex-start' : 'flex-end')};
  border-radius: ${(props) =>
    props.$displayName ? '0px 8px 8px 8px' : '8px 0px 8px 8px'};
  padding: 8px 16px;
  overflow-wrap: anywhere;
`;

const ChatBubble: React.FC<ChatBubbleProps> = function ({
  displayName,
  content,
}) {
  return (
    <Container>
      {displayName && (
        <Container>
          <StyledText>{displayName}</StyledText>
          <Spacer $height="4px" />
        </Container>
      )}
      <ContentContainer $displayName={displayName}>{content}</ContentContainer>
      <Spacer $height="10px" />
    </Container>
  );
};

export default ChatBubble;
