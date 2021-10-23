import * as admin from 'firebase-admin';

export async function sendMessage(
  userId: string,
  msgType: string,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  msgData: any
): Promise<void> {
  const db = admin.database();

  const message = {
    type: msgType,
    data: msgData,
  };

  const userPath = db.ref(`/users/${userId}`);
  await userPath.push(message);
}
