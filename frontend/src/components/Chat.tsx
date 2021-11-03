import { SendOutlined } from '@ant-design/icons';
import { Button, Input, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import firebaseApp from '../firebase/firebaseApp';
import { getIsVisible, setHasNewMessage } from '../redux/chatSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getSessionId } from '../redux/matchSlice';
import ChatBubble from './ChatBubble';
import { Spacer } from './Styles';

const { Text } = Typography;

const OverallContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 283px;
  background: #ffffff;
`;

const ChatContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow-y: auto;
`;

const StyledHeader = styled(Text)`
  font-weight: 500;
  color: #1890ff;
  align-self: center;
  padding: 16px 0;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f5f5f5;
  gap: 16px;
`;

const StyledInput = styled(Input)`
  background: none;
  flex-grow: 1;
  border: none;
`;

const SendButton = styled(Button)`
  border: none;
  background: none;
`;

const Chat: React.FC = function () {
  const sessionId = useAppSelector(getSessionId);
  const [messages, setMessages] = useState<Types.ChatMessage[]>([]);
  const [content, setContent] = useState<string>('');
  const isChatVisible = useAppSelector(getIsVisible);
  const dispatch = useAppDispatch();

  const dbRef = firebaseApp.database().ref(`sessions/${sessionId}/messages`);
  const currentUser = firebaseApp.auth().currentUser;
  const uid = currentUser?.uid;
  const displayName = currentUser?.displayName;

  useEffect(() => {
    console.log('useEffect called');
    dbRef.on('value', (snapshot) => {
      console.log('listener called'); // is called whenever the thing opens
      const chatMessages = [] as Types.ChatMessage[];
      snapshot.forEach((snap) => {
        chatMessages.push(snap.val());
      });
      const initialLength = messages.length;
      console.log(
        'initial Length: ',
        initialLength,
        ', chatMessages.length: ',
        chatMessages.length,
        'isChatVisible: ',
        isChatVisible
      );
      if (chatMessages.length > initialLength && !isChatVisible) {
        // problem is isChatVisible has an old copy, it always happens to be true
        console.log('SET TRUE HERE'); // but also called when u urself set the message so maybe when chat is not visible? dpesmt work cos not mounted
        dispatch(setHasNewMessage(true));
      }
      setMessages(chatMessages);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChatVisible]);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const tempContent = content;
    try {
      if (!uid) {
        throw new Error('User not logged in');
      }
      setContent('');
      await dbRef.push({
        content,
        timeStamp: Date.now().toString(),
        uid,
        displayName,
      } as Types.ChatMessage);
    } catch (error: unknown) {
      const result = (error as Error).message;
      console.log(result);
      setContent(tempContent);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  if (!isChatVisible) {
    return null;
  }

  return (
    <OverallContainer>
      <StyledHeader>Chat</StyledHeader>
      <ChatContainer>
        <Spacer $height="16px" />
        {messages.map((chat) => {
          if (chat.uid != uid) {
            return (
              <ChatBubble
                key={chat.timeStamp}
                displayName={chat.displayName}
                content={chat.content}
              />
            );
          }
          return <ChatBubble key={chat.timeStamp} content={chat.content} />;
        })}
      </ChatContainer>
      <StyledForm onSubmit={handleSubmit}>
        <StyledInput
          placeholder="Write a response..."
          onChange={handleChange}
          value={content}
        />
        <SendButton htmlType="submit" disabled={content.length === 0}>
          <SendOutlined />
        </SendButton>
      </StyledForm>
    </OverallContainer>
  );
};

export default Chat;
