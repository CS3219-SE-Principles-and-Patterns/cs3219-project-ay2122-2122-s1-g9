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
  const client = new CloudTasksClient();
  const parent = client.queuePath(
    PROJECT_ID,
    PROJECT_LOCATION,
    MATCH_TIMEOUT_QUEUE_NAME
  );

  const task: any = {
    httpRequest: {
      httpMethod: 'POST',
      url: REMOVE_UNMATCHED_USER_FUNCTION_URL,
    },
  };

  if (data) {
    task.httpRequest.body = Buffer.from(JSON.stringify(data)).toString(
      'base64'
    );
  }

  // The time when the task is scheduled to be attempted.
  task.scheduleTime = {
    seconds: USER_TIMEOUT_DURING_MATCH + Date.now() / 1000,
  };

  // Send create task request.
  console.log('Sending task:');
  console.log(task);
  const request = { parent: parent, task: task };
  const [response] = await client.createTask(request);
  console.log(`Created task ${response.name}`);
}
