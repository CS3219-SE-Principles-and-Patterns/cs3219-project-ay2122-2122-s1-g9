import { PROJECT_ID } from './firebaseConfig';

export const CLOUD_TASK_PROJECT_ID = PROJECT_ID;
export const CLOUD_TASK_LOCATION = 'us-central1'; // Cloud Tasks only exist in us-central1

export const MATCH_TIMEOUT_QUEUE_NAME = 'match-timeout-queue';
export const REMOVE_UNMATCHED_USER_FUNCTION_NAME =
  'queues-removeUnmatchedUserAfterTimeout';
export const REMOVE_UNMATCHED_USER_FUNCTION_URL = `https://${CLOUD_TASK_LOCATION}-${CLOUD_TASK_PROJECT_ID}.cloudfunctions.net/${REMOVE_UNMATCHED_USER_FUNCTION_NAME}`;
export const USER_TIMEOUT_DURING_MATCH = 30;
