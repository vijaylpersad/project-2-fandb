const express = require('express')
const { route } = require('express/lib/application')
const router = express.Router()
const db = require('../models')
const cryptojs = require('crypto-js')
require('dotenv').config()
const { decryptUserId } = require('../common.js');

router.get('/', async (req, res) => {
    try {
        const favteams = await db.newfavteam.findAll({
            where: {
                userId: decryptUserId(req.cookies.userId)
            },
            raw: true,
        });
        console.log(favteams);
        res.render('users/profile.ejs', {
            favteams: favteams
        })
    } catch (e) {
        console.log('err', e);
    }
})

// POST /projects - create a new project --from jason project organizer
//post new favteam 
router.post("/", async (req, res) => {
    const userId = decryptUserId(req.cookies.userId);
    if (req.cookies.userId) {
        try {
            //first get reference to a favteam
            const [newfavteam] =
                await db.newfavteam.findOrCreate({
                    where: {
                        name: req.body.name,
                        userId //userId: userId
                    }
                });
            console.log("saved new fav team", newfavteam);
            //reference user 
            const foundUser = 
                await db.user.findOne({
                where: {
                    id: userId
                }
                })

            res.redirect("/profile");
        } catch (err) {
            console.log("err", err);
        }
    } else {
        res.redirect("users/login")
    }
});


//delete fav team from profile
router.delete("/", async (req, res) => {
    const userId = decryptUserId(req.cookies.userId);
    //console.log('clicked')
    if (req.cookies.userId) {
        try {
            //first get reference to a favteam
            const deletefavteam =
                await db.newfavteam.findOne({
                    where: {
                        name: req.body.delete,
                        userId //userId: userId
                    }
                });
            console.log("deleted fav team");
           
            await deletefavteam.destroy()
 
            res.redirect("/profile");
        } catch (err) {
            console.log("err", err);
        }
    } else {
        res.redirect("users/login")
    }
});

///// WRITE GET DELETE POST and....update..? dont need get because its at top

// router.post("/", async (req,res)=>{
//     const userId = decryptUserId(req.cookies.userId);
//     if (req.cookies.userId) {
//         try {
//             //first get reference to a favteam
//             const postnote =
//                 await db.note.create({
//                     where: {
//                         note: req.body.note,
//                         userId
//                     }
//                 });
//             console.log("posted note");
            
//             //reference user 
//             const foundUser = 
//                 await db.user.findOne({
//                     where: {
//                         id: userId
//                     }
//                 })
//             res.redirect("/profile");
//         } catch (err) {
//             console.log("err", err);
//         }
//     } else {
//         res.redirect("users/login")
//     }

// })

module.exports = router;