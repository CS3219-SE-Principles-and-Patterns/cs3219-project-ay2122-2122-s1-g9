#!/bin/bash

yarn --cwd functions build --watch | firebase emulators:start
