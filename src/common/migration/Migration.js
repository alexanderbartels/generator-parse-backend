
export class Migration {

  /**
   *
   */
  constructor() {
    this.steps = [];
  }

  add(migrationStep) {
    let merged = false;
    if(this.steps.length >= 1) {
      merged = this.steps[this.steps.length -1].merge(migrationStep);
    }

    // only add migration step if it cannot merged to the previous one.
    if(!merged) {
      this.steps.push(migrationStep);
    }
  }

  getName() {
    // TODO
  }

  getVersion() {
    // TODO
  }

  /**
   * executes the all the migration steps for the given parseApp
   */
  execute(parseApp) {
    // TODO
  }
}

export class MigrationStep {

  /**
   * @param classDesc description for the class to manipulate
   * @param columnDesc description for the column to manipulate
   */
  constructor(classDesc, columnDesc) {
    this.classDesc = classDesc;
    this.columnDescList = columnDesc ? [columnDesc] : [];
  }

  /**
   * merge the given step in this step. only if the class level description is equals
   *
   * @param step the migration step to merge
   *
   * @return true if merge was successful. Otherwise false.
   */
  merge(step) {
    // TODO implement me for performance reasons 
    // fallback
    return false;
  }

  execute() {
    // TODO ...
  }
}

class MigrationDesc {
  /**
   * @param operation 'create' or 'remove'
   */
  constructor(operation) {
    this.operation = operation
  }
}

export class ClassMigrationDesc extends MigrationDesc {
  constructor( op, className ) {
    super(op);
    this.className = className;
  }
}

export class ColumnMigrationDesc extends MigrationDesc {
  constructor( op, column ) {
    super(op);
    this.columnName = column.name;
    this.columnDataType = column.dataType;
  }
}
