declare namespace App {
  interface getQuestionData {
    id: string;
  }
  interface addUserToQueue {
    queueName: string;
  }
  interface removeUserFromQueue {
    queueName: string;
  }
  interface userTimeoutDetails {
    userId: string;
    queueName: string;
  }
}
