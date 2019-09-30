const path = require('path');
const express = require('express');
const hbs = require('hbs');

const utils = require('./utils');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for express config
const publicDir = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Set express settings for the handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDir));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Eileen'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Node',
        name: 'Still Eileen'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        name: 'Yours truly'
    });
});

app.get('/weather', utils.getCoordinates, utils.getForecast);

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Node.js',
        errorMessage: 'Help article not found'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Node.js Express',
        errorMessage: 'Page not found'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
