declare namespace FunctionTypes {
  interface getQuestionData {
    qnsId: string;
  }

  interface addUserToQueueData {
    queueName: string;
  }

  interface removeUserFromQueueData {
    queueName: string;
  }

  interface getSessionData {
    sessId: string;
  }

  interface getWriterData {
    sessId: string;
  }
}
