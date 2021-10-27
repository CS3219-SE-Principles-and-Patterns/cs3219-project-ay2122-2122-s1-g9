import * as functions from 'firebase-functions';
import * as matchingCore from './core/matchingCore';

export const detectMatchesCreateSession = functions.database
  .ref('/queues/{difficulty}')
  .onWrite(async (change, context) => {
    const lvl = context.params.difficulty;
    await matchingCore.processQueue(lvl);
    functions.logger.log(`Completed processing for ${lvl} queue`);
  });
