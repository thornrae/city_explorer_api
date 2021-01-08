'use strict';

//DEPENDENCES
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');


//START APPLICATION
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
const client = new pg.Client(process.env.DATABASE_URL);

//what is this doing?
client.on('error', err => {
  throw err;
});

//database routes
app.get('/', (request, response) => {
  response.status(200).send('hello world');
});

app.get('/add', (request, response) => {
  //this console log gets you an empty object - simulate properties by appending the /add in the browser ?q=TAYLOR (q is potatoe) ==> injects your own query, simulates typing in seattle and clicking explore
  // console.log(request.query);
  let city = request.query.city;
  let lon = request.query.longitude;
  let lat = request.query.latitude;
  let formatted = request.formatted_query;


  let SQL = 'INSERT INTO location (city, lon, lat) VALUES ($1, $2, $3, $4) RETURNING *'; // refs columns

  //creates parametrized queries to prevents SQL injection maps to $1 $2 $3
  let safeValues = [city, lon, lat, formatted];

  //now can make request itself no semi colon because working w promised
  client.query(SQL, safeValues)
  //use .then bc promises - to return to us results from that query
    .then( results => {
      response.status(200).json(results);
    })
    .catch(error => {
      console.log(error);
    });



});

//start database
client.connect()
  .then( () => {
    app.listen(PORT, () => {
      console.log(`now listening on port ${PORT}`);
      console.log(`connected to database ${client.connectionParameters.database}`);
    });
  });


//ROUTES
//lab07
// app.get('/', (request, response) =>{
//   response.status(200).send('sup world');
// });
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.use('*', errorHandler);

// FUNCTIONS
function locationHandler(request, response) {

  let city = request.query.city;
  let key = process.env.GEOCODE_API_KEY;
  const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

  // console.log(url);
  superagent.get(url)
    .then( data => {
      console.log(data.body[0]);
      const locationData = data.body[0];
      const location = new Location(city, locationData);
      response.status(200).send(location);
    });
}

function weatherHandler(request, response){
  let key = process.env.WEATHER_API_KEY;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${request.query.latitude}&lon=${request.query.longitude}&key=${key}`;

  let descriptionData;

  return superagent.get(url)
    .then( data => {
      try{
        descriptionData = data.body.data.map(weatherData => {
          return new Weather(weatherData);
        });
        console.log(descriptionData);
        response.status(200).json(descriptionData);
      }
      catch(error) {
        console.log(error);
      }
    }
    );
}

function errorHandler(request, response) {
  response.status(500).send('Sorry, something went wrong');
}

// CONSTRUCTORS
function Location(city, geoData){
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
}

function Weather (result) {
  this.time = new Date(result.datetime).toDateString();
  this.forecast = result.weather.description;

  console.log();
}


// app.listen(PORT, () => {
//   console.log(`Now listening on port, ${PORT}`);
// });



