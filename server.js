const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

// const bodyParser = require('body-parser');

// setup webserver
const app = express();
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on: localhost:${server.address().port}`);
});
app.use(express.static('public'));
app.use(cors());
// app.use(bodyParser.json());

// setup database
// Security note: the database is saved to the file `db.json` on the local filesystem.
// It's deliberately placed in the `.data` directory which doesn't get copied if someone remixes the project.
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('.data/db.json');
const db = low(adapter);

// set default data
db.defaults({}).write();

// get complete database
app.get("/--state", function (request, response) {
  response.json(db.getState());
});

// clear messages
app.get("/--clear", function (request, response) {
  db.setState({}).write();
  response.sendStatus(200);
});

// clear messages from one channel
app.get("/*/clear", function (request, response) {
  let channel = request.path.slice(1, -6);

  console.log("clear channel", channel);

  if (db.has(channel).value()) {
    db.get(channel).remove().write();
  }

  response.sendStatus(200);
});

// delete message from one channel
app.get("/*/delete", function (request, response) {
  let channel = request.path.slice(1, -7);

  console.log("delete message from channel " + channel);
  console.log(request.query);

  if (db.has(channel).value()) {
    let msg = db.get(channel).filter(request.query).value();
    console.log("found message to delete:");
    console.log(msg);

    db.get(channel).remove(request.query).write();
  }
  
  response.sendStatus(200);
});

// get messages
app.get("/*", function (request, response) {
  // console.log("get messages")
  // console.log(request.path)
  console.log(request.query)

  let channel = request.path.slice(1);
  // console.log(db.get(channel));

  if (db.has(channel).value()) {
    let result = db.get(channel).value();

    if (request.query.since) {
      let since = parseInt(request.query.since);
      result = result.filter((el) => el.timestamp > since);

    } else if (Object.keys(request.query).length > 0) {
      result = db.get(channel).filter(request.query).value();
    }

    response.json(result);
  } else {
    response.json([]);
  }

});

// creates a new entry in the messages collection with the submitted values
app.post("/*", function (request, response) {
  console.log("post message")
  console.log(request.path)
  console.log(request.query);

  let channel = request.path.slice(1);

  // if this channel is not defined, add an empty array
  if (!db.has(channel).value()) {
    db.set(channel, []).write();
  }

  if (!request.query.timestamp) {
    request.query.timestamp = Date.now();
  }

  if (!request.query.id) {
    request.query.id = nanoid();
  }

  db.get(channel)
    .push(request.query)
    .write();

  // console.log("New message inserted");
  response.sendStatus(200);
});
