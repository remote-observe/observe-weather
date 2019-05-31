const axios = require('axios');
var clientTransactionId = 1;

exports.getStatus = async function(config) {
  let weather = {
    temperature: null,
    dewPoint: null,
    windSpeed: null,
    windDirection: null,
    windGust: null,
    cloudCover: null,
    humidity: null,
    skyBrightness: null,
    rainRate: null,
    skyQuality: null,
    skyTemperature: null,
    starFwhm: null,
    pressure: null
  };

  let weatherProperties = Object.getOwnPropertyNames(weather);
  await axios.all(weatherProperties.map(prop => getStat(config, prop.toLowerCase())))
    .then((results) => {
      for (let i = 0; i < results.length; i++) {
        let weatherProperty = weatherProperties[i];
        let result = results[i];
        if (result.data.ErrorNumber === 0) {
          weather[weatherProperty] = result.data.Value;
        } else {
          console.error('\t\tError occurred in "' + weatherProperty.toLowerCase() + '" call to weather equipment: Error ' +
            result.data.ErrorNumber + ' - ' + result.data.ErrorMessage);
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  return weather;
};

function getStat(config, stat) {
  let url = new URL(`${config.baseUrl}/${config.deviceNumber}/${stat}`);
  let searchParams = new URLSearchParams();
  searchParams.append('clienttransactionid', clientTransactionId);
  if (config.clientId) {
    searchParams.append('clientid', config.clientId);
  }
  url.search = searchParams;

  let response = axios.get(url.toString());
  clientTransactionId++;
  return response;
}
