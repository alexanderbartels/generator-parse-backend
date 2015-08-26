
import fs from 'fs';

export default class MigrationFactory {

  /**
   * @param directory directory containing all the migration files
   */
  constructor(directory) {
    this.directory = directory;
  }

  directory() {
    return this.directory;
  }

  files() {
    return fs.readdirSync(this.directory);
  }

  /**
  * @param file the migration file to parse
  *
  * @return parsed migration with the 'up' variants
  */
  parseUp(file) {
    // TODO
  }

  /**
  * @param file the migration file to parse
  *
  * @return parsed migration with the 'down' variants
  */
  parseDown(file) {
    // TODO
  }
}
