const express = require('express') // import express
const app = express() // create an express instance
const ejsLayouts = require('express-ejs-layouts') // import ejs layouts
require('dotenv').config() // allows us to access env vars
const cookieParser = require('cookie-parser')
const cryptoJS = require('crypto-js')
const axios = require('axios')
const db = require('./models')
const methodOverride = require('method-override');

// MIDDLEWARE
app.set('view engine', 'ejs') // set the view engine to ejs
app.use(ejsLayouts) // tell express we want to use layouts
app.use(cookieParser()) //gives us acces to req.cookies
app.use(express.urlencoded({extended: false})) // body parser to make req.body work
app.use(methodOverride('_method'));

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
app.use('/profile', require('./controllers/favorites.js'))
//app.use('/notes', require('./controllers/notes.js'))
app.use('/notes', require('./controllers/notes.js'))




// Routes
app.get('/', (req, res)=>{
    //res.send('Hello, backend!');
    res.render('home.ejs')
});


//GET request --use query strings -- req.query
app.get('/teams', (req,res)=>{
    
    const config = {
        method: 'GET',
        url: `https://v3.football.api-sports.io/teams?name=${req.query.teamSearch}`, //standings?team=33&season=2021
        headers: {
          'x-rapidapi-key': `${process.env.FOOTBALL_API_KEY2}`,
          'x-rapidapi-host': 'v3.football.api-sports.io'
        }
    }
  
    axios(config)
    .then(function (apiResults) {
      //console.log(response.data)   // works to see movie details in console 
      //res.render('results.ejs')
      console.log(apiResults)
      const searchResults = apiResults.data.response[0].team
      //(apiResults.response[0].team)
      //console.log(searchResults)
      //const myObj = JSON.parse(searchResults)
      //res.render('teams/teamresults.ejs') //Object.entries returns an array. ejs templates will print contents of array
        //res.send(searchResults)
 
      res.render('teams/teamresults.ejs', {results: searchResults})
    })
    .catch(function (error) {
        console.log("team error", error);
      })
  });
  


// Get all Standings from one {league} & {season}
// get("https://v3.football.api-sports.io/standings?league=39&season=2019");
//GET request --use query strings -- req.query
app.get(`/teams/standings`, (req,res)=>{
    
  const config = {
      method: 'GET',
      url: `https://v3.football.api-sports.io/standings?team=${req.query.teamid}&season=2021`, //standings?team=33&season=2021 ${req.query.teamid} // needs work 
      //create hidden form in teamresults to insert team id^
      headers: {
        'x-rapidapi-key': `${process.env.FOOTBALL_API_KEY2}`,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
  }


  axios(config)
  .then(function (apiResults) {
    const searchResults = apiResults.data.response

    //console.log(searchResults)
    res.render('teams/standings.ejs', {results: searchResults})
  })
  .catch(function (error) {
      console.log(error);
    })
});

// The app.listen function returns a server handle
const server = app.listen(process.env.PORT || 8000);

// We can export this server to other servers like this
module.exports = server;