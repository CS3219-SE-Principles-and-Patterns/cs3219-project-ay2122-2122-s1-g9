import firebaseApp from './firebaseApp';

const getQuestionFunc = firebaseApp
  .functions()
  .httpsCallable('questions-getQuestion');

const addUserToQueueFunc = firebaseApp
  .functions()
  .httpsCallable('queues-addUserToQueue');

const removeUserFromQueueFunc = firebaseApp
  .functions()
  .httpsCallable('queues-removeUserFromQueue');

const stopSessionFunc = firebaseApp
  .functions()
  .httpsCallable('sessions-stopSession');

const isInCurrentSessionFunc = firebaseApp
  .functions()
  .httpsCallable('sessions-isInCurrentSession');

export const getQuestion = async (data: FunctionTypes.getQuestionData) => {
  return await getQuestionFunc(data);
};

export const addUserToQueue = async (
  data: FunctionTypes.addUserToQueueData
) => {
  return await addUserToQueueFunc(data);
};

export const removeUserFromQueue = async (
  data: FunctionTypes.removeUserFromQueueData
) => {
  return await removeUserFromQueueFunc(data);
};

export const stopSession = async () => {
  return await stopSessionFunc();
};

export const isInCurrentSession = async () => {
  return await isInCurrentSessionFunc();
};
