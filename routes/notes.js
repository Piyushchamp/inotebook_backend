const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/userfetch");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");


// Get all notes '/api/notes/createuser' . No login required.
router.get("/fetchallnodes", fetchuser, async (req, res) => {
  try {

    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("SOme error occured");
  }
});


// Add notes '/api/notes/addnotes' . No login required.
router.post(
  "/addnotes",
  fetchuser,
  [
    body("title").isLength({ min: 5 }),
    body("description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {

      const { title, description, tag } = req.body;
      // If there are errors return bad request and error.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);

    } catch (error) {
      console.error(error.message);
      res.status(500).send("SOme error occured");
    }
  }
);


// Update notes '/api/notes/updatenotes' . No login required.
router.put("/updatenotes/:id", fetchuser, 
  async (req, res) => {
    const { title, description, tag } = req.body;
    try {
    //   Create a new note
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    // Find the note and update it
    let note = await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")};

    if(note.user.toString() !== req.user.id){
      {return res.status(401).send("Not Allowed")};
    }

    note = await Notes.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true});
    res.json({note});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("SOme error occured");
    }
  }
)


// Delte notes '/api/notes/deletenotes' . No login required.
router.delete("/deletenotes/:id", fetchuser, 
  async (req, res) => {
    // const { title, description, tag } = req.body;
    try {
    // Find the note and delete it
    let note = await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")};

    if(note.user.toString() !== req.user.id){
      {return res.status(401).send("Not Allowed")};
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({"Success": "Note has been delete", note:note});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("SOme error occured");
    }
  }
)

module.exports = router;
