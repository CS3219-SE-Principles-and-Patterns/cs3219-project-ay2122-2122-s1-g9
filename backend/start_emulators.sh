#!/bin/bash

yarn --cwd functions build --watch | firebase emulators:start --import=./saved-data --export-on-exit

