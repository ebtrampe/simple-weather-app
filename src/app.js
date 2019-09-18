const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
const publicDir = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

// Set express settings for the handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDir))

app.get('', (req, res) => {
	res.render('index', {
		title: 'Weather App',
		name: 'Eileen'
	})
})

app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About Node',
		name: 'Node.js'
	})
})

app.get('/help', (req, res) => {
	res.render('help', {
		title: 'Help Page',
		name: 'NodeJS Foundation'
	})
})

app.get('/weather', (req, res) => {
	if (!req.query.address) {
		return res.send({
			error: 'You must provide an address'
		})
	}
	geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
		if (error) {
			return res.send({ error })
		}
		forecast(latitude, longitude, (error, forecastData) => {
			if (error) {
				return res.send({ error })
			}
			res.send({
				forecast: `${forecastData.summary} It is ${forecastData.temp} degrees out. There is ${forecastData.rain}% chance of rain.`,
				highLow: `High temperature: ${forecastData.tempHigh} degrees, Low temperature: ${forecastData.tempLow}`,
				location,
				address: req.query.address
			})
		})
	})
})

app.get('/products', (req, res) => {
	if (!req.query.search) {
		return res.send({
			error: 'You must provide a search term'
		})
	}
	console.log(req.query.search);
	res.send({
		products: []
	})
})

app.get('/help/*', (req, res) => {
	res.render('404', {
		title: '404',
		name: 'Node.js',
		errorMessage: 'Help article not found'
	})
})

app.get('*', (req, res) => {
	res.render('404', {
		title: '404',
		name: 'Node.js Express',
		errorMessage: 'Page not found'
	})
})

app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
})

