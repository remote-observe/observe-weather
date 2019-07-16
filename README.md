# observe-weather
A plugin for remote-observer that interfaces with a weather station


This controller calls the Alpaca API of the weather device and returns a status object in this format:

```
{
  temperature: -1,        // in degrees Celsius
  dewPoint: 0,            // in degrees Celsius
  windSpeed: 1,           // in m/s
  windDirection: 2,       // in degrees eastward from north (360 for north, 0 for no wind)
  windGust: -3.2834679,   // peak 3 second wind gust over the last 2 minutes in m/s
  cloudCover: .4,         // as a percentage
  humidity: .05,          // as a percentage
  skyBrightness: .6561,   // in lux
  rainRate: 7.93417,      // in mm/hr
  skyQuality: 8,          // in magnitudes per square arcsecond
  skyTemperature: 9,      // in degrees Celsius
  starFwhm: 10,           // seeing in arcseconds
  pressure: 11            // in hPa at the observatory's altitude (not sea level)
}
```

If for the controller can't retrieve any of the weather metrics for any reason, it will give the metric a null value.

# Setup
Inside the observe-client config, add the controller:

```js
module.exports = {
  firebase: {
    // ...
  },
  controllers: [
    {
      type: 'weather',
      package: 'observe-weather',
      filePath: '/an/absolute/observe-weather/index.js',
      baseUrl: 'https://url.to.observatory.weather/api/v1/observingconditions',
      deviceNumber: 42,
      clientId: 65535
    }
  ]
}
```

# Deploy a new version

1. Execute `npm version patch` - preferrable a patch or minor relea
2. Execute `git push origin master --tags`
3. Execute `npm publish`
4. Withing the remote-observe web client, initiate a reload
