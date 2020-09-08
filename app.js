const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

require('dotenv').config();

const app = express();

const WeatherAPI = process.env.APIKEY;
console.log(WeatherAPI);

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res) {
  const query = req.body.cityName;
  const units = "imperial";

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial&appid=" + WeatherAPI + "&units=" + units;

  https.get(url, function(response) {
    console.log(response);

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;

      const iconUrl = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png"

      res.write("<p>The weather is currently " + weatherDescription + ".<p>");
      res.write("<p><h1>The temp in " + req.body.cityName + " is " + temp + " degrees F.</h1><p>");
      res.write("<img src=" + iconUrl + ">");

      res.send();
    })
  })
})

app.listen(3000, function() {
  console.log("Server is running on port 3000.");
})
