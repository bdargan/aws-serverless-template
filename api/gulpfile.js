'use strict';
var gulp = require('gulp');
var rfr = require('rfr');
var util = require('./stack-util');
var path = require('path');
var install = require('gulp-install');
var lambdaData = rfr('lambda/data/dynamodb');
var bootstrap = rfr('stack-util/bootstrap');
var logger = rfr('stack-util/logger');
var swagger = require('gulp-swagger');

function execPromise(promise, done) {
  try {
    promise.then(() => {
      done();
    }).catch((err) => {
      logger.error('step failed', err);
      done(err);
      // handleError(err);
    })
  } catch (e) {
    logger.error('Exception thrown', e);
    done(e);
  }
}

gulp.task('sleep', function (done) {
  const NUMBER_OF_MILLISECONDS_TO_SLEEP = 5000;
  logger.info(`Sleeping for ${NUMBER_OF_MILLISECONDS_TO_SLEEP} milliseconds`);
  execPromise(util.sleep(NUMBER_OF_MILLISECONDS_TO_SLEEP), done);
});

// ## Stack
gulp.task('create_cloudformation_stack', function (done) {
  logger.info('Creating CloudFormation stack...');
  execPromise(util.cloudFormation.createStack(), done);
});

gulp.task('delete_cloudformation_stack', function (done) {
  logger.info('Deleting CloudFormation stack...');
  execPromise(util.cloudFormation.deleteStack(), done);
});

// Cognito
// gulp.task('create_cognito_pools', function (done) {
//   logger.info('Creating Cognito Identity and User Pools...');
//   execPromise(util.cognito.createCognitoPools(), done);
// });
//
// gulp.task('create_cognito_users', function (done) {
//   logger.info('Creating Sample Cognito User Pools user accounts...');
//   execPromise(util.importer.SampleData.generateSampleUsers(), done);
// });
//
// gulp.task('delete_cognito_pools', function (done) {
//   logger.info('Deleting Cognito Identity and User Pools...');
//   execPromise(util.cognito.deleteCognitoPools(), done);
// });

// DynamoDB

gulp.task('create_dynamodb_tables', function (done) {
  logger.info('Creating DynamoDB tables...');
  let promises = [
    (new lambdaData.CategoryTable()).safeCreateTable(),
    (new lambdaData.PostsTable()).safeCreateTable()
  ];
  execPromise(Promise.all(promises), done);
});

gulp.task('delete_dynamodb_tables', function (done) {
  logger.info('Deleting DynamoDB tables');
  let promises = [
    (new lambdaData.CategoryTable()).deleteTable(),
    (new lambdaData.PostsTable()).deleteTable()
  ];
  execPromise(Promise.all(promises), done);
});


gulp.task('bootstrap_sample_data', function (done) {
  logger.info('Bootstrap data - Generating sample data');
  execPromise(new bootstrap.SampleData().generateSampleData(), done);
});

// ## API
// gulp.task('validate_api', function() {
//   gulp.src('./swagger/PROJECT_NAME.json')
//     .pipe(swagger('schema.json'))
//     .pipe(gulp.dest('./build'));
// });

gulp.task('import_api', function (done) {
  logger.info('Importing Swagger API definition into API Gateway...');
  execPromise(util.apigateway.importApi(), done);
});

gulp.task('export_api', function (done) {
  logger.info('Exporting Swagger API definition from API Gateway...');
  execPromise(util.apigateway.exportApi(), done);
});

gulp.task('create_sdk', function (done) {
  logger.info('Generating SDK Swagger API definition...');
  execPromise(util.swagger.createSdk(), done);
});


gulp.task('create_api_stage', function (done) {
  logger.info('Creating API stage deployment...');
  execPromise(util.apigateway.createApiStage(), done);
});


// ## Lambda
gulp.task('create_lambda_zip', function (done) {
  logger.info('Creating Lambda zip archive...');
  execPromise(util.archiver.createLambdaZipFile(), done);
});

gulp.task('upload_lambda_zip', function (done) {
  logger.info('Uploading Lambda zip archive to S3...');
  execPromise(util.s3.uploadLambdaZipToS3(), done);
});

gulp.task('create_lambda_functions', function (done) {
  logger.info('Creating Lambda functions from Swagger API definition...');
  execPromise(util.lambda.createFunctionsFromSwagger(), done);
});

gulp.task('delete_lambda_functions', function (done) {
  logger.info('Deleting Lambda functions...');
  execPromise(util.lambda.deleteFunctions(), done);
});

gulp.task('deploy_lambda', gulp.series('create_lambda_zip', 'upload_lambda_zip', 'create_lambda_functions'));

gulp.task('deploy_api', gulp.series('import_api', 'sleep', 'create_api_stage'));

// gulp.task('deploy_lambda', gulp.series('create_lambda_zip', 'upload_lambda_zip', 'create_lambda_functions', 'create_custom_authorizer'));
