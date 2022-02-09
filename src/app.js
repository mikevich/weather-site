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
        name: "Bongus"
    });
})

// About page
app.get('/about', (req, res) => {
    res.render('about', {
        title: "Abootus",
        body: "Hoo boy, this page is all abootus.",
        name: "Bongus"
    })
})

// Help page
app.get('/help', (req, res) => {
    res.render('help', {
        title: "Helpus",
        body: "Oh, so you want some helpus?",
        name: "Bongus"
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

        forecast(longitude, latitude, (error, { temp, feelsLike, descrip } = {}) => {
            if (error) {
                return res.send({ error });
            }

            res.send({
                result: `It is ${descrip.toLowerCase()} in ${location}. It is currently ${temp} degrees. It feels like ${feelsLike} degrees outside.`,
                address: req.query.address,
                location,
                temp,
                feelsLike,
                descrip
            })
        });
    });
})

// Test Products page
// app.get('/products', (req, res) => {
//     if (!req.query.search) {
//         return res.send({
//             error: "You must provide a search term."
//         });
//     }

//     console.log(req.query.search);
//     res.send({
//         products: []
//     })
// })

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
app.listen(3000, () => {
    console.log('Server is up on port 3000');
});