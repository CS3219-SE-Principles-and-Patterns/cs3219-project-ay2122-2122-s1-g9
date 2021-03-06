import * as functions from 'firebase-functions';
import { CloudTasksClient } from '@google-cloud/tasks';
import {
  MATCH_TIMEOUT_QUEUE_NAME,
  CLOUD_TASK_PROJECT_ID,
  CLOUD_TASK_LOCATION,
  USER_TIMEOUT_DURING_MATCH,
  REMOVE_UNMATCHED_USER_FUNCTION_URL,
} from '../consts/tasks';
import autoId from '../util/autoId';

export async function addUserToTimeoutQueue(
  data: App.userTimeoutDetails
): Promise<any> {
  functions.logger.info('Parameters received: ', data);

  if (!data) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with ' +
        'one argument "userId", the user\'s identifier,' +
        'one argument "queueName", the queue\'s name,'
    );
  }

  const client = new CloudTasksClient();
  const parent = client.queuePath(
    CLOUD_TASK_PROJECT_ID,
    CLOUD_TASK_LOCATION,
    MATCH_TIMEOUT_QUEUE_NAME
  );

  const taskId = autoId();
  const payload = {
    data: {
      ...data,
      taskId,
    },
  };

  const task: any = {
    httpRequest: {
      httpMethod: 'POST',
      url: REMOVE_UNMATCHED_USER_FUNCTION_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      body: Buffer.from(JSON.stringify(payload)).toString('base64'),
    },
    scheduleTime: {
      seconds: USER_TIMEOUT_DURING_MATCH + Date.now() / 1000,
    },
  };

  // The time when the task is scheduled to be attempted.
  // Send create task request.
  functions.logger.info('Sending task:', task);
  const request = { parent: parent, task: task };
  const [response] = await client.createTask(request);
  functions.logger.info(
    `Created task ${response.name} with generated taskId of ${taskId}`
  );
  return {
    id: taskId,
  };
}
