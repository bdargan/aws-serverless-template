'use strict';

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

module.exports = {
  archiver: require('./archiver'),
  cloudFormation: require('./cloudFormation'),
  cognito: require('./cognito'),
  apigateway: require('./apigateway'),
  swagger: require('./swagger'),
  lambda: require('./lambda'),
  logger: require('./logger'),
  s3: require('./s3'),
  sleep
};
