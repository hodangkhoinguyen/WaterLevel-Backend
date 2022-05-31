// index.js
// This is our main server file

// include express
const express = require("express");
// create object to interface with express
const app = express();
const bodyParser = require('body-parser');
const fetch = require("cross-fetch");

// Code in this section sets up an express pipeline

app.use(express.json());

app.use(bodyParser.text());
// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})

// No static server or /public because this server
// is only for AJAX requests
app.post("/query/getLake", async function(req, res, next) {
  console.log(req.body);
  let month = 1, year = 2022;
  let water = await lookupWaterData(month, year);
  res.json(water);
});

// respond to all AJAX querires with this message
app.use(function(req, res, next) {
  res.json({msg: "No such AJAX request"});
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});

async function lookupWaterData(month, year) {
  const api_url =  `https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA,ORO,CLE,NML,SNL,DNP,BER&SensorNums=15&dur_code=M&Start=${year}-${month}&End=${year}-${month}`;
  // send it off
  let fetchResponse = await fetch(api_url);
  let data = await fetchResponse.json()
  return data;
}