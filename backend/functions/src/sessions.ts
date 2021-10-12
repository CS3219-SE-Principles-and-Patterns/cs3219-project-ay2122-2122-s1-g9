import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';


const initSession = async (sessId: string, qnsId: string) => {	
  const sessPath = admin.database().ref('/sessions').child(sessId);


	// const fakeData = { 'asdf': 'xxx', 123V: 'asf' };
	// const newKey = await sessPath.push(fakeData).key;
	// console.log(newKey);

	// const fakeData2 = { 'asdf2': 'xxx', 1232: 'asf' };
	// const sessPath2 = sessPath.child('randomId');
	// const newKey2 = await sessPath2.set(fakeData2);
	// console.log(newKey2);

	return 'asdfff'
};

export { initSession };
