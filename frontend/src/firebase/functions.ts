import firebaseApp from './firebaseApp';

const getQuestionFunc = firebaseApp
  .functions()
  .httpsCallable('questions-getQuestion');

const addUserToQueueFunc = firebaseApp
  .functions()
  .httpsCallable('queues-addUserToQueue');

export const getQuestion = async (data: FunctionTypes.getQuestionData) => {
  return await getQuestionFunc(data);
};

export const addUserToQueue = async (
  data: FunctionTypes.addUserToQueueData
) => {
  return await addUserToQueueFunc(data);
};
