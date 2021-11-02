import * as admin from 'firebase-admin';

const ASCII_CHARS =
  '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

const isOnlineForDatabase = {
  state: 'online',
  lastUpdated: admin.database.ServerValue.TIMESTAMP,
};

export async function setUserOnline(uid: string): Promise<void> {
  await admin.database().ref(`/status/${uid}`).set(isOnlineForDatabase);
}

export async function createUser(): Promise<string> {
  // By default, user will be online
  let userId = '';

  for (let i = 0; i < 28; i++) {
    userId += ASCII_CHARS.charAt(
      Math.floor(Math.random() * ASCII_CHARS.length)
    );
  }

  return userId;
}

export async function createOnlineUser(): Promise<string> {
  const userId = await createUser();
  await setUserOnline(userId);
  return userId;
}

export async function createSession(): Promise<App.Session> {
  const userId1 = await createOnlineUser();
  const userId2 = await createOnlineUser();
  const sessData: App.Session = {
    qnsId: 'two-sums',
    status: 'started',
    startedAt: Date.now(),
    users: [userId1, userId2],
    lvl: 'easy',
    writer: userId1,
  };

  const fs = admin.firestore();
  const docRef = await fs.collection('sessions').add(sessData);

  for (const id of sessData.users) {
    await fs.collection('currentSessions').doc(id).set({
      sessId: docRef.id,
    });
  }

  return sessData;
}
