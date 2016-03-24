'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the legendary ' + chalk.red('generator-wunderproject') + ' generator!'
    ));
    this.log(chalk.blue('So, now I\'ll ask you some questions. The defaults should be ok for most of cases, but especially about your project name, URL and IP... be creative!'));

    var prompts = [{
      type: 'text',
      name: 'wunderMachina',
      message: 'What\'s the repo where to clone ansible from?',
      default: 'git@github.com:wunderkraut/WunderMachina.git'
    }, {
      type: 'text',
      name: 'wunderMachina_branch',
      message: 'What\'s the branch to be used?',
      default: 'feature/simplify_setup'
    }, {
      type: 'text',
      name: 'projectLocalBox',
      message: 'What\'s the box you want to use for this project?',
      default: 'https://www.dropbox.com/s/wa0vs54lgngfcrx/vb-centos-6.5-x86_64-v0.box?dl=1'
    },{
      type: 'text',
      name: 'projectName',
      message: 'What\'s the name of your project?',
      default: 'ansibleref'
    }, {
      type: 'text',
      name: 'projectLocalURL',
      message: 'What\'s the local URL you want for your project?',
      default: 'local.ansibleref.com'
    }, {
      type: 'text',
      name: 'projectLocalIP',
      message: 'What\'s the IP you want to use for this machine?',
      default: '192.168.10.170'
    },{
      type: 'confirm',
      name: 'buildSh_enabled',
      message: 'Do you want the build.sh to be enabled?',
      default: true
    },{
      type: 'text',
      name: 'buildSh_branch',
      message: 'Which branch would you like to use for that?',
      default: 'develop'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: function () {
    var props = this.props;
    // WunderTools is in node_modules. Let's copy it!
    this.fs.copy(this.templatePath('../../../node_modules/WunderTools/'),
      this.destinationPath('')
    );
    // Removing the templated files.
    this.fs.delete(this.destinationPath('conf/variables.yml'));
    // Copying the templated files templating them.
    this.fs.copyTpl(
      this.templatePath('../../../node_modules/WunderTools/conf/setup.yml.tpl'),
      this.destinationPath('conf/setup.yml'),
      this.props
    );
  },

  install: function () {
    this.installDependencies({
       bower: false,
       npm: true,
       callback: function () {
         console.log('Everything is ready!');
       }
    });
  }
});
