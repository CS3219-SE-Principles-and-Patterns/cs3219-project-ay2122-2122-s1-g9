# backend

This unique folder structure helps to faciliate emulation and deployment. `node_modules` will live in the `functions` folder. This directory will contain Firebase specific configuration files like the settings for Firestore and RTDB. When we deploy, we deploy the `backend` folder. `firebase` CLI will automatically know how to deploy the settings for the services and the functions at one go.

Emulators from firebase needed
- auth
- functions
- firestore
- database

All commands given below should be executed from the `backend` directory unless otherwise stated.

## Setup
Firebase project and the `firebase` CLI should be setup first as most of the steps below are dependent on them.

### Firebase
1. Create a new Firebase project. It needs to be on the Blaze Plan.
1. Enable Authentication, Firestore Database and Realtime Database on the left side of the project page.
1. Go to Authentication -> Sign-in method -> Enable Google and Facebook as sign-in providers. Add the url that the frontend is hosted to the Authorized domains too.
1. Change the `default` field in `.firebaserc` to the new project name

### Firebase CLI
1. `yarn global add firebase-tools`
1. `firebase login` and follow the instructions to login to the Google account that the Firebase project is hosted on

### Code
1. We are using node v14 for the functions code. You can control the node version of your machine using a tool like [nvm](https://github.com/nvm-sh/nvm). Make sure that your `node` version is v14 before continuing.
1. `cd functions && yarn`
1. Node v14 have to be used when developing or testing the backend.

Once the setup is done, you should return to the backend folder.

### Github
1. `firebase login:ci` to get the CI token
1. Add `FIREBASE_CI_TOKEN: {retrieved CI token}` as a secret to Github Actions. This is needed for continuous deployment.

## Development
1. `./start_emulators.sh` to start emulators and monitor for changes in the `functions` directory. The `ts` code will automatically be rebuilt on changes.
1. If you are using VScode, you should open the `functions` directory for development. VSCode expects a `tsconfig.json` to be in the root directory.

## Testing
1. Do `firebase emulators:exec "yarn --cwd functions test"` to run tests for functions. Emulators will be started and the tests will be run against the emulator.

## Deployment
1. Ensure that you are logged in to Firebase on `firebase` CLI. Make sure that `.firebaserc` file is pointing to the correct project.
1. `firebase deploy -f`. The `-f` deletes old functions that does not exist in the deployed codebase without asking for confirmation.
