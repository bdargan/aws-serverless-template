# Does what?

An aws servlerless template, based on https://github.com/awslabs/aws-serverless-auth-reference-app.

Create a stack that includes:
* API *(defined in swagger)*
* API Gateway
* lambda
* lambda deployment bits
* Cloudformation template

Iterate over updates using Gulp tasks
* ...

Dependencies
* todo

## Security
Creating a stack needs alot of privs.

# Getting Started

```
cd api
yarn install
cp .env-defaults .env
gulp check-env
```

1. Update project name


# Directory structure

## api
### cloudformation


# Pick a memorable project name and update all the filez

PROJECT_NAME
PROJECT_NAME_LOWER_DASHED
PROJECT_NAME_CAMEL
PROJECT_NAME_TITLE

```npm install project-name-generator --save
search/replace PROJECT_NAME/
```
 * api/config.js


# Trouble with templates
* Including just the right amount of stuff

# ToDo
* quick rename a project.
* front-end samples web-app; droid; ios.
* add specific details for security
* separate cloudformation, into stack deployment setup, and  app only
* lambda tests missing
