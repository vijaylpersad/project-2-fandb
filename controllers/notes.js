const express = require('express')
const { route } = require('express/lib/application')
const router = express.Router()
const db = require('../models')
const cryptojs = require('crypto-js')
require('dotenv').config()
const { decryptUserId } = require('../common.js');


/// WRITE GET DELETE POST UPDATE 

router.get('/', async (req,res) =>{
    try {
        const notes = await db.note.findAll({
            where: {
                userId: decryptUserId(req.cookies.userId)
            },
            raw: true,
        })
        console.log(notes)
        res.render("notes/show.ejs", {
          notes: notes
        })
    } catch (e) {
        console.log('err', e)
    } 
})

router.post("/", async (req,res)=>{
    const userId = decryptUserId(req.cookies.userId);
    if (req.cookies.userId) {
        try {
            //const postnote =
                await db.note.create({
                        note: req.body.note,
                        userId: res.locals.user.id
                });
            console.log("posted note", req.body);
            
            res.redirect("/notes");
        } catch (err) {
            console.log("err", err);
        }
    } else {
        res.redirect("users/login")
    }

})

//edit page and update code 
router.get('/edit/:id', async (req,res)=>{
    const userId = decryptUserId(req.cookies.userId);
    try {
        const findnote = await db.note.findOne({
            where: {
                // note: req.body.note,
                // userId: res.locals.user.id,
                id: req.params.id
            }
        })
        console.log(findnote.id)
        res.render('notes/edit.ejs', {findnote})
    }
    catch (err) {
        console.log("err", err)
    }

})

//put route
router.put("/edit/:id", async (req,res) => {
    try {
    const changednote = await db.note.findOne({
        where: {
            id: req.params.id
        }
    })
    changednote.update({
        note: req.body.edit
    })
    await changednote.save()
    res.redirect('/notes')
    } catch (err) {
        console.log('err', err)
    }
})


module.exports = router