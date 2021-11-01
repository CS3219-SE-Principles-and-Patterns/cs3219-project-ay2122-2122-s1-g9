declare namespace App {
  interface getQuestionData {
    qnsId?: string;
  }

  interface addUserToQueue {
    queueName?: string;
  }

  interface removeUserFromQueue {
    queueName?: string;
  }

  interface userTimeoutDetails {
    userId: string;
    queueName: string;
  }

  interface getSessionData {
    sessId?: string;
  }

  interface changeQuestionData {
    level: string;
  }

  interface Session {
    qnsId: string;
    status: 'started' | 'ended';
    startedAt: number;
    endedAt?: number;
    writer: string;
    users: [string, string];
    lvl: string;
  }

  interface sessionUpdateData {
    status?: 'started' | 'ended';
    endedAt?: number;
    writer?: string;
  }

  interface getWriterData {
    sessId?: string;
  }
}
