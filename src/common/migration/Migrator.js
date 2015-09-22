
import Path from 'path';
import _ from 'lodash';
import MigrationFactory from './MigrationFactory';
import Migrations from './Migrations';

export default class Migrator {

  /**
  * @param parseApp parse.com app to run the migrations for
  * @param migrationFactory factory to parse migration files
  * @param targetVersion version to migrate the backend from the given parse app to
  * @param failOnError Boolean flag to indicate if tha migration dhould fail if a songle step fails
  */
  constructor(parseApp, migrationFactory, targetVersion, failOnError) {
    this.parseApp = parseApp;
    this.migrationFactory = migrationFactory;
    this.targetVersion = targetVersion;
    this.failOnError = failOnError;
  }

  /**
   * runnig the up variants from the migration between the given version (including the target version)
   */
  up() {
    this.parseApp.getCurrentVersion().then(function(version) {
      let migrationFiles = this._getMigrationFiles(version, this.targetVersion);
      this._execute(this._readUpMigrations(migrationFiles));
    }.bind(this)).catch(function (err) {
      this._handleError(err);
    }.bind(this));
  }

  /**
   * runnig the up variants from the migration between the given version (including the target version)
   */
  down() {
    this.parseApp.getCurrentVersion().then(function(version) {
      let migrationFiles = this._getMigrationFiles(version, this.targetVersion);
      this._execute(this._readDownMigrations(migrationFiles));
    }.bind(this)).catch(function (err) {
      this._handleError(err);
    }.bind(this));
  }

  /**
   * @param currentVersion version to start at (excluding this version).
   *                       Can be undefined to use all available migrations.
   * @param targetVersion version to migrate to (including this version)
   */
  _getMigrationFiles(currentVersion, targetVersion) {
    let migrationFiles = this._removeFileExt(this.migrationFactory.files(), '.js');
    this.targetVersion = this._resolveTargetVersion(migrationFiles, this.targetVersion);

    // nothing todo, if the target version cannot be resolved
    if(!this.targetVersion) { return []; }

    let startIndex = 0;
    if(currentVersion !== undefined) {
      startIndex = this._findIndex(migrationFiles, currentVersion);
      // exclude current version
      startIndex += 1;
    }

    // find index of our target version
    let targetIndex = this._findIndex(migrationFiles, targetVersion);

    // return only the migration files between the current (excluding) and target (including) version
    return this._addFileExt(_.slice(migrationFiles, startIndex, (targetIndex + 1)), '.js');
  }

  _findIndex(files, version) {
    return _.findIndex(files, function (file) {
      return file === version;
    });
  }

  _basename(filename, ext) {
    return Path.basename(filename, ext);
  }

  /**
   * @param files array with file names to remove the extension from
   * @param ext the extension to remove from the given files
   *
   * @return array with file names (without the given file extension)
   */
  _removeFileExt(files, ext) {
    var names = []
    files.forEach(f => names.push(this._basename(f, ext)));
    return names;
  }

  /**
   * @param names array with file names (excluding file extension)
   * @param ext the extension to add to the given file names
   *
   * @return array with file names (with appended extension)
   */
  _addFileExt(names, ext) {
    var files = []
    names.forEach(n => files.push(n + ext));
    return files;
  }

  _resolveTargetVersion(files, targetVersion) {
    if(targetVersion === undefined && files.length >= 1) {
      // if no user specific target version is defined,
      // the latest available version will be used as target version
      return files[files.length - 1];
    }

    return targetVersion;
  }

  /**
   * @throws Error if an incompatible migration file will be detected
   */
  _readUpMigrations(files) {
    let migrations = new Migrations();
    files.forEach(f => migrations.add(this.migrationFactory.parseUp(f)));
    return migrations;
  }

  /**
   * @throws Error if an incompatible migration file will be detected
   */
  _readDownMigrations(files) {
    let migrations = new Migrations();
    files.forEach(f => migrations.add(this.migrationFactory.parseDown(f)));
    return migrations;
  }

  _execute(migrations) {
    migrations.execute(this.parseApp);
  }

  _handleError(err) {
    console.log("Unexpected error while working at your migration: ", err);
  }
}
