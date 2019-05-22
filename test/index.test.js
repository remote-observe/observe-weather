var axios = require('axios');
var sinon = require('sinon');

var chai = require('chai');
chai.use(require('dirty-chai'));
var expect = chai.expect;

var weather = require('../index.js');

describe('Weather Module', () => {
  describe('#getStatus', () => {
    var config = {
      type: 'weather',
      module: 'observe-weather',
      filePath: 'example-weather-file.txt',
      baseUrl: 'https://api.mockrovor.byu.edu/api/v1/observingconditions',
      deviceNumber: 42,
      clientId: 65535
    };

    var initialExpected = {
      temperature: -1,
      dewPoint: 0,
      windSpeed: 1,
      windDirection: 2,
      windGust: -3.2834679,
      cloudCover: 0.4,
      humidity: 0.05,
      skyBrightness: 0.6561,
      rainRate: 7.93417,
      skyQuality: 8,
      skyTemperature: 9,
      starFwhm: 10,
      pressure: 11
    };
    var expected = initialExpected;

    var axiosStub = sinon.stub(axios, 'get');

    before(() => {
      var mockRespond = (value) => new Promise((resolve, reject) => resolve({
        status: 200,
        statusText: 'OK',
        data: {
          Value: value,
          ClientTransactionID: 0,
          ServerTransactionID: 0,
          ErrorNumber: 0,
          ErrorMessage: ''
        }
      }));

      Object.getOwnPropertyNames(expected).map(prop => {
        axiosStub.withArgs(sinon.match(new RegExp(`${config.baseUrl}/\\d+/${prop.toLowerCase()}?.+`)))
          .returns(mockRespond(expected[prop]));
      });
    });

    after(() => {
      sinon.restore();
    });

    beforeEach(() => {
      axiosStub.resetHistory();
      expected = initialExpected;
    });

    afterEach(() => {
      //
    });

    it('should retreive the correct weather status', async () => {
      let weatherStatus = await weather.getStatus(config);
      // console.log(weatherStatus);
      expect(axios.get.callCount).to.equal(Object.keys(expected).length);
      expect(weatherStatus).to.exist();
      expect(weatherStatus).to.deep.equal(expected);
    });

    it('should have "NaN" value for field where the the call has an error', async () => {
      axiosStub.withArgs(sinon.match(new RegExp(`${config.baseUrl}/\\d+/skybrightness?.+`)))
        .returns(new Promise((resolve, reject) => resolve({
          status: 200,
          statusText: 'OK',
          data: {
            Value: 0,
            ClientTransactionID: 0,
            ServerTransactionID: 0,
            ErrorNumber: 1025,
            ErrorMessage: 'Invalid value'
          }
        })));
      expected.skyBrightness = NaN;

      let weatherStatus = await weather.getStatus(config);
      // console.log(weatherStatus);
      expect(axios.get.callCount).to.equal(Object.keys(expected).length);
      expect(weatherStatus).to.exist();
      expect(weatherStatus).to.deep.equal(expected);
    });

    it('should catch and log error when a 400 response is received', async () => {
      console.log('\t\t(Not yet implemented)');
      // TODO: figure out what a 400 response looks like and how to properly mock it
    });

    it('should catch and log error when a 500 response is received', async () => {
      console.log('\t\t(Not yet implemented)');
      // TODO: figure out what a 500 response looks like and how to properly mock it
    });
  });
});
