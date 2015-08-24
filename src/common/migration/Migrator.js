
import MigrationTemplate from './MigrationTemplate';

export default class Migrator {

  /**
  * @param parseApp parse.com app to run the migrations for
  * @param targetVersion version to migrate the backend from the given parse app to
  * @param mergeSteps
  * @param failOnError Boolean flag to indicate if tha migration dhould fail if a songle step fails
  */
  constructor(parseApp, targetVersion, mergeSteps, failOnError) {
    this.migrations = [];
    this.parseApp = parseApp;
    this.targetVersion = targetVersion;
    this.mergeSteps = mergeSteps;
    this.failOnError = failOnError;
  }

  /**
   * runnig the up variants from the migration between the given version (including the target version)
   */
  up() {
    let migrationFiles = this._getMigrationFiles(this.parseApp.currentVersion(), this.targetVersion);
    this._execute(this._readUpMigrations(migrationFiles));
  }

  /**
   * runnig the up variants from the migration between the given version (including the target version)
   */
  down() {
    let migrationFiles = this._getMigrationFiles(this.parseApp.currentVersion(), this.targetVersion);
    this._execute(this._readDownMigrations(migrationFiles));
  }

  _getMigrationFiles(currentVersion, targetVersion) {
    // TODO
  }

  _readUpMigrations(files) {
    let migrations = new Migrations();
    files.forEach(f => migrations.add(MigrationTemplate.parseUp(f)));

    return migrations;
  }

  _readDownMigrations(files) {
    let migrations = new Migrations();
    files.forEach(f => migrations.add(MigrationTemplate.parseDown(f)));

    return migrations;
  }

  _execute(migrations) {
    migrations.execute();
  }
}
