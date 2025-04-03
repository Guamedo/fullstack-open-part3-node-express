const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("", async (req, res, next) => {
  try {
    const notes = await Note.find({});
    res.json(notes);
  } catch (err) {
    next(err);
  }
});

notesRouter.get("/:id", async (req, res, next) => {
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

notesRouter.post("", async (req, res, next) => {
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

notesRouter.put("/:id", async (req, res, next) => {
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
    res.status(400).send("Invalid note");
  }
});

notesRouter.delete("/:id", async (req, res, next) => {
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

module.exports = notesRouter;
