// Require modules
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const request = require('request');

// Require util code
const geoCode = require('./utils/geocode');
const forecast = require('./utils/forecast');

// Set up express app
const app = express();
const port = process.env.PORT || 3000;

// Define paths
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Set up handlebars
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Set up static directory
app.use(express.static(publicDirectoryPath));

// Index page
app.get('', (req, res) => {
    res.render('index', {
        title: "Weatherboy",
        name: "Mike V"
    });
})

// About page
app.get('/about', (req, res) => {
    res.render('about', {
        title: "About",
        body: "A simple app designed to get the weather at a given location.",
        name: "Mike V"
    })
})

// Help page
app.get('/help', (req, res) => {
    res.render('help', {
        title: "Help",
        body: "Enter any city name into the input box on the homepage.",
        name: "Mike V"
    })
})

// Weather JSON page
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "You must enter a location."
        })
    }

    geoCode(req.query.address, (error, { longitude, latitude, location } = {}) => {
        if (error) {
            return res.send({ error });
        }

        forecast(longitude, latitude, (error, { temp, feelsLike, descrip, wind_speed, wind_dir } = {}) => {
            if (error) {
                return res.send({ error });
            }

            res.send({
                result: `It is ${descrip.toLowerCase()} in ${location}. It is currently ${temp} degrees. It feels like ${feelsLike} degrees outside. The wind is traveling ${wind_dir} at ${wind_speed} km/h.`,
                address: req.query.address,
                location,
                temp,
                feelsLike,
                descrip,
                wind_speed,
                wind_dir
            })
        });
    });
})

// Help 404s
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        body: "Ya 404'd on a help page.",
        name: "Bongus"
    })
})

// General 404s
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        body: "Ya 404'd.",
        name: "Bongus"
    })
})

// Set up web server
app.listen(port, () => {
    console.log('Server is up on port ' + port);
});