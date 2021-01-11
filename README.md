# city_explorer_api

**Author**: Taylor Thornton
**Version**: 1.0.0 (increment the patch/fix version number if you make more commits past your first submission)
## Overview
Lab06 for City Explorer uses two flat JSON files and, when connected to the front end website, uses a constructor to create location objects which are also used to determine the city's upcoming weather descriptions. 

## Getting Started
Necessary for this project is the use of constructors to pass thru and covert information to be connected to the front end.

## Architecture
Node.js, JavaScript, Express, Cors, VSCode, GitHub

## Change Log
12-28-2020 --> App has functioning express server and objects creataed from flat JSON files


## Credits and Collaborations
<!-- Give credit (and a link) to other people or resources that helped you build this application. -->

Number and name of feature: Locations
Estimate of time needed to complete: 1 hour
Start time: 2:00
Finish time: 4:00
Actual time needed to complete: 2 hours

Number and name of feature: Weather
Estimate of time needed to complete: 1 hour
Start time: 4:00
Finish time: 6:00
Actual time needed to complete: 2 hours

Number and name of feature: Error
Estimate of time needed to complete: 2 hours
Start time: 7:00
Finish time: 8:00
Actual time needed to complete: 1 hours

-->
<!-- ----------------------------------------------------- -->
## Overview
Lab07 for City Explorer uses two API's to return weather information for a specific location submitted by a user. 

## Getting Started
Necessary for this project is requesting API keys, identifying needed information from the API request, handling that data and passing through a constructor to ultimately render the data to the front end.

## Architecture
Node.js, JavaScript, Express, VSCode, GitHub, SuperAgent, Heroku

## Change Log
01-04-2021 --> App has weather and location functionality using GET routes and API keys 

## Credits and Collaborations
Brai (TA) helped with the superagent requests to get the weather information to render to the frontend.  It was showing up as object in the console but not rendering.  She helped with the use of try and catch superagent requests. TA Chance put me in the right direction to normalize weather/date data using the Date constructor.
-->

Number and name of feature: Locations API Key
Estimate of time needed to complete: 2 hours
Start time: 3:00
Finish time: 5:00
Actual time needed to complete: 1 hours

Number and name of feature: Weather API Key
Estimate of time needed to complete: 2 hours
Start time: 4:00
Finish time: 6:00
Actual time needed to complete: 2 hours

Number and name of feature: Data Formatting
Estimate of time needed to complete: 2 hours
Start time: 6:00
Finish time: 7:00
Actual time needed to complete: 1 hours

<!-- ------------------------------------------------ -->

## Overview
Lab08 for City Explorer uses two API's to return weather information for a specific location submitted by a user. But also stores location data using POSTGRES in a database to reduce request/response time. 

## Getting Started
Necessary for this project is, in addition to using API keys, incorporating SQl statements to create a database and table which stores location information after it is requested once and for future searches, checks to see if location data is stored in a database first before making the request to the location API

## Architecture
Node.js, JavaScript, Express, POSTGRES, SQL, VSCode, GitHub, SuperAgent, Heroku 

## Change Log
01-09-2021 --> SQL database created. Stores location information in table after first API request.  If an additional request for the same location is made, the application checks to see if that information is stored in the database first before making an API request.

## Credits and Collaborations

Number and name of feature: Database
Estimate of time needed to complete: 2 hours
Start time: 1:00
Finish time: 3:00
Actual time needed to complete: 2 hours

Number and name of feature: Server
Estimate of time needed to complete: 2 hours
Start time: 3:00
Finish time: 5:00
Actual time needed to complete: 2 hours

Number and name of feature: Deploy
Estimate of time needed to complete: 30 minutes
Start time: 5:00
Finish time: 6:30
Actual time needed to complete: STILL NOT COMPLETE. Running into problems with Heroku deployment.  Will seek assistance.


