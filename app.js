var express = require("express");
var data = require("./db.json");
var path = require("path");
var fs = require("fs");

var PORT = process.env.PORT || 3000;
var app = express();

app
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(express.static("lib"));

var notes = [];

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./lib/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./lib/notes.html"));
});

app.get("/api/notes", function (req, res) {
  let json = getJson();
  res.json(json);
});

const id = () => {
  return Math.floor(Math.random() * 200);
};

app.post("/api/notes", function (req, res) {
  const data = fs.readFileSync("./db.json", "utf8");
  notes = JSON.parse(data);
  var newNote = req.body;
  newNote.id = id();
  notes.push(newNote);
  res.json(newNote);
  const json = JSON.stringify(notes);
  fs.writeFileSync("db.json", json, "utf8");
});

app.delete("/api/notes/:id", function (req, res) {
  notes = fs.readFileSync("./db.json", "utf-8");
  notes = JSON.parse(notes);
  const deletedNote = req.params.id;
  notes = notes.filter((note) => {
    return note.id != deletedNote;
  });

  const permaNotes = JSON.stringify(notes);

  fs.writeFileSync("./db.json", permaNotes, "utf8", (err) => {
    if (err) throw err;
  });
  res.json(permaNotes);
});

function getJson() {
  let data = fs.readFileSync(__dirname + "/db.json");
  let json = JSON.parse(data);
  return json;
}
