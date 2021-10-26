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

  interface Session {
    qnsId: string;
    status: 'started' | 'ended';
    startedAt: number;
    endedAt?: number;
    users: [string, string];
  }
}
