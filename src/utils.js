const rp = require('request-promise-native');

const mapbox_access_key = process.env.MAPBOX_API_KEY;
const darksky_access_key = process.env.DARKSKY_API_KEY;

exports.getCoordinates = async (req, res, next) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        });
    }
    try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${req.query.address}.json?access_token=${mapbox_access_key}&limit=1`;
        const data = await rp({ url, json: true });
        req.latitude = data.features[0].center[1];
        req.longitude = data.features[0].center[0];
        req.location = data.features[0].place_name;
        next();
    } catch (e) {
        console.log(e);
        return res.send({
            error: 'Address not found. Please try again.'
        });
    }
};

exports.getForecast = async (req, res, next) => {
    try {
        const url = `https://api.darksky.net/forecast/${darksky_access_key}/${req.latitude},${req.longitude}`;
        const body = await rp({ url, json: true });
        res.send({
            forecast: `${body.daily.data[0].summary} It is currently ${body.currently.temperature} degrees out. There is a ${body.currently.precipProbability}% chance of rain.`,
            highLow: `High temperature: ${body.daily.data[0].temperatureHigh}, Low temperature: ${body.daily.data[0].temperatureLow}`,
            location: req.location
        });
    } catch (e) {
        console.log(e);
        return res.send({
            error: 'Unable to fetch forecast data. Please try again.'
        });
    }
};
