import React, { useEffect, useState } from 'react';

import firebaseApp from '../firebase/firebaseApp';

interface ChatMessage {
  content: string;
  timeStamp: string;
  uid: string | null;
}

interface ChatErrors {
  readError: string | null;
  writeError: string | null;
}

const Chat: React.FC = function () {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [content, setContent] = useState<string>('');
  const [chatError, setChatError] = useState<ChatErrors>({
    readError: null,
    writeError: null,
  });
  const dbRef = firebaseApp.database().ref('testChat/messages');
  const uid = firebaseApp.auth().currentUser?.uid ?? null;

  useEffect(() => {
    dbRef.on('value', (snapshot) => {
      const chatMessages = [] as ChatMessage[];
      snapshot.forEach((snap) => {
        chatMessages.push(snap.val());
      });
      setMessages(chatMessages);
    });
  }, []);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      if (!uid) {
        throw new Error('User not logged in');
      }
      console.log(uid);
      await dbRef.push({
        content,
        timeStamp: Date.now().toString(),
        uid,
      } as ChatMessage);
      setContent('');
    } catch (error: unknown) {
      const result = (error as Error).message;
      setChatError({
        ...chatError,
        writeError: result,
      });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  return (
    <div>
      {messages.map((chat) => {
        if (chat.uid != uid) {
          console.log('uid no match');
          return <p key={chat.timeStamp}>{'other ' + chat.content}</p>;
        }
        return <p key={chat.timeStamp}>{chat.content}</p>;
      })}
      <form onSubmit={handleSubmit}>
        <input onChange={handleChange} value={content}></input>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
