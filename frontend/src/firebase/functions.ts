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

const getQueueUserIsInFunc = firebaseApp
  .functions()
  .httpsCallable('queues-getQueueUserIsIn');

const getSessionFunc = firebaseApp
  .functions()
  .httpsCallable('sessions-getSession');

const stopSessionFunc = firebaseApp
  .functions()
  .httpsCallable('sessions-stopSession');

const isInCurrentSessionFunc = firebaseApp
  .functions()
  .httpsCallable('sessions-isInCurrentSession');

const getCurrentSessionIdFunc = firebaseApp
  .functions()
  .httpsCallable('sessions-getCurrentSessionId');

const changeQuestionRequestFunc = firebaseApp
  .functions()
  .httpsCallable('sessions-changeQuestionRequest');

const changeQuestionFunc = firebaseApp
  .functions()
  .httpsCallable('sessions-changeQuestion');

const rejectChangeQuestionFunc = firebaseApp
  .functions()
  .httpsCallable('sessions-rejectChangeQuestion');

const updateAndGetWriterFunc = firebaseApp
  .functions()
  .httpsCallable('sessions-updateAndGetWriter');

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

export const getQueueUserIsIn = async () => {
  return await getQueueUserIsInFunc();
};

export const getSession = async (data: FunctionTypes.getSessionData) => {
  return await getSessionFunc(data);
};

export const stopSession = async () => {
  return await stopSessionFunc();
};

export const isInCurrentSession = async () => {
  return await isInCurrentSessionFunc();
};

export const getCurrentSessionId = async () => {
  return await getCurrentSessionIdFunc();
};

export const changeQuestionRequest = async () => {
  return await changeQuestionRequestFunc();
};

export const changeQuestion = async () => {
  return await changeQuestionFunc();
};

export const rejectChangeQuestion = async () => {
  return await rejectChangeQuestionFunc();
};

export const updateAndGetWriter = async (data: FunctionTypes.getWriterData) => {
  return await updateAndGetWriterFunc(data);
};
