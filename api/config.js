'use strict';

var defaults = {
  AWS_PROFILE: 'default',
  AWS_REGION: 'ap-southeast-2',
  ENVIRONMENT_STAGE: 'dev',
  PROJECT_PREFIX: 'PROJECT_NAME-api',
  PACKAGE_VERSION: '1.0.0',
  PROJECT_NAME: 'PROJECT_NAME',
  PROJECT_NAME_LOWER_DASHED: 'PROJECT_NAME_LOWER_DASHED',
  SWAGGER_SRC_JSON: `PROJECT_NAME_LOWER_DASHED.json`,
  SWAGGER_EXPORTED_JSON: 'PROJECT_NAME_LOWER_DASHED-exported.json',
  CF_FILE: 'PROJECT_NAME.json'
};

function getVar(name) {
  if (process.env[name]){
    console.log('Getting value', name, 'from environmental variable with value', process.env[name], ' overriding ', defaults[name]);
    return process.env[name];
  }
  return defaults[name];
}

var config = {
  AWS_PROFILE: getVar('AWS_PROFILE'),
  AWS_REGION: getVar('AWS_REGION'),
  ENVIRONMENT_STAGE: getVar('ENVIRONMENT_STAGE'),
  PROJECT_PREFIX: getVar('PROJECT_PREFIX'),
  PACKAGE_VERSION: getVar('PACKAGE_VERSION'),
  SWAGGER_SRC_JSON: getVar('SWAGGER_SRC_JSON'),
  SWAGGER_EXPORTED_JSON: getVar('SWAGGER_EXPORTED_JSON'),
  CF_FILE: getVar('CF_FILE'),
  PROJECT_NAME: getVar('PROJECT_NAME'),
  PROJECT_NAME_LOWER_DASHED: getVar('PROJECT_NAME_LOWER_DASHED')
};

// For local development, define these properties before requiring the SDK since it will provide the right credentials
if (!process.env.LAMBDA_TASK_ROOT) {
  // Code is not running in a Lambda container, set AWS profile to use
  process.env.AWS_PROFILE = config.AWS_PROFILE;
  process.env.AWS_REGION = config.AWS_REGION;
}

// Attach this AWS object with credentials setup for other methods.
config.AWS = require('aws-sdk');
config.getName = (suffix) => {
  return config.getResourcePrefix() + suffix;
};
config.getResourcePrefix = () => {
  return config.PROJECT_PREFIX + '-' + config.ENVIRONMENT_STAGE + '-';
};
config.getLambdaZipName = () => {
  return 'lambda-' + config.PACKAGE_VERSION + '.zip';
};
config.getLambdaZipPath = () => {
  var path = require('path');
  return path.join(__dirname, 'dist', 'lambda-' + config.PACKAGE_VERSION + '.zip');
};

module.exports = config;
