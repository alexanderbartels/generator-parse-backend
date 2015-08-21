
/** include chai assertion library **/
var expect = require("chai").expect;
var should = require('chai').should();

describe('Migrator', function () {
  it('should be true', function ()  {
    expect(true).to.equal(true);
    true.should.equal(true);
  });
});
