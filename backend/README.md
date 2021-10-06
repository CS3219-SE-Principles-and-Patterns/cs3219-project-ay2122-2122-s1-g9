# backend

This unique folder structure is used to help faciliate emulation and deployment.

Emulators from firebase needed
- auth
- functions
- firestore

## Development
1. `./start_emulators.sh` to start emulators and monitor for changes in the `functions` directory. The ts code will automatically be rebuilt on changes.
2. If you are using VScode, you should just open the `functions` directory for development. VSCode expects a `tsconfig.json` to be in the root directory.
