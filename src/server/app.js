var path = require("path");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("../../dist"));
let projectData = {};
app.get("/", function (req, res) {
  res.sendStatus(200).sendFile(path.resolve("dist/index.html"));
});
app.get("/getCredentials", function (req, res) {
  const credential = {
    geoUser: process.env.geo_Username,
    weatherKey: process.env.weatherAPIKey,
    pixabayKey: process.env.pixabayAPIKey
  }
  console.log(credential);
  res.send(credential);
});
// Post Route
app.post('/add', addPost);
function addPost(req, res) {
  projectData = req.body;
  res.status(200).send();
}
app.get("/allData", function (req, res) {
  res.send(projectData);
});
//server setup
const port = 5000;
const server = app.listen(port, listening);

function listening() {
  console.log(`running on localhost: ${port}`);
};
module.exports = app;
