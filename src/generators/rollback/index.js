// import { BaseGenerator } from '../../common/generator/Base';
import { Base } from 'yeoman-generator';

export default class AppGenerator extends Base {
    constructor( ...args ) {
      super(...args);
    }


    get prompting() {
      return {
        appName() {
          console.log('irgendwas passiert #rollback!');
        },
      };
    }
}
