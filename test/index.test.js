var chai = require('chai');
chai.use((chai, utils) => {
  chai.use(require('dirty-chai'));
  let convertFunc = () => {
    expect(Number(this)).to.be.a('number');
  };
  chai.Assertion.addMethod('convertsToNumber', convertFunc);
  chai.Assertion.addMethod('convertToNumber', convertFunc);
});
var expect = chai.expect;

var weather = require('../index.js');
var config = {
  filePath: 'example-weather-file.txt'
};

describe('Weather Module', () => {
  before(() => {
    //
  });

  after(() => {
    //
  });

  beforeEach(() => {
    //
  });

  afterEach(() => {
    //
  });

  describe('#getStatus', () => {
    it('should retreive the weather status with correct fields', async () => {
      let weatherStatus = await weather.getStatus(config);
      expect(weatherStatus).to.exist();
      expect(weatherStatus).to.have.property('temperature').that.convertsToNumber();
      expect(weatherStatus).to.have.property('dewTemperature').that.convertsToNumber();
      expect(weatherStatus).to.have.property('windSpeed').that.convertsToNumber();
      expect(weatherStatus).to.have.property('windDirection').that.convertsToNumber();
      expect(weatherStatus).to.have.property('pressure').that.convertsToNumber();
      expect(weatherStatus).to.have.property('rainFall').that.convertsToNumber();
    });
  });
});
