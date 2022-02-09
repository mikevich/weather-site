const request = require('request');

const geoCode = (searchTerm, callback) => {

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchTerm)}.json?access_token=pk.eyJ1IjoibWlrZXZpY2giLCJhIjoiY2t6ZGpvY29iMDZpeDMxb2J2OHBtaDN1diJ9.tgo-hB7Exa_Camf-pww6MQ&limit=1`;

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to geocode service.');
        } else if (body.message) {
            callback(body.message);
        } else if (body.features.length === 0) {
            callback("No results.");
        } else {
            
            const longitude = body.features[0].center[0];
            const latitude = body.features[0].center[1];
            const { place_name:location } = body.features[0];

            callback(null, {
                longitude,
                latitude,
                location
            });
        }
    })
}

module.exports = geoCode;