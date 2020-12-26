'use strict';

//Step 1: bring in dependencies
//this allows us to read the .env file
require('dotenv').config();
const express = require('express');
const cors = require('cors');


//Step 2: set up your application
const app = express();
// create PORT local request PORT 3000 need to create a port your server is going to listen on
const PORT = process.env.PORT;
app.use(cors());

//Step 3: Routes
app.get('/', (request, response) =>{
  response.send('sup world');
});

//location route
app.get('/location', locationHandler);
//catch all route to display 404 error message/shows that server does exist but this specific route DNE
app.use('*', (request, response)=>{
  response.send('404: This page does not exist');
});


// Function Handlers
function locationHandler(request, response) {
  // response.send('Welcome to the location route!'); - USE TO TEST ROUTE WORKS, yes.

  //this function will do two things:
  //request data from our data files
  //tailor/normalize data use a constructor
  //respond with the data (show up in browser)
  const location = require('./data/location.json');
  const city = request.query.city;
  const locationData = new Location(city, location);

  response.send(locationData);
    
}

// Constructor 
function Location(city, geoData){
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

// Start our server
app.listen(PORT, () => {
  console.log(`Now listening on port, ${PORT}`);
});



