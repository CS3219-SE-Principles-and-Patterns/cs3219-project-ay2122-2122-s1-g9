# qns-ingestion

1. Create a `questions` folder in the root directory and dump the leetcode questions in. The leetcode questions should be in the json format and they should contain the attributes stated in the `src/questionTypes.ts` file.
1. Configure the firebase endpoint using `.env`. A sample is provided in `.env.example`.
1. Run `yarn` to install dependencies
1. Run `yarn start` to dump questions into Firestore
