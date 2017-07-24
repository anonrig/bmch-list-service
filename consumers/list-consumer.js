const microservice = require('../libs/microservice');
const List = require('../models/list');
const boom = require('boom');


class ListConsumer {

  constructor() {
    this.listQueue = microservice.getQueue('list');

    this.listQueue.consumeEvent('getList', this.getList);
    this.listQueue.consumeEvent('createList', this.createList);
  }

  async getList(data, done) {
    try {
      if (!data.owner) return done(boom.badRequest());

      let list = null;

      if (data.name)
        list = await List.findOne({name: data.name, owner: data.owner});
      else
        list = await List.findOne({owner: data.owner});

      if (!list) return done(boom.notFound());
      done(null, list);
    } catch (err) {
      done(boom.boomify(err));
    }
  }

  async createList(data, done) {
    try {
      if (!data.owner) return done(boom.badRequest());

      let userQueue = microservice.getQueue('user');
      let user = await userQueue.sendEvent('get', {id: data.owner});
      if (!user) return done(boom.notFound());
      let newList = new List(data);

      let list = await newList.save();
      done(null, list)
    } catch (err) {
      console.log(err);

      if (err.code && err.code == 11000)
        done(boom.badRequest('List already exists'));
      else
        done(boom.boomify(err));
    }
  }
}


module.exports = new ListConsumer();
