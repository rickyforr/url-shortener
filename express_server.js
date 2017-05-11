//modules and dependancies
var express = require("express");
var app = express();
var crypto = require("crypto");
var PORT = process.env.PORT || 8080; // default port 8080
app.set("view engine", "ejs")
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')


//Middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())


//data
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



//Routes
app.get("/", (req, res) => {
  res.end("Hello!");
});


//Main Page
app.get("/urls", (req, res) => {             //main page with database
  let templateVars = {
  username: req.cookies["username"],
  urls: urlDatabase
  };
  res.render("urls_index", templateVars);

});

//Create
app.get("/urls/new", (req, res) => {  //sends user to form to enter new long url to shorten
  let templateVars = {
  username: req.cookies["username"],
  urls: urlDatabase
  };
  res.render("urls_new", templateVars);
});

//Take user to long URL if short URL is given
app.get('/u/:shortURL', (req, res) => {  //if short url is put in browser take user to correspoding longUrl
  let longURL = urlDatabase[req.params.shortURL];
  console.log(longURL);
  res.redirect(longURL);
});


//Retrieve Single URL for update
app.get("/urls/:id", (req, res) => {
  let singleUrl = urlDatabase[req.params.id];
  console.log(singleUrl);
  res.render("url_show", {shortLong:singleUrl, short:req.params.id});
});

//Create
app.post("/urls", (req, res) => {
  let shortURL = crypto.randomBytes(3).toString('hex');   // generate 6digit random string asign to shortUrl
  urlDatabase[shortURL] = req.body.longURL                // add shortUrl : longUrl(submitted in form) to urlDatabase
  console.log(req.body);                                  // debug statement to see POST parameters
  res.redirect("/urls");                                  // Redirect user to main page
});

//Update
app.post("/urls/:id", (req, res) => {
  let singleUrl = urlDatabase[req.params.id];
  urlDatabase[req.body.shortURL]= urlDatabase[req.params.id]
  console.log(urlDatabase[req.body.shortURL])
  res.redirect("/urls");
});

//Login
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username)
  console.log(res.cookie)
  let templateVars = {
  username: req.cookies["username"],
  urls: urlDatabase
};
  res.redirect("/urls");

});

//Logout
app.get("/logout", (req, res) => {
  res.clearCookie("username");

  res.redirect("/urls");

});


//Delete URL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//Listen
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




