export const LVL_EASY = 'easy';
export const LVL_MEDIUM = 'medium';
export const LVL_HARD = 'hard';
export const ALL_LVLS = Object.freeze([LVL_EASY, LVL_MEDIUM, LVL_HARD]);

export const SESS_STATUS_STARTED = 'started';
export const SESS_STATUS_ENDED = 'ended';

export const SUCCESS_RESP = { success: true };

// https://cloud.google.com/functions/docs/configuring/env-var#nodejs_10_and_subsequent_runtimes
export const PROJECT_ID = process.env['GCP_PROJECT'] || '';
export const PROJECT_LOCATION = process.env['FUNCTION_REGION'] || '';

export const MATCH_TIMEOUT_QUEUE_NAME = 'match-timeout-queue';
export const REMOVE_UMATCHED_USER_FUNCTION_NAME =
  'removeUnmatchedUserAfterTimeout';
export const REMOVE_UMATCHED_USER_FUNCTION_URL = `https://${PROJECT_LOCATION}-${PROJECT_ID}.cloudfunctions.net/${REMOVE_UMATCHED_USER_FUNCTION_NAME}`;
export const USER_TIMEOUT_DURING_MATCH = 30;
