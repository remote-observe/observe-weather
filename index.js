const axios = require('axios');
let clientTransactionId = 1;

exports.getStatus = async function(config) {
  let weatherProperties = [
    'temperature',
    'dewPoint',
    'windSpeed',
    'windDirection',
    'windGust',
    'cloudCover',
    'humidity',
    'skyBrightness',
    'rainRate',
    'skyQuality',
    'skyTemperature',
    'starFwhm',
    'pressure'
  ];

  return axios.all(weatherProperties.map(prop => getStat(config, prop.toLowerCase())))
    .then((results) => {
      let weather = {};
      results.forEach((result, i) => {
        let weatherProperty = weatherProperties[i];
        if (!result) {
          weather[weatherProperty] = null;
          console.error('\t\tError occurred in "' + weatherProperty.toLowerCase() + '" call to weather equipment');
        } else if (result.data.ErrorNumber !== 0) {
          weather[weatherProperty] = null;
          console.error('\t\tError occurred in "' + weatherProperty.toLowerCase() + '" call to weather equipment: Error ' +
            result.data.ErrorNumber + ' - ' + result.data.ErrorMessage);
        } else {
          weather[weatherProperty] = result.data.Value;
        }
      });
      return weather;
    })
    .catch((error) => {
      console.error(error);
    });
};

function getStat(config, stat) {
  let url = new URL(`${config.baseUrl}/${config.deviceNumber}/${stat}`);
  let searchParams = new URLSearchParams();
  searchParams.append('clienttransactionid', clientTransactionId);
  if (config.clientId) {
    searchParams.append('clientid', config.clientId);
  }
  url.search = searchParams;

  let response = axios.get(url.toString())
    .catch((error) => {
      console.error(error);
      // TODO: Return something more meaningful for logging puropses?
      return null;
    });
  clientTransactionId++;
  return response;
}
