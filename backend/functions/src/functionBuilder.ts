import * as functions from 'firebase-functions';
import { FUNCTION_LOCATION } from './consts/values';

// Set back to its default value
const minInstances = functions.config()?.peerprep?.mininstances ?? undefined;

const functionBuilder = functions.region(FUNCTION_LOCATION).runWith({
  timeoutSeconds: 180,
  minInstances,
});

export default functionBuilder;
