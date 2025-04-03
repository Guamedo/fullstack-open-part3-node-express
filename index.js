const express = require("express");
const app = express();

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

const generateId = () => {
  const maxId = notes.reduce((acc, val) => Math.max(acc, Number(val.id)), 0);
  return String(maxId + 1);
};

// parse application/json
app.use(express.json());

app.use(express.static("dist"));

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const note = notes.find((note) => note.id === id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.post("/api/notes", (req, res) => {
  const data = req.body;
  data.important = data.important ?? false;
  if (data && "content" in data) {
    const newNote = {
      ...req.body,
      id: generateId(),
    };
    notes.push(newNote);

    res.json(newNote);
  } else {
    res.status(400).send("Invalid arguments");
  }
});

app.put("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;

  let updateNote = notes.find((note) => note.id === id);

  if (data && "important" in data && "content" in data && updateNote) {
    updateNote.content = data.content;
    updateNote.important = data.important;
    res.json(updateNote);
  } else {
    res.status(404).send(`Note with id ${id} not found in the DB`);
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;

  const deleteNoteIndex = notes.findIndex((note) => note.id === id);

  if (deleteNoteIndex >= 0) {
    notes.splice(deleteNoteIndex, 1);

    res.send(`Note with id ${id} has been removed from the DB`);
  } else {
    res.status(404).send(`Note with id ${id} not found in the DB`);
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});
