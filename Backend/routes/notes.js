const express = require('express')
const Notes = require("../models/Notes");
//const user = require("../models/User");
const router = express.Router()
const fetchuser = require('../middleware/fetchUser')
const { body, validationResult } = require("express-validator");

// ROUTE 1: Get all the Notes using : GET "/api/notes/fetchallnotes". Login required

router.get('/fetchallnotes' ,fetchuser,async (req, res)=>{
    try {
        const notes = await Notes.find({user: req.user.id});
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error"); 
    }
})

// ROUTE 2: Add a new Note using : POST "/api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body("title", 'Enter a valid title').isLength({ min: 3 }),
    body("desctiption", 'Fill the desciption in the given block').isLength({ min: 5 })], async (req,res) =>{
   
    
    try {
        const { title, description, tag } = req.body;
       /* //if there are errors return bad  request and errors 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }*/
        const note = new Notes({
            title , description, tag, user: req.user.id
        })
        const savedNote = await note.save()

        res.json(savedNote)
      
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error"); 
    }
})

// ROUTE 3: Find the note to be updated and update it PUT:'/api/notes/updatenote/id'
router.put('/updatenote/:id',fetchuser, async (req,res) =>{
    
        let note = await Notes.findById(req.params.id)
        if(!note){
            return res.status(404).send("Not Found")
        }
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Note Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
        res.json({note});
})

// ROUTE 4: Delete an existing note: DELETE: '/api/notes/deletenote' . Login required
router.delete('/deletenote/:id', fetchuser , async (req,res)=>{
    try {
        let note = await Notes.findById(req.params.id)
        if(!note){
            return res.status(404).send("Not Found")
        }
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Note Allowed");
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({"Success":"NOTE HAS BEEN DELETED",note: note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error"); 
    }
})


module.exports = router