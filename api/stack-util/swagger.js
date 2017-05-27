'use strict';
var rfr = require('rfr');
var config = rfr('/config');
var logger = rfr('stack-util/logger');
var path = require('path');
var fs = require('fs-extra');
var spawn = require('child_process').spawn;

let swaggerDir = path.join(__dirname,'..','swagger');
let apiSdkDir = path.join(swaggerDir,'generated');
let appSdkDir = path.join(__dirname,'..','..','app',`${config.PROJECT_NAME_LOWER_DASHED}-web`, 'src',`${config.PROJECT_NAME_LOWER_DASHED}-sdk`);

function createSdk() {
  // Create generated directory if it does not exist
  if (fs.existsSync(apiSdkDir)) {
    fs.removeSync(apiSdkDir);
    fs.mkdirSync(apiSdkDir);
  } else {
    fs.mkdirSync(apiSdkDir);
  }

  return new Promise((resolve, reject) => {
    // Run Swagger codegen locally to generate SDK files
    let cmd = spawn('swagger-codegen', ['generate', '-i', swaggerDir + '/' + config.SWAGGER_EXPORTED_JSON, '-l', 'javascript', '-o', apiSdkDir]);
    cmd.stdout.on('data', data => {
      process.stdout.write(data);
    });
    cmd.stderr.on('data', data => {
      process.stderr.write(data);
    });
    cmd.on('exit', code => {
      if (code) {
        reject(new Error(`Finished with exit code ${code}`));
        return;
      }
      resolve('Generated SDK successfully');
    });
  }).then(() => {
    // Clear any existing files from app SDK directory
    fs.removeSync(appSdkDir);
    fs.mkdirSync(appSdkDir);

    // Copy SDK from temporary generated directory
    fs.copySync(apiSdkDir,appSdkDir);
    logger.info('Successfully generated client SDK at', appSdkDir);

    // Delete temporary generated SDK folder
    fs.removeSync(apiSdkDir);
    return 'Successfully generated SDK';
  });
}

module.exports = {
  createSdk
};
