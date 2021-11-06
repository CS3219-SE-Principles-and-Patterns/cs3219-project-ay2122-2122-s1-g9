// https://firebase.google.com/docs/functions/config-env
const FIREBASE_CONFIG = JSON.parse(process.env['FIREBASE_CONFIG']);

export const PROJECT_ID = FIREBASE_CONFIG.projectId;
export const STORAGE_BUCKET = FIREBASE_CONFIG.storageBucket;
export const DATABASE_URL = FIREBASE_CONFIG.databaseURL;
