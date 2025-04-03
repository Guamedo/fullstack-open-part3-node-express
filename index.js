require("dotenv").config();
const express = require("express");
const app = express();
const Note = require("./models/note");

// parse application/json
app.use(express.json());
app.use(express.static("dist"));

app.get("/api/notes", async (req, res, next) => {
  try {
    const notes = await Note.find({});
    res.json(notes);
  } catch (err) {
    next(err);
  }
});

app.get("/api/notes/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const note = await Note.findById(id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
});

app.post("/api/notes", async (req, res, next) => {
  const data = req.body;

  const newNote = new Note({
    content: data.content,
    important: data.important ?? false,
  });

  try {
    const savedNote = await newNote.save();
    res.json(savedNote);
  } catch (err) {
    next(err);
  }
});

app.put("/api/notes/:id", async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;

  if (data && "important" in data && "content" in data) {
    try {
      const note = await Note.findById(id);
      if (note) {
        try {
          const updatedNote = await Note.findByIdAndUpdate(
            id,
            {
              content: data.content,
              important: data.important,
            },
            { returnDocument: "after" }
          );
          res.json(updatedNote);
        } catch (err) {
          next(err);
        }
      } else {
        res.send(`Note with id ${id} not found in the DB`);
      }
    } catch (err) {
      next(err);
    }
  } else {
    res.status(400).send(`Invalid note`);
  }
});

app.delete("/api/notes/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    const note = await Note.findById(id);

    if (note) {
      try {
        const deletedNote = await Note.findByIdAndDelete(id);
        res.json(deletedNote);
      } catch (err) {
        next(err);
      }
    } else {
      res.status(404).send(`Note with id ${id} not found in the DB`);
    }
  } catch (err) {
    next(err);
  }
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(500).send({ error: "malformatted id" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).send({ error: err.message });
  }

  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});
