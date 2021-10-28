import * as functions from 'firebase-functions';
import { CloudTasksClient } from '@google-cloud/tasks';
import {
  MATCH_TIMEOUT_QUEUE_NAME,
  PROJECT_ID,
  PROJECT_LOCATION,
  USER_TIMEOUT_DURING_MATCH,
  REMOVE_UNMATCHED_USER_FUNCTION_URL,
} from '../consts/values';

export async function addUserToTimeoutQueue(
  data: App.userTimeoutDetails
): Promise<any> {
  if (!data) {
    return;
  }

  const client = new CloudTasksClient();
  const parent = client.queuePath(
    PROJECT_ID,
    PROJECT_LOCATION,
    MATCH_TIMEOUT_QUEUE_NAME
  );
  const payload = {
    data: data,
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
  functions.logger.info(`Created task ${response.name}`);
}
