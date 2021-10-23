import * as admin from 'firebase-admin';

export async function isOnline(uid: string): boolean {
  const db = admin.database();
  const path = db.ref(`/status/${uid}`);

  const data = await path.once('value');
  return data['state'] == 'online';
}
