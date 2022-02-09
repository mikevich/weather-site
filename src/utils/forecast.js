const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=503636f2106431083dc31b48e39cb795&query=${longitude},${latitude}`

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather services.');
        } else if (body.error) {
            callback(body.error.info);
        } else {
            const { temperature:temp, feelslike:feelsLike, wind_speed, wind_dir } = body.current;
            const descrip = body.current.weather_descriptions[0];

            callback(null, {
                temp,
                feelsLike,
                descrip,
                wind_speed,
                wind_dir
            });
        }
    })
}

module.exports = forecast;