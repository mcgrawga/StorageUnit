install npm packages
npm install

seed the db
node seed_data.js > db.json

start api and http server
json-server db.json --static .
