# frontend

This is the frontend repo for PeerPrep. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup

### Environment

1. Copy the `.env.example` file and rename it to `.env`

2. Update the variables in the `.env` file with the relevant Firebase keys. Set REACT_APP_USE_EMULATOR to true or false depending on which instance you wish to connect to.

Note: The `.env` file has been handed over to our project mentor Sahil for use in the front-end project

### Code Dependencies

Run `yarn install` to install dependencies

## Development

1. Run the app in development mode

```
yarn start
```

2. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Creating a production build

Run `yarn build` to build the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.
