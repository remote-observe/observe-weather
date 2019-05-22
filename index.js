const axios = require('axios');
var clientTransactionId = 1;

exports.getStatus = async function(config) {
  let weather = {
    temperature: NaN,
    dewPoint: NaN,
    windSpeed: NaN,
    windDirection: NaN,
    windGust: NaN,
    cloudCover: NaN,
    humidity: NaN,
    skyBrightness: NaN,
    rainRate: NaN,
    skyQuality: NaN,
    skyTemperature: NaN,
    starFwhm: NaN,
    pressure: NaN
  };

  let weatherProperties = Object.getOwnPropertyNames(weather);
  await axios.all(weatherProperties.map(prop => getStat(config, prop.toLowerCase())))
    .then((results) => {
      for (let i = 0; i < results.length; i++) {
        if (results[i].data.ErrorNumber === 0) {
          weather[weatherProperties[i]] = results[i].data.Value;
        } else {
          console.error('\t\tError occurred in call to weather equipment: Error ' +
            results[i].data.ErrorNumber + ' - ' + results[i].data.ErrorMessage);
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  return weather;
};

function getStat(config, stat) {
  let url = `${config.baseUrl}/${config.deviceNumber}/${stat}?clientid=${config.clientId}&clienttransactionid=${clientTransactionId}`;
  let response = axios.get(url);
  clientTransactionId++;
  return response;
}
