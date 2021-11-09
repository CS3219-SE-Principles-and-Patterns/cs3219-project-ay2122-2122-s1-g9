import * as functions from 'firebase-functions';
import * as matchingCore from './core/matchingCore';

import functionBuilder from './functionBuilder';

export const detectMatchesCreateSession = functionBuilder.database
  .ref('/queues/{difficulty}')
  .onWrite(async (change, context) => {
    const lvl = context.params.difficulty;
    const queueState = change.after.val() as string[];
    await matchingCore.processQueue(queueState, lvl);
    functions.logger.log(`Completed processing for ${lvl} queue`);
  });
