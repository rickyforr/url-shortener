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


//Databases
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "rich": {
    id: "rich1",
    email: "rich@rich.com",
    password: "abc"
  },
 "ron": {
    id: "ron1",
    email: "ron@ron.com",
    password: "123"
  }
}


//Routes
app.get("/", (req, res) => {
  res.end("Hello!");
});


//Main Page
app.get("/urls", (req, res) => {             //main page with database
  let templateVars = {
  username: req.cookies["username"],
  urls: urlDatabase,
  users: req.cookies["username"],
  };
  console.log(req.cookies["username"])
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

//Registration
app.get("/register", (req, res) => {             //registration page
  let templateVars = {
  username: req.cookies["username"],
  urls: urlDatabase
  };
  res.render("url_register", templateVars);

});

//Registration Submission and database update
app.post("/register", (req,res) => {
  let userID = crypto.randomBytes(3).toString('hex');
  users.userID = {id: "userID", email: req.body.email,  //assign user random userID and create user object based on email and password input from form
    password: req.body.password}
  res.cookie('username', userID)

  if (!(req.body.email && req.body.password)) {    //Error nothing filled in forms
    res.send("404 no email and/or password provided");
  }
  else {
    res.redirect("/urls");
  }

  for (var password in users.userID) {                  //Error email is already in database
    if (user.userID.password === req.body.email) {
      res.send("404 Email associated with an existing user");
    }
    else {
      res.redirect("/urls");
    }
  }

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




