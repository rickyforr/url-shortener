//modules and dependancies
var express = require("express");
var app = express();
var crypto = require("crypto");
var PORT = process.env.PORT || 8080; // default port 8080
const bcrypt = require('bcryptjs');
var cookieSession = require('cookie-session')
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')


//Middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))


//Databases
var urlDatabase = {
  "rich": {"b2xVn2": "http://www.lighthouselabs.ca", "userID": "rich"},
  "ron": {"9sm5xK": "http://www.google.com", "userID": "ron" },
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
//----------------------------------------
//Home
app.get("/", (req, res) => {
 if (req.session.user_id === undefined) {
 res.redirect("/login")

} else {
  res.redirect("/urls"); }
});


//Main Page with short and long urls displayed for logged in users
app.get("/urls", (req, res) => {
  console.log(users);
  let ID = req.session.user_id;

  let templateVars = {
  userID: req.session.user_id,
  urls: urlDatabase[ID],
  users: users[ID]
  };




//Delete old short url/long url pair if a new one has been made
  for (var keys in urlDatabase[ID]) {
    if (urlDatabase[ID][keys] === req.body.longURL ) {
      delete urlDatabase[ID][keys];
    }
  }

res.render("urls_index", templateVars);



});

//Create GET - takes user to page where they can enter a new long url to shorten
app.get("/urls/new", (req, res) => {

  let ID = req.session.user_id;
  let templateVars = {
  userID: req.session.user_id,
  urls: urlDatabase[ID],
  users: users[ID]
  };

//If user is not logged in redirect to login page
  if (req.session.user_id === undefined) {
   res.redirect("/login")

   } else {
   res.render("urls_new", templateVars);
  }
});

//REDIRECT USER TO LONG URL
app.get('/u/:shortURL', (req, res) => {

  let short = req.params.shortURL
  let longURL;
   console.log(short)
   console.log(urlDatabase)

  for (var i in urlDatabase) {
    console.log(urlDatabase[i][short])
    if (urlDatabase[i][short]) {
      let longURL = urlDatabase[i][short]
      res.redirect(longURL)
    }
  }
  if (!urlDatabase[i][short]) {
    res.status(404).send('url not found.')
  }

});


//RETRIEVE A SINGLE URL FOR UPDATE
app.get("/urls/:id", (req, res) => {
  let shortUrl = req.params.id;
  let userId = req.session.user_id

  let templateVars = {
  userID: req.session.user_id,
  urls: urlDatabase[userId],
  short: req.params.id,
  users: users[userId]
  };
  console.log(shortUrl)
  console.log(userId)

//if user is logged in allow them to update links in their database otherwise send error message
  if (!userId) {
        res.status(401).send("You need to be logged in to view this page. <a href='/login'>Login</a>");
  } else {
      if (!urlDatabase[userId] || !urlDatabase[userId][shortUrl]) {
        res.status(401).send("You do not own this short url!");
      } else {

    res.render("url_show", templateVars);
      }
  }
});

//Update POST. update an existing shor:long url pair in the database
app.post("/urls/:id", (req, res) => {

 let ID = req.session.user_id
 let short = req.params.id
 let newShort = req.body.shortURL
 let long = urlDatabase[ID][short]
console.log(urlDatabase[ID][short])
 for (var key in urlDatabase[ID]) {
  if (key === short){
     urlDatabase[ID][newShort] = long
     delete urlDatabase[ID][short];
 }
}


  res.redirect("/urls");
});

//Create POST. Creates a new shortened url.
app.post("/urls", (req, res) => {

  // generate 6digit random string asign to shortUrl
  let shortURL = crypto.randomBytes(3).toString('hex');
  createID = req.session.user_id

  // add shortUrl : longUrl(submitted in form) pair to urlDatabase. if user is new create a new object within the database with the userID as well
  if (urlDatabase[createID]) {
      urlDatabase[createID][shortURL] = req.body.longURL
  } else {
     urlDatabase[createID] = {[shortURL]: req.body.longURL, userID: req.session_id}
  }
  // Redirect user to main page
  res.redirect("/urls");
});



//Login GET. Render login page.
app.get("/login", (req, res) => {
  let templateVars = {
  userID: req.session.user_id,
  urls: urlDatabase,

  };
  res.render("urls_login", templateVars);

});


//Logout. Clear cookies.
app.get("/logout", (req, res) => {
  req.session = null
  res.redirect("/urls");

});

//Login POST
app.post("/login", (req, res) => {
 let userID;

for (var i in users) {
  if (users[i].email === req.body.email) {
  userID = i
  break;
  }
}
console.log(userID)
//if password hashed matches hashed password in the database give a cookie and redirect to /urls
 if (userID) {

  if (bcrypt.compareSync(req.body.password, users[userID].password)) {

  req.session.user_id = userID
  res.redirect("/urls");
  return;
 }


}
res.status(401).send('wrong email or password')



});


//Registration GET. Take user to registration page.
app.get("/register", (req, res) => {
   let templateVars = {
  userID: req.session.user_id,
  urls: urlDatabase,
  users: users
  };
  res.render("url_register", templateVars);

});

//Registration POST. User enters email and password. user database is updated and user is redirected to /urls
app.post("/register", (req,res) => {

  for (var name in users) {
    if (users[name].email === req.body.email) {
      res.send("404 email belongs to a user")
    }
  }
//Error if email is already in database or nothing filled in forms
  if (!(req.body.email && req.body.password)) {
    res.send("404 no email and/or password provided");
    } else {
        req.session.user_id = crypto.randomBytes(3).toString('hex');
        let userID =  req.session.user_id
        users[userID] = {id: userID, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10)}

        res.redirect("/urls");
      }
});


//Delete URL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.session.user_id][req.params.shortURL];
  res.redirect("/urls");
});

//Listen
app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});




