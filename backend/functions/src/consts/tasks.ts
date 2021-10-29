// https://cloud.google.com/functions/docs/configuring/env-var#nodejs_10_and_subsequent_runtimes
export const PROJECT_ID = process.env['GCP_PROJECT'] || '';
export const PROJECT_LOCATION = process.env['FUNCTION_REGION'] || '';

export const MATCH_TIMEOUT_QUEUE_NAME = 'match-timeout-queue';
export const REMOVE_UNMATCHED_USER_FUNCTION_NAME =
  'removeUnmatchedUserAfterTimeout';
export const REMOVE_UNMATCHED_USER_FUNCTION_URL = `https://${PROJECT_LOCATION}-${PROJECT_ID}.cloudfunctions.net/${REMOVE_UNMATCHED_USER_FUNCTION_NAME}`;
export const USER_TIMEOUT_DURING_MATCH = 30;
