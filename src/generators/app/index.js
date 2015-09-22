import BaseGenerator from '../../common/generator/Base';
//import { Base } from 'yeoman-generator';

export default class AppGenerator extends BaseGenerator {
    constructor( ...args ) {
      super(...args);

      this.argument('globalJson', {
        type: String,
        required: false,
        desc: 'Path to your global.json conf  iguration file from parse.com. Normally its located at ./config/global.json'
      });

      this.option('forceConfigure', {
        desc: 'Force the run of configuration steps. (normally they\'re skipped, if already configured)',
      });
    }

    get initializing() {
      return {
        init: function () {
          this.globalJsonFilePath = undefined;
          this.promptForGlobalJson = false;
        },

        /**
         * searches the global.json configuration file from parse.com
         */
        detectGlobalJsonPath: function () {
          // check if the path was provided as argument
          if (typeof this.globalJson === "string" && this.fs.exists(this.globalJson)) {
            this.globalJsonFilePath = this.globalJson;
            this.log('Use the given global.json. [' + this.text.styledVariable(this.globalJsonFilePath) + ']');
            return;

          } else if (this.globalJsonFilePath = this.config.get(this.CONFIG_KEYS.GLOBAL_JSON_PATH)) {
            // else -> check if the globajson was already configured
            this.log('Use configured global.json. [' + this.text.styledVariable(this.globalJsonFilePath) + ']');
            return;

          } else if (this.fs.exists('./config/global.json')) {
            // else -> search at the default filesystem path to detect it automatically
            this.globalJsonFilePath = './config/global.json';
            this.log('Default global.json file found. [' + this.text.styledVariable(this.globalJsonFilePath) + ']');

            // because the file was choosed without any user input, the user should confirm it via prompt
          }

          // if the file could not be found, the generator should show up a prompt.
          this.promptForGlobalJson = true;
        },
      };
    }

    get prompting() {
      return {
        appName() {
          console.log('irgendwas passiert!');
        },
      };
    }
}
