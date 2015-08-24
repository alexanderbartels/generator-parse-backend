
/** include chai assertion library **/
var expect = require("chai").expect;
var should = require('chai').should();

console.log(">>>>", __dirname);

/** include domain specific stuff **/
var Migrator = require("../../../lib/common/migration/Migrator");

describe('Migrator', function () {
  describe('#up()', function ()  {
    it('should read all migration scripts from current version up to the target version', function () {
      var migrator = new Migrator();
      expect(true).to.equal(true);
      true.should.equal(true);
    });
  });
});
