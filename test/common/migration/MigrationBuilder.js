
/** include chai assertion library **/
var expect = require("chai").expect;
var should = require('chai').should();

/** include domain specific stuff **/
var Migrator = require("../../../lib/common/migration/Migrator");
var Migrations = require("../../../lib/common/migration/Migrations");
var Migration = require("../../../lib/common/migration/Migration").Migration;
var MigrationBuilder = require("../../../lib/common/migration/MigrationBuilder").MigrationBuilder;
var MigrationFactory = require("../../../lib/common/migration/MigrationFactory");
var ParseApp = require("../../../lib/common/parse/ParseApp");

describe('MigrationBuilder', function () {

    var parseApp;

    beforeEach(function () {
      parseApp = new ParseApp("parse_backend_migration_version", "XABC-MOCK-APP_ID", "XBCD-MOCK-MASTER_ID");
    });

    describe('#build()', function () {
      it('should create a valid migration if only classes and columns are created', function () {
        var migration = new MigrationBuilder(function (clazz) {
          clazz('foo').create();
          clazz('fooo').column('bar').create({type: 'Number'});
          clazz('foo').column('asdas').remove();
          clazz('foo').remove();
        }, 'filename.js',false).build();

        expect(migration).to.be.an.instanceof(Migration);
        expect(migration.steps).to.have.length(4);
      });
    });

    // TODO add some tests here
});
