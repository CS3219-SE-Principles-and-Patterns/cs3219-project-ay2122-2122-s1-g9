import * as functions from 'firebase-functions';
import { FUNCTION_LOCATION } from './consts/values';
import * as matchingCore from './core/matchingCore';

export const detectMatchesCreateSession = functions
  .region(FUNCTION_LOCATION)
  .database.ref('/queues/{difficulty}')
  .onWrite(async (change, context) => {
    const lvl = context.params.difficulty;
    await matchingCore.processQueue(lvl);
    functions.logger.log(`Completed processing for ${lvl} queue`);
  });
