"use strict"
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
//parser
router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// data
let resources = [{
  id: 1,
  name: 'Foo'
}];
// GET
router.get('/',  (req, res) => {
  res.send('Hello World')
});
// resources
router.get('/resources', (req, res) => {
  res.send(resources);
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
  res.send('/resources/' + parseInt(item.id, 10));
});
// PUT
router.put('/resources/:id', (req, res) => {
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
    res.sendStatus(201)
  } else {
    existingItem.name = req.body.name;
    res.sendStatus(204);
  }
});

// DELETE
router.delete('/resources/:id', (req, res) => {
  let id = parseInt(req.body.id, 10);
  let existingItem = resources.filter(r => r.id === id)[0];

  if (!existingItem) {
    return res.sendStatus(404)
  }
  resources = resources.filter(r => r.id !== id);
  res.sendStatus(204)
});

module.exports = router;
