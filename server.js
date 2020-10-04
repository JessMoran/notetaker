// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");
const { v4: uuidv4 } = require('uuid');

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8082;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); 

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});


app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.post("/api/notes", function(req, res) {
  let note = (req.body)
  let id = uuidv4(); 
  note.id = id
  let notesArray;
  let savedNotes = fs.readFileSync("./db/db.json","utf-8");
  notesArray = JSON.parse(savedNotes);
  notesArray.push(note);
  
  fs.writeFile("./db/db.json", JSON.stringify(notesArray), function(error){
    if (error) {
      console.log("error",error);
    }
      return res.json(notesArray); 
  });
});

app.get("/api/notes", function(res) {
  fs.readFile("./db/db.json", "utf-8", function(error, data){
    if (error) {
      return console.log(error);
    }
    return res.json(JSON.parse(data));
  });

});

app.delete("/api/notes/:id", function(req, res){
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let noteId = req.params.id;
  console.log(`Deleting note with ID ${noteId}`);
  savedNotes = savedNotes.filter(currNote => {
      return currNote.id != noteId;
    })

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
