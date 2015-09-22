
export default class Migrations {

  /**
   *
   */
  constructor() {
    this.migrations = [];
  }

  add(migration) {
    this.migrations.push(migration);
  }

  logMigrationRecord(migration) {
    // TODO
  }

  /**
   * executes the all the migrations for the given parseApp
   */
  execute(parseApp) {
    // TODO ... test, update, optimize, etc. ...
    let _this = this;
    this.migrations.forEach(m => m.execute().then(function () { _this.logMigrationRecord(m); }));
  }
}
