try {
  const microservice = require('./libs/microservice');
  const Promise = require('bluebird');
  const mongoose = Promise.promisifyAll(require('mongoose'));
  const config = require('config');

  mongoose.connect(process.env.MONGO_URI || config.get('Mongo.host'))
    .then(() => {
      console.log('List Service is connected to the database.');
      initMicroservice();
    })
    .catch((err) => console.error(err));

  function initMicroservice() {
    microservice.init()
      .then(() => {
        const ListConsumer = require('./consumers/list-consumer');

        console.log('List service is UP.');
      })
      .catch((err) => {
        console.log('Retrying in 5.', err);
        setTimeout(initMicroservice, 5000);
      });
  }


  module.exports = microservice;

} catch (err) {
  console.error(err)
}
