/*
 * grunt-bower-submodule
 * https://github.com/mellors/grunt-bower-submodule
 *
 * Copyright (c) 2013 Marcel Mellor
 * Licensed under the MIT license.
 */

'use strict';

var bower = require('bower'),
    async = require('async');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('bower_submodule', 'Installs all dependencies of different bower.json\'s inside a project', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
    });
    
    //Bower install method is asynchronous, this is why we use the the async trigger of bower
    var taskCompleted = this.async();

    // Find all bowser.json's
    var files = grunt.file.expand('test/**/bower.json'),
        packages = [];

    files.forEach(function(path){
        try {
            var config = grunt.file.readJSON(path);        
            grunt.log.writeln('parse ' + path);
            for(var p in config.devDependencies){
                var info = config.devDependencies[p].split('#'),
                    packageName = info[1] ? info[0] : p,
                    version = info[1] || info[0];
                            
                packages.push([p + "=" + packageName + '#' + version]);
            }
        }
        catch(e){
            grunt.log.writeln(e);
        }
    });
    
    async.each(packages, 
        function(p, callback){
            console.log(p);
            bower.commands
                .install(p, { save: true }, { /* custom config */ })
                .on('end', function (installed) {
                    callback();
                }).
                on('error', function(err){
                    callback(err);
                });            
        }, 
        function(err){
            grunt.log.writeln(err ? err : 'All bower packages have been installed.');                
            taskCompleted();
        }
    );

  });

};
