'use strict';
var rfr = require('rfr');
var logger = rfr('stack-util/logger');
var fs = require('fs');

class SampleData {

  generateSampleFor(type) {
    let repository = rfr(`/lambda/domain/${type}-repository`);

    fs.readFile(`./stack-util/bootstrap/${type}.json`, 'utf8', function(err, data) {
      if (err) {
        console.error(err)
      }
      // console.log("processing data: ", data);
      let samples = JSON.parse(data);
      console.log(`create ${samples.length} ${type}`)
      let promises = [];
      for (let sample of samples) {
        promises.push(new Promise(resolve => {
          repository.create(sample);
        }))
      }
      return promises;
    })
  };

  generateSampleData() {
    let categories = this.generateSampleFor('category')
    let posts = this.generateSampleFor('posts')

    console.log(categories);
    if (categories && categories.length > 0) {
      return Promise.all([...categories, ...posts])
    } else {
      return Promise.resolve();
    }

  };
}

module.exports = {
  SampleData
};
