
import fs from 'fs';
import path from 'path';
import { MigrationBuilder } from './MigrationBuilder';

/**
 * Factory to create a migration from a migration file
 */
export default class MigrationFactory {

  /**
   * @param directory directory containing all the migration files
   */
  constructor(directory, migrationLoader) {
    this.directory = directory;
    this.loadMigration = migrationLoader || function (file) { return require(this._migrationPath(file)); };
  }

  directory() {
    return this.directory;
  }

  files() {
    return fs.readdirSync(this.directory).sort();
  }

  /**
  * @param file the migration file to parse
  *
  * @return parsed migration with the 'up' variants
  */
  parseUp(file) {
    // try to read the migration file
    let plainMigration = this.loadMigration(file);
    if (plainMigration) {

      // check if a change method is provided in the given migration
      if (typeof plainMigration.change === 'function') {
        return new MigrationBuilder(plainMigration.change, file, false).build();
      }
    }

    throw new Error('Invalid up migration detected!');
  }

  /**
  * @param file the migration file to parse
  *
  * @return parsed migration with the 'down' variants
  */
  parseDown(file) {
    // try to read the migration file
    let plainMigration = this.loadMigration(file);
    if (plainMigration) {

      // check if a change method is provided in the given migration
      if (typeof plainMigration.change === 'function') {
        return new MigrationBuilder(plainMigration.change, file, true).build();
      }
    }

    throw new Error('Invalid down migration detected!');
  }

  _migrationPath(filepath) {
    return path.join(this.directory, filepath);
  }
}
