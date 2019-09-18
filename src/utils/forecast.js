const request = require('request');
// const rp = require('request-promise-native');

const access_key = process.env.DARKSKY_API_KEY

const forecast = (latitude, longitude, callback) => {
	const url = `https://api.darksky.net/forecast/${access_key}/${latitude},${longitude}`
	request({url, json: true}, (error, { body }) => {
		if (error) {
			callback('Unable to connect to weather app', undefined)
		} else if (body.error) {
			callback('Bad coordinates. Please try again',undefined)
		} else {
			callback(undefined, {
				rain: body.currently.precipProbability,
				temp: body.currently.temperature,
				tempHigh: body.daily.data[0].temperatureHigh,
				tempLow: body.daily.data[0].temperatureLow,
				summary: body.daily.data[0].summary,
			})
		}
	})
}

module.exports = forecast

