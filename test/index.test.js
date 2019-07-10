const axios = require('axios');
const sinon = require('sinon');

const chai = require('chai');
chai.use(require('dirty-chai'));
const expect = chai.expect;

const weather = require('../index.js');

describe('Weather Module', () => {
  describe('#getStatus', () => {
    let config;
    let expected;
    let axiosStub;
    let logSpy;

    let mockRespond = (value, errorNumber = 0, errorMessage = '') =>
      Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {
          Value: value,
          ClientTransactionID: 0,
          ServerTransactionID: 0,
          ErrorNumber: errorNumber,
          ErrorMessage: errorMessage
        }
      });

    let mockError = (status, statusText, message) => {
      let error = new Error();
      error.response = {
        status: status,
        statusText: statusText,
        data: message
      }
      return Promise.reject(error);
    };

    before(() => {
       axiosStub = sinon.stub(axios, 'get');
       logSpy = sinon.spy(console.log);
    });

    after(() => {
      sinon.restore();
    });

    beforeEach(() => {
      axiosStub.resetHistory();
      expected = {
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
      config = {
        type: 'weather',
        module: 'observe-weather',
        filePath: 'example-weather-file.txt',
        baseUrl: 'https://api.mockrovor.byu.edu/api/v1/observingconditions',
        deviceNumber: 42,
        clientId: 65535
      }
      Object.getOwnPropertyNames(expected).map(prop => {
        axiosStub.withArgs(sinon.match(new RegExp(`${config.baseUrl}/\\d+/${prop.toLowerCase()}.*`)))
          .returns(mockRespond(expected[prop]));
      });
    });

    afterEach(() => {
      //
    });

    it('should retreive the correct weather status', async () => {
      let weatherStatus = await weather.getStatus(config);

      expect(axios.get.callCount).to.equal(Object.keys(expected).length);
      expect(weatherStatus).to.exist();
      expect(weatherStatus).to.deep.equal(expected);
    });

    it('should retreive the correct weather status when missing optional search params', async () => {
      config.clientId = null;

      let weatherStatus = await weather.getStatus(config);

      expect(axios.get.callCount).to.equal(Object.keys(expected).length);
      expect(weatherStatus).to.exist();
      expect(weatherStatus).to.deep.equal(expected);
    });

    it('should have null value for field where the the call has an error', async () => {
      axiosStub.withArgs(sinon.match(new RegExp(`${config.baseUrl}/\\d+/skybrightness.*`)))
        .returns(mockRespond(0, 1025, 'Invalid value'));
      expected.skyBrightness = null;

      let weatherStatus = await weather.getStatus(config);

      expect(axios.get.callCount).to.equal(Object.keys(expected).length);
      expect(weatherStatus).to.exist();
      expect(weatherStatus).to.deep.equal(expected);
    });

    it('should catch and log error when a 400 response is received', async () => {
      let errorMessage = 'MockException: you did something incorrect. at someFunction(Class someArg) in <someFile>:line 4';
      axiosStub.withArgs(sinon.match(new RegExp(`${config.baseUrl}/\\d+/cloudcover.*`)))
        .returns(mockError(400, 'Bad Request', errorMessage));
      expected.cloudCover = null;

      let weatherStatus = await weather.getStatus(config);

      expect(axios.get.callCount).to.equal(Object.keys(expected).length);
      expect(weatherStatus).to.exist();
      expect(weatherStatus).to.deep.equal(expected);
      expect(logSpy.calledWithMatch(errorMessage));
    });

    it('should catch and log error when a 500 response is received', async () => {
      console.log('\t\t(Not yet implemented)');
      // TODO: figure out what a 500 response looks like and how to properly mock it
      let errorMessage = 'MockException: we did something incorrect. at someFunction(Class someArg) in <someFile>:line 5';
      axiosStub.withArgs(sinon.match(new RegExp(`${config.baseUrl}/\\d+/dewpoint.*`)))
        .returns(mockError(500, 'Internal Server Error', errorMessage));
      expected.dewPoint = null;

      let weatherStatus = await weather.getStatus(config);

      expect(axios.get.callCount).to.equal(Object.keys(expected).length);
      expect(weatherStatus).to.exist();
      expect(weatherStatus).to.deep.equal(expected);
      expect(logSpy.calledWithMatch(errorMessage));
    });
  });
});
