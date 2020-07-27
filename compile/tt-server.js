#!/usr/bin/env node
'use strict';
const argv = require('minimist')(process.argv.slice(2));
const commands = argv._;

const tt = require('./index');

async function run() {
  switch (commands[0]) {
    case 'dev':
      tt.dev(argv);
      break;
    case 'watch':
      tt.watch(argv);
      break;
    case 'build':
      tt.build(argv);
      break;
    case 'component-build':
      const APP_PATH = process.cwd();
      const srcPath = `${APP_PATH}/src`;
      const libPath = `${APP_PATH}/lib`;

      tt.componentBuild(srcPath, libPath);
      break;
    default:
      break;
  }
}

run(commands);
