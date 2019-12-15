# Sold Price Map

## Kanban board

There is very basic [trello board](https://trello.com/b/VeZIvw5h/landtech-technical-challenge) outlining how the task was broken down and outstanding work left to do.

## Running the tests

To run the tests install the dependencies by running `npm install`, then run `npm test`

### CI

Circle ci builds and runs the tests on every commit, you can see the build history [here](https://circleci.com/gh/willm/sold-price-map)

## Running the application locally

The application was developed on mac os, node js v12.13.1, the client uses python2 to host the contents of the output directory, however this should be bundled on most systems. 

I have not tried to run this on windows.

The application is made up of a node js server that acts as an api to get the price and location data, and an html 5 canvas front end.

To start the api server, run `npm start`

To build and host the front end locally, in a seperate terminal window, run `npm run start-client`

You can then go to http://localhost:8000 where you should see the properties displayed in 5 colours according to their relative prices.

### Running against different data

By default, the application runs against the supplied sample data, however it *should* work with any data set formatted in the same way. You can change this by setting the `PROPERTY_DATA` environment variable to the path to your data file before starting the api server.

## Api documentation

The api is documented according to the [open api specification](https://swagger.io/specification/) in `./open-api-schema.yml` you can view it in its rendered form by importing it (File - Import File) in the [swagger editor](https://editor.swagger.io)