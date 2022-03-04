const express = require('express')
const { route } = require('express/lib/application')
const router = express.Router()
const db = require('../models')
const bcrypt = require('bcrypt')
const cryptojs = require('crypto-js')
require('dotenv').config()

//from docs
//In a findOrCreate, a callback will return back an array, instead of a single object. The array parameter syntax shown below is the sequelize 5 syntax that mimics the old .spread() operator
// db.favteam.findOrCreate({
//     where: {
//       name: '',
    
//     },
//     defaults: { age: 88 }
//   }).then(([favteam, wasCreated])=>{
//     console.log(favteam); // returns info about the user

///   this line is hwere you could append some child to userfav
//     process.exit()
//      could  redirect here to profile res.redirect
//   });


//will be a recreation of new user creation logic below:

// router.get('/new', (req,res)=>{
//     res.render('users/new.ejs')
// })

// router.post('/', async (req,res)=>{
//     const [newUser, created] = await db.user.findOrCreate({  //returns two values --if item searched is real u get that plus a boolean true or false
//         where: {email: req.body.email}
//     })
//     if(!created) { // if user already existts aka wasnt created 
//         console.log('user already exists')
//         //render the Log in Page with appropriate message ie acct already exists 
//     } else {
//         const hashedPassword = bcrypt.hashSync(req.body.password, 10)   
//         newUser.password = hashedPassword
//         await newUser.save()


//         //encrpyt user id via AES advanced encrpy standard  -- use pckge crpto js 
//         const encryptedUserId = cryptojs.AES.encrypt(newUser.id.toString(), process.env.SECRET)
//         const encryptedUserIdString = encryptedUserId.toString()
//         console.log(encryptedUserIdString)
//         //store encrypted id in the cookie of the res obj 
//         res.cookie('userId', encryptedUserIdString)
//         //redircet to home page
//         res.redirect('/')
//     }
// })