
/** include chai assertion library **/
var expect = require("chai").expect;
var should = require('chai').should();

/** include domain specific stuff **/
var Migrator = require("../../../lib/common/migration/Migrator");
var Migrations = require("../../../lib/common/migration/Migrations");
var MigrationFactory = require("../../../lib/common/migration/MigrationFactory");
var ParseApp = require("../../../lib/common/parse/ParseApp");

describe('Migrator', function () {

  var parseApp;
  var migrationFactory;

  beforeEach(function () {
    var parseApp = new ParseApp("parse_backend_migration_version", "XABC-MOCK-APP_ID", "XBCD-MOCK-MASTER_ID");
    var migrationFactory = new MigrationFactory("migrationDir");
  });

  describe('#down', function () {
    // TODO
  });

  describe('#up()', function () {
    // TODO
  });

  describe('#_readUpMigrations()', function () {
    it('should let parse all files from the migration factory and add it to the Migrations Object', function () {
      // given
      // mock migrationFactory#files()
      var migrationFactory = new MigrationFactory("migrationDir");
      migrationFactory.parseUp = function (file) { return file + '#parseUp'; };
      var migrator = new Migrator(parseApp, migrationFactory, undefined, false);
      var files = ['1_file.js', '2_file.js'];

      // when
      var result = migrator._readUpMigrations(files);

      // then
      expect(result).to.be.instanceof(Migrations);
      expect(result.migrations).to.be.deep.equal(['1_file.js#parseUp', '2_file.js#parseUp']);
    });
  });

  describe('#_readDownMigrations()', function () {
    it('should let parse all files from the migration factory and add it to the Migrations Object', function () {
      // given
      // mock migrationFactory#files()
      var migrationFactory = new MigrationFactory("migrationDir");
      migrationFactory.parseUp = function (file) { return file + '#parseDown'; };
      var migrator = new Migrator(parseApp, migrationFactory, undefined, false);
      var files = ['1_file.js', '2_file.js'];

      // when
      var result = migrator._readUpMigrations(files);

      // then
      expect(result).to.be.instanceof(Migrations);
      expect(result.migrations).to.be.deep.equal(['1_file.js#parseDown', '2_file.js#parseDown']);
    });
  });

  describe('#_getMigrationFiles()', function () {
    it('should return an array with all versions between the current (excluding) and the target (including)', function () {
      // given
      // mock migrationFactory#files()
      var migrationFactory = new MigrationFactory("migrationDir");
      migrationFactory.files = function () { return ['1_file.js', '2_file.js', '3_file.js', '4_file.js']; };
      var migrator = new Migrator(parseApp, migrationFactory, undefined, false);
      var currentVersion = '1_file';
      var targetVersion = '3_file';

      // when
      var result = migrator._getMigrationFiles(currentVersion, targetVersion);

      // then
      expect(result).to.be.deep.equal(['2_file.js', '3_file.js']);
    });

    it('should return an array with all versions from the start up to the target version if no current version is specified', function () {
      // given
      // mock migrationFactory#files()
      var migrationFactory = new MigrationFactory("migrationDir");
      migrationFactory.files = function () { return ['1_file.js', '2_file.js', '3_file.js', '4_file.js']; };
      var migrator = new Migrator(parseApp, migrationFactory, undefined, false);
      var currentVersion = undefined;
      var targetVersion = '3_file';

      // when
      var result = migrator._getMigrationFiles(currentVersion, targetVersion);

      // then
      expect(result).to.be.deep.equal(['1_file.js', '2_file.js', '3_file.js']);
    });
  });

  describe('#_resolveTargetVersion()', function () {
    it('should resolve target version to given target version, if it is defined', function () {
      // given
      var migrator = new Migrator(parseApp, migrationFactory, undefined, false);
      var versions = ['2013_11', '2014_22', '2015_123'];
      var targetVersion = '2014_22';

      // when
      var result = migrator._resolveTargetVersion(versions, targetVersion);

      // then
      expect(result).to.be.equal('2014_22');
    });

    it('should resolve target to latest version if target is undefined but migration files available', function () {
      // given
      var migrator = new Migrator(parseApp, migrationFactory, undefined, false);
      var versions = ['2014_22', '2015_123'];
      var targetVersion = undefined;

      // when
      var result = migrator._resolveTargetVersion(versions, targetVersion);

      // then
      expect(result).to.be.equal('2015_123');
    });

    it('should resolve target to undefined if target and no files are defined', function () {
      // given
      var migrator = new Migrator(parseApp, migrationFactory, undefined, false);
      var versions = [];
      var targetVersion = undefined;

      // when
      var result = migrator._resolveTargetVersion(versions, targetVersion);

      // then
      expect(result).to.be.equal(undefined);
    });
  });

  describe('#_findIndex()', function () {
    it('should return the index in an array from a given version', function () {
      // given
      var migrator = new Migrator(parseApp, migrationFactory, undefined, false);
      var versions = ['2013_11', '2014_22', '2015_123'];
      var version = '2014_22';

      // when
      var result = migrator._findIndex(versions, version);

      // then
      expect(result).to.be.equal(1);
    });

    it('should return -1 if the version is not in the given array', function () {
      // given
      var migrator = new Migrator(parseApp, migrationFactory, undefined, false);
      var versions = ['2013_11', '2014_22', '2015_123'];
      var version = 'foobar';

      // when
      var result = migrator._findIndex(versions, version);

      // then
      expect(result).to.be.equal(-1);
    });
  });

  describe('#_basename()', function () {
    it('should remove the given file extension from a file name', function () {
      // given
      var migrator = new Migrator(parseApp, migrationFactory, undefined, false);
      var fileName = 'filename.js';
      var fileExtension = '.js';

      // when
      var result = migrator._basename(fileName, fileExtension);

      // then
      expect(result).to.be.equal('filename');
    });

    it('should not remove the file extension it it not match with the given', function () {
      // given
      var migrator = new Migrator(parseApp, migrationFactory, undefined, false);
      var fileName = 'filename.html';
      var fileExtension = '.js';

      // when
      var result = migrator._basename(fileName, fileExtension);

      // then
      expect(result).to.be.equal('filename.html');
    });

    it('should only remove the given file extension from a file name', function () {
      // given
      var migrator = new Migrator(parseApp, migrationFactory, undefined, false);
      var fileName = 'filename.html.js';
      var fileExtension = '.js';

      // when
      var result = migrator._basename(fileName, fileExtension);

      // then
      expect(result).to.be.equal('filename.html');
    });
  });

  describe('#_removeFileExt()', function ()  {
    it('should remove the given extension from all files in the given array', function () {
      // given
      var migrator = new Migrator(parseApp, migrationFactory, undefined, false);
      var files = ['filename.js', 'anotherFileName.js'];
      var fileExtension = '.js';

      // when
      var result = migrator._removeFileExt(files, fileExtension);

      // then
      expect(result).to.be.instanceof(Array);
      expect(result).to.be.deep.equal(['filename', 'anotherFileName']);
    });

    it('should remove the given extension from all files in the given array if the extension mathes the given one', function () {
      // given
      var migrator = new Migrator(parseApp, migrationFactory, undefined, false);
      var files = ['filename.js', 'anotherFileName.html'];
      var fileExtension = '.js';

      // when
      var result = migrator._removeFileExt(files, fileExtension);

      // then
      expect(result).to.be.instanceof(Array);
      expect(result).to.be.deep.equal(['filename', 'anotherFileName.html']);
    });
  });

  describe('#_addFileExt()', function ()  {
    it('should append the given extension to all file names in the given array', function () {
      // given
      var migrator = new Migrator(parseApp, migrationFactory, undefined, false);
      var files = ['filename', 'anotherFileName'];
      var fileExtension = '.js';

      // when
      var result = migrator._addFileExt(files, fileExtension);

      // then
      expect(result).to.be.instanceof(Array);
      expect(result).to.be.deep.equal(['filename.js', 'anotherFileName.js']);
    });
  });
});
