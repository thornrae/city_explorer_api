'use strict';

//Step 1: bring in dependencies
//this allows us to read the .env file
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');


//Step 2: start your application
//you need express, but express can run on its own. you need an instance of express so...
const app = express();
// specify your PORT. process.env.port checks for environment variables which live in our .env file
const PORT = process.env.PORT || 3000;
app.use(cors());


//ROUTES
app.get('/', (request, response) =>{
  //status(200) is a HTTP code there are many of these look them up
  response.status(200).send('sup world');
});
// app.get('/location', locationHandler); lab06 way.
app.get('/location', locationHandler);

app.get('/weather', weatherHandler);

app.use('*', errorHandler);

// Function Handlers
function locationHandler(request, response) {
  let city = request.query.city;
  let key = process.env.GEOCODE_API_KEY;
  const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
  console.log(url);
  //this makes asynch call to our API url
  superagent.get(url)
  // //we get the response back in the form of a promise..
    .then( data => {
      //data gets you the data plus superagents meta data. to just get the location information, less the meta data that comes with a superagent request, we do data.body. Because the data in this request if an array of objects, we access what we want by adding the [0], rerunning node server.js and in this case running localhost:3000/location to see what exactly that is grabbing. This info will appear in the terminal though
      console.log(data.body[0]);
      //create objects based on our constructor. First we get data
      const locationData = data.body[0];
      // then we pass data thru our constructor in a new object called location
      const location = new Location(city, locationData);
      //then you need to sent to front end
      //status 200 means sent successfully
      response.status(200).send(location);

  // // response.send('Welcome to the location route!'); - USE TO TEST ROUTE WORKS, yes.

  // //request data from our data files
  // const location = require('./data/location.json');
  // //respond with the data (show up in browser) - gets data that was input in search field. variable city is whatever was typed in the box 
  // const city = request.query.city;
  // //tailor/normalize data use a constructor
  // const locationData = new Location(city, location);

  // response.send(locationData);
}

function weatherHandler(request, response){
  //console.log the request.body - checkout what keys you are being sent because they will be different from location
  const weatherData = require('./data/weather.json');
  const weatherArr = [];
  weatherData.data.forEach(weather => {
    weatherArr.push(new Weather(weather));
  });
  response.send(weatherArr);
}

// Constructor 
function Location(city, geoData){
  //backend devs base constructor off of what names for data are being used in the frontend. search_querty comes from frontend, city comes from backend. they are corresponding data properties/values.
  this.search_query = city;
  //removed [0] from constructor because index being handled in the app.get TIP handle index numbers in functions rather than constructor, previously had them in the constructor when using flat file
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
}

function Weather (result) {
  this.time = result.datetime;
  this.forecast = result.weather.description;
}

// Make sure listening on the correct PORT takes in PORT you want to listen on and a callback function
app.listen(PORT, () => {
  //this is the callback function
  console.log(`Now listening on port, ${PORT}`);
});

function errorHandler(request, response) {
  response.status(500).send('Sorry, something went wrong');
}

