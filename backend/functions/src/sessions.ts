import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';
import HeadlessAdapter from './HeadlessAdapter';
import { Firepad, FirebaseAdapter, IFirepadConstructorOptions } from '@hackerrank/firepad';


const initSession = async (sessId: string, qnsId: string) => {
	// (global as any).self = global;

	require('amd-loader');


	const sessRef = admin.database().ref('/sessions').child(sessId);
	const editorRef = sessRef.child('editor');

	const headlessAdapter = new HeadlessAdapter();
	const firebaseAdapter = new FirebaseAdapter(editorRef, 0, '#000000', 'Admin');
	const opts = <IFirepadConstructorOptions> {
		userId: 0,
		userColor: '#000000',
		userName: 'Admin'
	};

	const firepad = new Firepad(firebaseAdapter, headlessAdapter, opts);

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
