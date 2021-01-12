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
app.get('/yelp', restaurantHandler);
app.get('/movies', movieHandler);
app.use('*', errorHandler);

// FUNCTIONS
function locationHandler(request, response) {

  let city = request.query.city;
  let key = process.env.GEOCODE_API_KEY;
  const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

  let SQL = 'SELECT search_query, latitude, longitude, formatted_query FROM location WHERE search_query =  $1';
  let safeValues = [city];

  client.query(SQL, safeValues)
    .then( results => {
      if(results.rowCount > 0){
        console.log('TALKED TO DATABASE!');
        response.status(200).send(results.rows[0]);
      } else {
        superagent.get(url)
          .then( data => {
            console.log('TALKED TO API!');
            const locationData = data.body[0];
            const location = new Location(city, locationData);
            let SQL = 'INSERT INTO location (search_query, longitude, latitude, formatted_query) VALUES ($1, $2, $3, $4)';

            let safeValues = [location.search_query, location.longitude, location.latitude, location.formatted_query];
    
            client.query(SQL, safeValues)
              .then( () => {
                response.status(200).json(location);
              })
              .catch(error => {
                console.log(error);
              });
          });
      }
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
        response.status(200).json(descriptionData);
      }
      catch(error) {
        console.log(error);
      }
    }
    );
}

function restaurantHandler(request, response){
  let key = process.env.YELP_API_KEY;
  const url = `https://api.yelp.com/v3/businesses/search`;

  const perPage = 5;
  const page = request.query.page || 1;
  const start = ( (page - 1) * perPage + 1);

  //headers
  const queryParams = {
    latitude: request.query.latitude,
    longitude: request.query.longitude,
    limit: perPage,
    offset: start
  };

  // console.log('queryparams>>>', queryParams);
  
  return superagent.get(url)
  //build headers
    .set('Authorization', `Bearer ${key}`)
    .query(queryParams)
    .then( data => {
      const results = data.body;
      // console.log(results);
      const restaurantData = [];
      results.businesses.forEach(value => {
        restaurantData.push(new Restaurant(value));
      });
      console.log(restaurantData);
      // console.log('restaurant data>>>>', restaurantData);
      response.status(200).send(restaurantData);
    });
}

function movieHandler(request, response) {
  let key = process.env.MOVIE_API_KEY;
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${key}`;

  const queryParams = {
    query: request.query.search_query
  };

  return superagent.get(url)
    .set('Authorization', `Bearer ${key}`)
    .query(queryParams)
    .then( data => {
      const movieResults = data.body.results;
      console.log(data.body);
      // console.log('movie results', results);
      const movieData=[];
      movieResults.forEach(value => {
        movieData.push(new Movies(value));
      });
      response.status(200).send(movieData);
    });

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
}

function Restaurant (entry){
  this.name = entry.name;
  this.image_url = entry.image_url;
  this.price = entry.price;
  this.rating = entry.rating;
  this.url - entry.url;
}

function Movies (data) {
  this.title = data.title;
  this.overview = data.overview;
  this.average_votes = data.vote_average;
  this.total_votes = data.vote_count;
  this.image_url = data.poster_path;
  this.popularity = data.popularity;
  this.released_on = data.release_date;
}


client.connect()
  .then( () => {
    app.listen(PORT, () => {
      console.log(`now listening on port ${PORT}`);
      console.log(`connected to database ${client.connectionParameters.database}`);
    });
  });
