import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const detectMatchCreateSession = functions.database
  .ref('/queues/{difficulty}')
  .onCreate((snap, context) => {
    const queueName = context.params.difficulty;
    let queue = snap.val();
    console.log(queue);

    // queue should not be empty
    if (queue == null) {
      return;
    }

    // queue should only have 2 people in it
    if (queue.length != 2) {
      console.log(`queue ${queueName} does not have exactly 2 people`);
      return;
    }

    let sessionPath = admin.database().ref('/sessions');
    let userPath = admin.database().ref('/users');
    let queuePath = admin.database().ref('/queues');

    // First we create a session
    const session = {
      users: [...queue],
      time: Date.now(),
    };
    const sessionId = sessionPath.push(session).key;
    // then we add the session to the user's message queue
    const notification = {
      type: 'FOUND_SESSION',
      session_id: sessionId,
    };
    userPath.child(queue[0]).push(notification);
    userPath.child(queue[1]).push(notification);

    // Empty the queue
    queuePath.child(queueName).remove();

    return;
  });
