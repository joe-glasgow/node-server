"use strict"
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
let url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  db.close();
});

//parser
router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
router.use(cors());
// data
let resources = [{
  id: 1,
  name: 'Foo'
}];
// GET
router.get('/',  (req, res) => {
  return res.send('Hello World')
});
// resources
router.get('/resources', (req, res) => {
  return res.send(resources);
});
// resource
router.get('/resources/:id', (req, res) => {
  let id = parseInt(req.params.id, 10);
  let result = resources.filter(r => r.id === id)[0];
  // results
  if(!result) {
    return res.sendStatus(404);
  } else {
    res.send(result);
  }
});
// POST
router.post('/resources', (req, res) => {
  let item = req.body;
  //send status
  if (!item.id) {
    return res.sendStatus(500);
  }
  // saved as a string, id must be int
  item.id = parseInt(item.id, 10);
  // add id
  resources.push(item);
  // send the response of new resource
  return res.send('/resources/' + parseInt(item.id, 10));
});
// PUT
router.put('/resources', (req, res) => {
  // we have an id to put
  if (req.body.id) {
    // get id from request
    let id = parseInt(req.body.id, 10);
    // find existing id in resources
    let existingItem = resources.filter(r => r.id === id)[0];
    // if it doesn't exist
    if(!existingItem) {
      let item = req.body;
      item.id = id;
      resources.push(item);
      res.setHeader('Location', '/resources/' + id);
      return res.sendStatus(201)
    } else {
      existingItem.name = req.body.name;
      return res.sendStatus(204);
    }
  } else {
    // ID not found
    return res.sendStatus(400);
  }
});
// DELETE
router.delete('/resources', (req, res) => {
  // we have an id to delete
  if (req.body.id) {
    let id = parseInt(req.body.id, 10);
    let existingItem = resources.filter(r => r.id === id)[0];

    if (!existingItem) {
      return res.sendStatus(404)
    }
    resources = resources.filter(r => r.id !== id);
    return res.sendStatus(204)
  } else {
    // ID not found
    return res.sendStatus(400);
  }

});

module.exports = router;
