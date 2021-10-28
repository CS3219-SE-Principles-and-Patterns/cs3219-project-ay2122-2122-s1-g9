export const LVL_EASY = 'easy';
export const LVL_MEDIUM = 'medium';
export const LVL_HARD = 'hard';
export const ALL_LVLS = Object.freeze([LVL_EASY, LVL_MEDIUM, LVL_HARD]);

export const SESS_STATUS_STARTED = 'started';
export const SESS_STATUS_ENDED = 'ended';

export const SUCCESS_RESP = { success: true };

// https://firebase.google.com/docs/functions/config-env
const FIREBASE_CONFIG_STR = process.env['FIREBASE_CONFIG'] || '';
const FIREBASE_CONFIG = JSON.parse(FIREBASE_CONFIG_STR);
export const PROJECT_ID = FIREBASE_CONFIG.projectId;
// Hack, we're doing this because the actual value of locationId is missing the number
export const PROJECT_LOCATION = FIREBASE_CONFIG.locationId + '1';

export const MATCH_TIMEOUT_QUEUE_NAME = 'match-timeout-queue';
export const REMOVE_UNMATCHED_USER_FUNCTION_NAME =
  'queues-removeUnmatchedUserAfterTimeout';
export const REMOVE_UNMATCHED_USER_FUNCTION_URL = `https://${PROJECT_LOCATION}-${PROJECT_ID}.cloudfunctions.net/${REMOVE_UNMATCHED_USER_FUNCTION_NAME}`;
export const USER_TIMEOUT_DURING_MATCH = 30;
