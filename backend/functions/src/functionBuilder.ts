import * as functions from 'firebase-functions';
import { FUNCTION_LOCATION } from './consts/values';

const functionBuilder = functions.region(FUNCTION_LOCATION).runWith({
  timeoutSeconds: 180,
  minInstances: 1,
});

export default functionBuilder;
