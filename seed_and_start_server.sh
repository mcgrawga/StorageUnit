#!/bin/bash

# Seed the db
node seed_data.js > db.json

# Start api and http server
npx json-server db.json --static .
