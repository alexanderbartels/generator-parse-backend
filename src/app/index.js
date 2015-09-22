import { BaseGenerator } from '../common/generator/Base';

export default class AppGenerator extends BaseGenerator {
    constructor( ...args ) {
      super(...args);
    }


    get prompting() {
      return {
        appName() {
          let done = this.async();
          let prompt = [
            {
              type: 'input',
              name: 'appName',
              message: 'Enter a name for your app:',
            },
          ];

          this.prompt(prompt, ( { appName } ) => {
            this.options.appName = appName;
            done();
          });
        },
      };
    }
}
