import chalk from 'chalk';
import { Base } from 'yeoman-generator';

export default class BaseGenerator extends Base {
    constructor( ...args ) {
      super(...args);
      this.text = {
          styledVariable: chalk.blue.bold,
          styledInvalidVariable: chalk.red.bold,
          styledError: chalk.red.underline,
          styledLink: chalk.black.underline,
          styledHint: chalk.magenta.bold
      };

      this.CONFIG_KEYS = {
        GLOBAL_JSON_PATH: 'globalJsonPath',
        DB_MIGRATION_DIR: 'dbMigrationDir'
      };
    }

    get test() {
      return null;
      // do something
    }
}
