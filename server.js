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
  response.send('hello world');
});

//catch all route to display 404 error message/DNE
app.use('*', (request, response)=>{
  response.send('404 This page does not exist');
});

// Start our server
app.listen(PORT, () => {
  console.log(`Now listening on port, ${PORT}`);
});





