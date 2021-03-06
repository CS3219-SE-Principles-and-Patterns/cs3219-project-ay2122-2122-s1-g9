import { SendOutlined } from '@ant-design/icons';
import { Button, Input, Typography } from 'antd';
import firebase from 'firebase';
import React, { useEffect, useRef, useState } from 'react';
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
  const dispatch = useAppDispatch();
  const sessionId = useAppSelector(getSessionId);
  const isChatVisible = useAppSelector(getIsVisible);
  const [messages, setMessages] = useState<Types.ChatMessage[]>([]);
  const [content, setContent] = useState<string>('');
  const chatRef = useRef<HTMLDivElement | null>(null);

  const currentUser = firebaseApp.auth().currentUser;
  const uid = currentUser?.uid;
  const displayName = currentUser?.displayName;

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    const latestMessage = messages[messages.length - 1];
    const isFromOtherParty = latestMessage.uid !== uid;

    if (!isChatVisible && isFromOtherParty) {
      dispatch(setHasNewMessage(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, messages, uid]);

  useEffect(() => {
    if (sessionId == null) {
      return;
    }
    firebaseApp
      .database()
      .ref(`sessions/${sessionId}/messages`)
      .on('value', (snapshot) => {
        const chatMessages = [] as Types.ChatMessage[];
        snapshot.forEach((snap) => {
          chatMessages.push(snap.val());
        });
        setMessages(chatMessages);
      });
  }, [sessionId]);

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    chatRef.current?.lastElementChild?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, isChatVisible]);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const tempContent = content;
    try {
      if (!uid) {
        throw new Error('User not logged in');
      }
      setContent('');
      await firebaseApp
        .database()
        .ref(`sessions/${sessionId}/messages`)
        .push({
          content,
          timeStamp: firebase.database.ServerValue.TIMESTAMP,
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
      <ChatContainer ref={chatRef}>
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
