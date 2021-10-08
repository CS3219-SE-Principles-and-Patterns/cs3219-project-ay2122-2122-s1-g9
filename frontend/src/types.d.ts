declare namespace Types {
  interface User {
    id: string;
  }

  interface ChatMessage {
    content: string;
    timeStamp: string;
    uid: string | undefined;
    displayName: string | undefined;
  }
}
