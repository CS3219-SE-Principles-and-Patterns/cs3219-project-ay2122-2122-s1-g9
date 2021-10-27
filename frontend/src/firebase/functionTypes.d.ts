declare namespace FunctionTypes {
  interface getQuestionData {
    id: string;
  }

  interface addUserToQueueData {
    queueName: string;
  }
  interface removeUserFromQueueData {
    queueName: string;
  }
  interface changeQuestionData {
    queueName: string;
  }
}
