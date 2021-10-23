import * as admin from 'firebase-admin';

export function sendMessageToUser(
  userId: string,
  messageKey: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messageText: any
): void {
  const db = admin.database();

  const message = {
    type: messageKey,
    data: messageText,
  };

  const userPath = db.ref(`/users/${userId}`);
  userPath.push(message);
}
