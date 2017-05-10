//modules and dependancies
var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
app.set("view engine", "ejs")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


//data
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {

}


//requests and response
app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls", (req, res) => {

  var templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars);

});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get(`/urls/:id`, (req, res) => {
   let templateVars = { shortURL: req.params.id };
console.log(req.path)
  res.send("urls_show");
});



app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




