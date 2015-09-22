
/** include chai assertion library **/
var expect = require("chai").expect;
var should = require('chai').should();

/** include domain specific stuff **/
var Migrator = require("../../../lib/common/migration/Migrator");
var Migrations = require("../../../lib/common/migration/Migrations");
var Migration  = require("../../../lib/common/migration/Migration").Migration;
var MigrationFactory = require("../../../lib/common/migration/MigrationFactory");
var ParseApp = require("../../../lib/common/parse/ParseApp");

describe('MigrationFactory', function () {

  var parseApp;

  beforeEach(function () {
    parseApp = new ParseApp("parse_backend_migration_version", "XABC-MOCK-APP_ID", "XBCD-MOCK-MASTER_ID");
  });

  describe('#parseUp()', function () {
    it('should throw an error if an incompatible migration is detected', function () {
      var migrationFactory = new MigrationFactory("migrationDir");
      expect(migrationFactory.parseUp).to.throw(Error);
      expect(function () { migrationFactory.parseUp('1234_filename.js'); }).to.throw(Error);
    });

    it('should return an empty migration if no steps are defined', function () {
      var migrationFactory = new MigrationFactory("migrationDir", function() { return { change: function () {} }; });

      var migration = migrationFactory.parseUp('dummy.js');
      expect(migration).to.be.an.instanceof(Migration);
      expect(migration.steps).to.be.empty;
    });
  });

  describe('#parseDown()', function () {
    it('should throw an error if an incompatible migration is detected', function () {
      var migrationFactory = new MigrationFactory("migrationDir");
      expect(migrationFactory.parseDown).to.throw(Error);
      expect(function () { migrationFactory.parseDown('1234_filename.js'); }).to.throw(Error);
    });

    it('should return an empty migration if no steps are defined', function () {
      var migrationFactory = new MigrationFactory("migrationDir", function() { return { change: function () {} }; });

      var migration = migrationFactory.parseDown('dummy.js');
      expect(migration).to.be.an.instanceof(Migration);
      expect(migration.steps).to.be.empty;
    });
  });

});
