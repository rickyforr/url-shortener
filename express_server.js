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

  let ID = [req.cookies["userID"]]
  let newID = ID[0]
  let stID = users[newID]
  let templateVars = {
  userID: req.cookies["userID"],
  urls: urlDatabase,
  users: stID
  };
  console.log(req.cookies["userID"]);
  console.log(users);
  console.log(users[newID])


  res.render("urls_index", templateVars);

});

//Create
app.get("/urls/new", (req, res) => {  //sends user to form to enter new long url to shorten
  let templateVars = {
  userID: req.cookies["userID"],
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

//Login GET
app.get("/login", (req, res) => {
  let templateVars = {
  userID: req.cookies["userID"],
  urls: urlDatabase,

  };
  res.render("urls_login", templateVars);

});

//Login POST
app.post("/login", (req, res) => {
  let user;
  for (let userID in users) {
   if (users[userID].email === req.body.email) {
    user = users[userID]
    break;
   }
  }
  if (user) {
    if (user.password === req.body.password){
    let userID = crypto.randomBytes(3).toString('hex');
    res.cookie("userID", userID)
    res.redirect("/urls");
    return;
    }
  }
  res.status(401).send('email or password incorrect')





  console.log(req.body.email);



let templateVars = {
  usernID: req.cookies["userID"],
  urls: urlDatabase,
  };
});

//Logout
app.get("/logout", (req, res) => {
  res.clearCookie("userID");

  res.redirect("/urls");

});

//Registration(registration page)
app.get("/register", (req, res) => {
   let templateVars = {
  userID: req.cookies["userID"],
  urls: urlDatabase,
  users: users
  };
  res.render("url_register", templateVars);

});

//Registration Submission and database update
app.post("/register", (req,res) => {
  let userID = (crypto.randomBytes(3).toString('hex'));

 //assign user random userID and create user object based on email and password input from form
  users[userID] = {id: userID, email: req.body.email, password: req.body.password}
  console.log(users.userID);

  res.cookie('userID', userID)



//Error email is already in database or nothing filled in forms
  // for (var password in users.userID) {
  //   if (users.userID.password === req.body.email) {
  //     res.send("404 Email associated with an existing user");
  //   }
  //   else if (!(req.body.email && req.body.password)) {
  //   res.send("404 no email and/or password provided");
  //   }
  //   else {
      res.redirect("/urls");
  //   }
  // }

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




