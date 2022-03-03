const express = require('express') // import express
const app = express() // create an express instance
const ejsLayouts = require('express-ejs-layouts') // import ejs layouts
require('dotenv').config() // allows us to access env vars
const cookieParser = require('cookie-parser')
const cryptoJS = require('crypto-js')
const axios = require('axios')
const db = require('./models')

// MIDDLEWARE
app.set('view engine', 'ejs') // set the view engine to ejs
app.use(ejsLayouts) // tell express we want to use layouts
app.use(cookieParser()) //gives us acces to req.cookies
app.use(express.urlencoded({extended: false})) // body parser to make req.body work

//custom login middleware
app.use(async (req, res, next)=>{
    if(req.cookies.userId){
    const decryptedId = cryptoJS.AES.decrypt(req.cookies.userId, process.env.SECRET) //decrypt incoming user id from cookie
    const decryptedIdString = decryptedId.toString(cryptoJS.enc.Utf8) //convert decrytid to readable string
    const user = await db.user.findByPk(decryptedIdString) //query database for user with that id 
    res.locals.user = user  //this makes user universally available in views files... res.locals.taco ... taco used in ejs
    } else res.locals.user = null
    next() //move on to next piece of middleware
})

//controllers middleware
app.use('/users', require('./controllers/users.js'))




// Routes
app.get('/', (req, res)=>{
    //res.send('Hello, backend!');
    res.render('home.ejs')
  });



//GET request --use query strings -- req.query
app.get('/leagues', (req,res)=>{
    
    const config = {
        method: 'get',
        url: `https://v3.football.api-sports.io/leagues?search=${req.query.leagueSearch}`,
        headers: {
          'x-rapidapi-key': `${process.env.FOOTBALL_API_KEY}`,
          'x-rapidapi-host': 'v3.football.api-sports.io'
        }
    }
  
    axios(config)
    .then(function (response) {
      //console.log(response.data)   // works to see movie details in console 
      //res.render('results.ejs')
  
      const searchResults = JSON.stringify(response.data.response)
      //res.render('teams/teamresults.ejs') //Object.entries returns an array. ejs templates will print contents of array
        //console.log(searchResults)
        res.render('leagues/leagueresults.ejs', {results: searchResults})
    })
    .catch(function (error) {
        console.log(error);
      })
  });


//GET request --use query strings -- req.query
app.get('/teams', (req,res)=>{
    
    const config = {
        method: 'GET',
        url: `https://v3.football.api-sports.io/teams?name=${req.query.teamSearch}`,
        headers: {
          'x-rapidapi-key': `${process.env.FOOTBALL_API_KEY}`,
          'x-rapidapi-host': 'v3.football.api-sports.io'
        }
    }
  
    axios(config)
    .then(function (apiResults) {
      //console.log(response.data)   // works to see movie details in console 
      //res.render('results.ejs')
  
      const searchResults = JSON.stringify(apiResults.data.response[0].team)
      //res.render('teams/teamresults.ejs') //Object.entries returns an array. ejs templates will print contents of array
        //res.send(searchResults)
        res.render('teams/teamresults.ejs', {results: searchResults})
    })
    .catch(function (error) {
        console.log(error);
      })
  });
  

app.get('/profile', (req,res)=>{
    res.render('profile.ejs', {userFavTeams: x, userFavLeagues: y})
})


// The app.listen function returns a server handle
const server = app.listen(process.env.PORT || 8000);

// We can export this server to other servers like this
module.exports = server;