// Cannot use FUNCTIONS_EMULATOR env var because it does not exist when running tests through emulator
export const RUNNING_IN_EMULATOR = 'FIRESTORE_EMULATOR_HOST' in process.env;

export const LVL_EASY = 'easy';
export const LVL_MEDIUM = 'medium';
export const LVL_HARD = 'hard';
export const ALL_LVLS = Object.freeze([LVL_EASY, LVL_MEDIUM, LVL_HARD]);

export const SESS_STATUS_STARTED = 'started';
export const SESS_STATUS_ENDED = 'ended';

export const SUCCESS_RESP = { success: true };
