#!/usr/bin/env bash

npm install
./node_modules/bower/bin/bower install
npm run build
npm start