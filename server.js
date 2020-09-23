const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const db = require('./config/db');
var cors = require('cors')
const app = express();
const port = 8000;
app.use(express.json());
app.use(cors());

MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)
  const dataBase = database.db('DemoBlog');
  require('./app/routes')(app, dataBase);

  app.listen(port, () => {
    console.log('We are live on ' + port);
  });               
})

