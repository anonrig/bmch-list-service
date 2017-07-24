const MicroserviceKit = require('microservice-kit');
const config = require('config');
const _ = require('lodash');


class MicroService {
    constructor() {
      this.queues = [];
      this.options = config.get('RabbitMQ.options');

      if (this.options.queues && this.options.queues.length === 0) {
        throw new Error('Need to define at least one queue.');
      }

      _.forEach(config.get('RabbitMQ.queues'), (queue) => {
        this.queues.push({
        name: queue.name,
        key: queue.key,
        options: queue.options || this.options
      });
    });

      this.microserviceKit = new MicroserviceKit({
        type: 'core-worker',
        amqp: {
          url: config.get('RabbitMQ.host') || 'amqp://localhost:5672',
          queues: this.queues
        }
      });
    }

    init() {
      return this.microserviceKit.init();
    }

    getQueue(queue) {
      return this.microserviceKit.amqpKit.getQueue(queue);
    }
}


module.exports = new MicroService();
