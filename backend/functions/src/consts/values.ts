export const LVL_EASY = 'easy';
export const LVL_MEDIUM = 'medium';
export const LVL_HARD = 'hard';
export const ALL_LVLS = Object.freeze([LVL_EASY, LVL_MEDIUM, LVL_HARD]);

export const SESS_STATUS_STARTED = 'started';
export const SESS_STATUS_ENDED = 'ended';

export const SUCCESS_RESP = { success: true };

export const PROJECT_ID = 'cs3219-project-dev';
export const MATCH_TIMEOUT_QUEUE_NAME = 'match-timeout-queue';
export const PROJECT_LOCATION = 'us-central1';
export const REMOVE_UMATCHED_USER_FUNCTION_NAME =
  'removeUnmatchedUserAfterTimeout';
export const REMOVE_UMATCHED_USER_FUNCTION_URL = `https://${PROJECT_LOCATION}-${PROJECT_ID}.cloudfunctions.net/${REMOVE_UMATCHED_USER_FUNCTION_NAME}`;
export const USER_TIMEOUT_DURING_MATCH = 30;
