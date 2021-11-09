import * as admin from 'firebase-admin';

const ASCII_CHARS =
  '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

const isOnlineForDatabase = {
  state: 'online',
  lastUpdated: admin.database.ServerValue.TIMESTAMP,
};

function generateId(): string {
  let id = '';

  for (let i = 0; i < 28; i++) {
    id += ASCII_CHARS.charAt(Math.floor(Math.random() * ASCII_CHARS.length));
  }

  return id;
}

export async function setUserOnline(uid: string): Promise<void> {
  await admin.database().ref(`/status/${uid}`).set(isOnlineForDatabase);
}

export async function createUser(): Promise<string> {
  return generateId();
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

export async function createMatchTimeoutTask(userId: string): Promise<any> {
  const firestore = admin.firestore();
  const task = { taskId: generateId() };
  await firestore
    .doc(`matchTimeoutTasks/${userId}`)
    .set({ taskId: task.taskId });
  return task;
}
