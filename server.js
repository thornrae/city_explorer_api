'use strict';

//Step 1: bring in dependencies
//this allows us to read the .env file
require('dotenv').config();
const express = require('express');
const cors = require('cors');


//Step 2: set up your application
//need this line or else server wont run I believe button
const app = express();
// create PORT local request PORT 3000 need to create a port your server is going to listen on
const PORT = process.env.PORT;
app.use(cors());


//ROUTES
app.get('/', (request, response) =>{
  response.send('sup world');
});
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.use('*', errorHandler);

// Function Handlers
function locationHandler(request, response) {
  // response.send('Welcome to the location route!'); - USE TO TEST ROUTE WORKS, yes.

  //request data from our data files
  const location = require('./data/location.json');
  //respond with the data (show up in browser) - gets data that was input in search field. variable city is whatever was typed in the box 
  const city = request.query.city;
  //tailor/normalize data use a constructor
  const locationData = new Location(city, location);

  response.send(locationData);
}

function weatherHandler(request, response){
  const weatherData = require('./data/weather.json');
  const weatherArr = [];
  weatherData.data.forEach(weather => {
    weatherArr.push(new Weather(weather));
  });
  response.send(weatherArr);
}

// Constructor 
function Location(city, geoData){
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

function Weather (result) {
  this.time = result.datetime;
  this.forecast = result.weather.description;
}

// Start our server
app.listen(PORT, () => {
  console.log(`Now listening on port, ${PORT}`);
});

function errorHandler(request, response) {
  response.status(500).send('Sorry, something went wrong');
}

