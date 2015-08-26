
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

  /**
   * executes the all the migrations for the given parseApp
   */
  execute(parseApp) {
    // TODO
  }
}
