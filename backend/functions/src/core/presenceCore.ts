import * as admin from 'firebase-admin';

export async function isOnline(uid: string): Promise<boolean> {
  const db = admin.database();
  const path = db.ref(`/status/${uid}`);

  const data = (await path.once('value')).val();

  if (!data || !Object.keys(data).includes('state')) {
    return false;
  }

  return data['state'] == 'online';
}
