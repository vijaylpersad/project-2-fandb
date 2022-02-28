const express = require('express') // import express
const app = express() // create an express instance
const ejsLayouts = require('express-ejs-layouts') // import ejs layouts
require('dotenv').config() // allows us to access env vars
const cookieParser = require('cookie-parser')
const cryptoJS = require('crypto-js')
const db = require('./models/index.js')

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
app.get('/', function(req, res) {
    //res.send('Hello, backend!');
    res.render('home.ejs')
  });


app.get('/teams', (req,res) {
    res.render('views/teamresults.ejs', {results: gah})
})

app.get('/leagues', (req,res) {
    res.render('views/leagueresults.ejs', {results: gah})
})
  


const config = {
  method: 'get',
  url: 'https://v3.football.api-sports.io/leagues',
  headers: {
    'x-rapidapi-key': `${process.env.FOOTBALL_API_KEY}`,
    'x-rapidapi-host': 'v3.football.api-sports.io'
  }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});



// The app.listen function returns a server handle
const server = app.listen(process.env.PORT || 8000);

// We can export this server to other servers like this
module.exports = server;