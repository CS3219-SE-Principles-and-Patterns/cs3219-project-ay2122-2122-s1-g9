import firebaseApp from './firebaseApp';
import { FIREBASE_PROJECT_ID } from './firebaseOptions';

let firebaseAppFunctions = firebaseApp.functions();
if (FIREBASE_PROJECT_ID === 'cs3219-project-prod') {
  firebaseAppFunctions = firebaseApp.functions('asia-southeast1');
}

const getQuestionFunc = firebaseAppFunctions.httpsCallable(
  'questions-getQuestion'
);

const addUserToQueueFunc = firebaseAppFunctions.httpsCallable(
  'queues-addUserToQueue'
);

const removeUserFromQueueFunc = firebaseAppFunctions.httpsCallable(
  'queues-removeUserFromQueue'
);

const getQueueUserIsInFunc = firebaseAppFunctions.httpsCallable(
  'queues-getQueueUserIsIn'
);

const getSessionFunc = firebaseAppFunctions.httpsCallable(
  'sessions-getSession'
);

const stopSessionFunc = firebaseAppFunctions.httpsCallable(
  'sessions-stopSession'
);

const isInCurrentSessionFunc = firebaseAppFunctions.httpsCallable(
  'sessions-isInCurrentSession'
);

const getCurrentSessionIdFunc = firebaseAppFunctions.httpsCallable(
  'sessions-getCurrentSessionId'
);

const changeQuestionRequestFunc = firebaseAppFunctions.httpsCallable(
  'sessions-changeQuestionRequest'
);

const changeQuestionFunc = firebaseAppFunctions.httpsCallable(
  'sessions-changeQuestion'
);

const rejectChangeQuestionFunc = firebaseAppFunctions.httpsCallable(
  'sessions-rejectChangeQuestion'
);

const updateAndGetWriterFunc = firebaseAppFunctions.httpsCallable(
  'sessions-updateAndGetWriter'
);

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
