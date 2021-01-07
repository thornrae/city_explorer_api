-- create table here

DROP TABLE IF EXISTS location;

CREATE TABLE location (
  id SERIAL PRIMARY KEY,
  city VARCHAR(255), 
  lon NUMERIC(10,7),
  lat NUMERIC(10,7),
  formatted VARCHAR (255)
);

