
export default class MigrationFactory {
  constructor() {
    throw new Error("Static factory class");
  }

  /**
  * @param file the migration file to parse
  *
  * @return parsed migration with the 'up' variants
  */
  static parseUp(file) {
    // TODO
  }

  /**
  * @param file the migration file to parse
  *
  * @return parsed migration with the 'down' variants
  */
  static parseDown(file) {
    // TODO
  }
}
