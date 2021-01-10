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

client.on('error', err => {
  throw err;
});

//database routes
app.get('/', (request, response) => {
  response.status(200).send('hello world');
});

app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.use('*', errorHandler);

//prob remove this
// app.get('/add', (request, response) => {

//   let city = request.query.city;
//   let lon = request.query.longitude;
//   let lat = request.query.latitude;
//   let formatted = request.formatted_query;
// });


// FUNCTIONS
function locationHandler(request, response) {

  let city = request.query.city;
  let key = process.env.GEOCODE_API_KEY;
  const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

  //TODO: we want to check the database for the location data, if location is not in database, make API call(SQL: SELECT) can do SELECT * rather than having all of them listed
  let SQL = 'SELECT search_query, latitude, longitude, formatted_query FROM location WHERE search_query =  $1';
  let safeValues = [city];

  client.query(SQL, safeValues)
    .then( results => {
      if(results.rowCount > 0){
        console.log('TALKED TO DATABASE!');
        response.status(200).send(results.rows[0]);
      } else {
        superagent.get(url)
        //first reference to data so this is where the data lives that we want to save to the database
          .then( data => {
            console.log('TALKED TO API!')
            // console.log(data.body[0]);
            //value that we want lives inside the body at index 0. data.body is an array which is why we get [0]
            const locationData = data.body[0];
            const location = new Location(city, locationData);
    
            //TODO: we want to save the location data to the database, after retrieving it from teh API. But the data that we save is not from the API, we save the data that we got back from the API and pass thru the constructor
            let SQL = 'INSERT INTO location (search_query, longitude, latitude, formatted_query) VALUES ($1, $2, $3, $4)';
    
            //safeValues need to reflect the properties of location object
            let safeValues = [location.search_query, location.longitude, location.latitude, location.formatted_query];
    
            client.query(SQL, safeValues)
              .then( () => {
                // console.log('result.rows>>>', results.rows);
                response.status(200).json(location);
              })
              .catch(error => {
                console.log(error);
              });
            // response.status(200).send(location);
          });
      }
    });
}

// console.log(url);
 


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
        // console.log(descriptionData);
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

  // console.log();
}

client.connect()
  .then( () => {
    app.listen(PORT, () => {
      console.log(`now listening on port ${PORT}`);
      console.log(`connected to database ${client.connectionParameters.database}`);
    });
  });
