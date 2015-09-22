import { Migration, MigrationStep, ClassMigrationDesc, ColumnMigrationDesc }from './Migration';

/**
 * Base for all migration Builder
 */
export class MigrationBuilder {
  /**
   * @param migrationFn migration function to execute (like change, up or down)
   * @param fileName name from the migration file
   * @param autoReverse flag to indicate if the create and remove methods should be automatically reverted
   *                    (change -> remove and remove -> change; needed for automatic down migration from #change() methods)
   */
  constructor(migrationFn, fileName, autoReverse) {
    this.migrationFn = migrationFn;
    this.migrationFileName = fileName;
    this.autoReverse = autoReverse;
  }

  build() {
    // create empty migration
    let migration = new Migration();
    let _this = this;
    // build migration steps
    this.migrationFn(function(className) {
      return new ClassCommandBuilder(migration, _this.autoReverse, {
        'className': className
      });
    });
    return migration;
  }
}

class CommandBuilder {
  /**
   * @param migration the migration to add the migration commands to.
   * @param autoReverse flag to indicate if the create and remove methods should be automatically reverted
   *                    (change -> remove and remove -> change; needed for automatic down migration from #change() methods)
   * @param migrationParams params needed to create a migration step
   */
  constructor(migration, autoReverse, migrationParams) {
    this.migration = migration;
    this.autoReverse = autoReverse;
    this.migrationParams = migrationParams;

    this.OPERATIONS = {
      CREATE: 'create',
      REMOVE: 'remove'
    };
  }

  /**
   * @return all constructor params as array for better commandBuilder creation
   */
  _args() {
    return [this.migration, this.autoReverse, this.migrationParams];
  }

  _unsupportedAutoReverseRequested(errorDesc) {
    throw new Error('Unsupported auto reverse operation: ' + errorDesc);
  }

  _reverseOperation(operation) {
    if (this.autoReverse && this.OPERATIONS.CREATE === operation) {
      return this.OPERATIONS.REMOVE;
    }

    if (this.autoReverse && this.OPERATIONS.REMOVE === operation) {
      return this.OPERATIONS.CREATE;
    }

    return operation;
  }

  /**
   * @param operation can be either create or remove
   */
  _createMigrationStep(operation) {
    let op = this._reverseOperation(operation);

    // class must currently always be defined
    let classMigrationDesc = new ClassMigrationDesc(op, this.migrationParams.className);
    let columnMigrationDesc = undefined;

    if (this.migrationParams.columnName) {
      columnMigrationDesc = new ColumnMigrationDesc(op, {
        name: this.migrationParams.columnName,
        dataType: this.migrationParams.columnDataType
      });
    }

    let step = new MigrationStep(classMigrationDesc, columnMigrationDesc);
    this.migration.add(step);
  }
}

/**
 * Builder for class level migration commands
 */
class ClassCommandBuilder extends CommandBuilder {
  constructor( ...args ) { super(...args); }

  /**
   * creates the migration step to create the specified class
   */
  create() {
    this._createMigrationStep(this.OPERATIONS.CREATE);
  }

  /**
   * creates the migration command to remove the specified class
   */
  remove() {
    if(this.autoReverse) {
      return this._unsupportedAutoReverseRequested("Revert remove class");
    }

    this._createMigrationStep(this.OPERATIONS.REMOVE);
  }

  /**
   * sets the column name to create the migration command for
   *
   * @param name  name from the column to create/update/delete
   *
   * @return ColumnCommandBuilder to create/update/delete the given class
   */
  column(name) {
    this.migrationParams.columnName = name;

    // return new command builder for chaining
    let args = this._args();
    return new ColumnCommandBuilder(...args);
  }
}

/**
 * Builder for column level migration commands
 */
class ColumnCommandBuilder extends CommandBuilder {
  constructor( ...args ) { super(...args); }

  /**
   * creates the migration command to create the specified column in the specified class
   *
   * @param details [Object]
   *      details.type  =   ParseDataType   =   Data type from the column to create
   */
  create(details) {
    this.migrationParams.columnDataType = details.type;

    this._createMigrationStep(this.OPERATIONS.CREATE);
  }

  /**
   * creates the migration command to remove the specified column
   */
  remove() {
    if(this.autoReverse) {
      return this._unsupportedAutoReverseRequested("Revert remove column");
    }

    this._createMigrationStep(this.OPERATIONS.REMOVE);
  }
}
