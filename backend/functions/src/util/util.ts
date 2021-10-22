import * as admin from 'firebase-admin';

export async function isInSession(uid: string): Promise<boolean> {
  const fs = admin.firestore();
  return (await fs.collection('currentSessions').doc(uid).get()).exists;
}

export async function getCurrentSessionId(uid: string): Promise<string | null> {
  const fs = admin.firestore();
  const docRef = await fs.collection('currentSessions').doc(uid).get();

  if (!docRef.exists) {
    return null;
  }

  return docRef.data()['sessId'];
}

export async function getSession(sessId: string): Promise<any> {
  const fs = admin.firestore();
  const docRef = await fs.collection('sessions').doc(sessId).get();

  if (!docRef.exists) {
    return null;
  }

  return docRef.data();
}
