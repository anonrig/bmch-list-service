const mongoose = require('mongoose');
const _ = require('lodash');
const moment = require('moment');


const List = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  owner: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  items: [
    {
      name: {type: String, required: true, unique: true},
      description: {type: String},
      deadline: {type: Date, required: true},
      isActive: {type: Boolean},
      createdAt: {type: Date, default: Date.now}
    }
  ],
  createdAt: {type: Date, default: Date.now}
});


List.pre('save', function (next) {
  try {
    let now = moment();

    _.forEach(this.items, (item, index) => {
      let date = moment(item.deadline);
      this.items[index].isActive = date.isAfter(now);
      this.items[index].deadline = (moment(item.deadline)).toDate();
    });

    next();
  } catch (err) {
    next(err)
  }

});


module.exports = mongoose.model('List', List);
