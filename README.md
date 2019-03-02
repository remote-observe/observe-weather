# observe-weather
A plugin for remote-observer that interfaces with a weather station


This controller parses a weather file of the format:

```
temperature=64
dewTemperature=42
windSpeed=7.345
windDirection=284.0425
pressure=29.96
rainFall=0.000
```

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
      filePath: '/an/absolute/observe-weather/example-weather-file.txt',
    }
  ]
}
```

# Deploy a new version

1. Execute `npm version patch` - preferrable a patch or minor relea
2. Execute `git push origin master --tags`
3. Execute `npm publish`
4. Withing the remote-observe web client, initiate a reload
