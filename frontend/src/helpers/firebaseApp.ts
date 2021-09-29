import { initializeApp } from '@firebase/app';

import firebaseOptions from '../consts/firebaseOptions';

const app = initializeApp(firebaseOptions);

export default app;
