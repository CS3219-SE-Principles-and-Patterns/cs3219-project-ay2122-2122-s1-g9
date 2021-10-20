import * as admin from 'firebase-admin';

export function sendMessageToUser(
  userId: string,
  messageKey: string,
  messageText: string
): void {
  const db = admin.database();

  const message = {
    type: messageKey,
    data: messageText,
  };

  const userPath = db.ref(`/users/${userId}`);
  userPath.push(message);
}
