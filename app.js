"use strict";
const app = require('express')();
const resources = require('./routes/resources');

app.use('/', resources);

const server = app.listen('3000', () => {
  let host = server.address().address;
  host = (host == '::' ? 'localhost' : host);
  const port = server.address().port;
  // log it
  console.log('listening at http://%s:%s', host, port);
});
