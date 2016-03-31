'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the legendary ' + chalk.red('generator-wunderproject') + ' generator!'
    ));
    this.log(chalk.blue('So, now I\'ll ask you some questions. The defaults should be ok for most of cases, but especially about your project name, URL and IP... be creative!'));

    var prompts = [{
      type: 'confirm',
      name: 'path',
      message: 'Should i create a new folder for your project?',
      default: "Yes"
    },{
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
      message: 'What\'s the name of your project? (for now, please, no spaces :))',
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
      default: "Yes"
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
    var subpath = "";

    if(props.path == true){
      console.log("creating the folder " + props.projectName);
      mkdirp(props.projectName, function (err, subpath) {
          if (err) console.error(err)
          else {
            console.log(chalk.green('Directory ' + props.projectName +' created!'));
          }
      });
      subpath = props.projectName + "/";
    }
    // WunderTools is in node_modules. Let's copy it!
    this.fs.copy(this.templatePath('../../../node_modules/WunderTools/'),
      this.destinationPath(subpath)
    );
    // Removing the templated files.
    this.fs.delete(this.destinationPath(subpath + 'conf/setup.yml.tpl'));
    // Copying the templated files templating them.
    this.fs.copyTpl(
      this.templatePath('../../../node_modules/WunderTools/conf/setup.yml.tpl'),
      this.destinationPath(subpath +'conf/setup.yml'),
      this.props
    );

    console.log(chalk.green('Everything done! Thanks for using WunderTools. Now run a "simple" vagrant up and profit!'));
  },
});
