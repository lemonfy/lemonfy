'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash');

var util = require('../helpers/validation_util');


var RatingSchema = new Schema({
  cid: { // company id
    type: Schema.Types.ObjectId, 
    required: true
  },
  h: { //email hash
    type: String
  },
  v: { //valid
    type: Boolean, 
    default: false
  },
  tk: { //validation token
    type: String
  },
  s: { //score
    type: Number, 
    required: true, 
    min: 1, 
    max: 5, 
  },
  t: String, //title
  l: String, //location
  c: String  //comment
}, {
  autoIndex: false,
  id: false, 
  toJSON: {
    virtuals: true,
    transform: function (doc, ret, options) {
      delete ret._id;
      delete ret.h;
      delete ret.v;
      delete ret.tk;
      delete ret.__v;
    }
  }
});

RatingSchema.index({cid: 1, v: 1});

/**
 * Virtuals
 */
RatingSchema.virtual('ts').get(function() {
  return this._id.getTimestamp().getTime();
});

/**
 * Validations
 */
var SCORE_VALS = [1, 2, 3, 4, 5];
var TITLE_LEN_MAX = 100;
var LOCATION_LEN_MAX = 100;
var COMMENT_LEN_MAX = 2000;

RatingSchema.path('s').validate(function (score) {
  return _.contains(SCORE_VALS, score);
}, 'Rating score must be an integer between 1 and 5' );

RatingSchema.path('t').validate(function (title) {
  return util.checkOptionalString(title, TITLE_LEN_MAX);
}, 'Title must be less than ' + TITLE_LEN_MAX + ' characters');

RatingSchema.path('l').validate(function (location) {
  return util.checkOptionalString(location, LOCATION_LEN_MAX);
}, 'Location must be less than ' + LOCATION_LEN_MAX + ' characters');

RatingSchema.path('c').validate(function (comment) {
  return util.checkOptionalString(comment, COMMENT_LEN_MAX);
}, 'Comment must be less than ' + COMMENT_LEN_MAX + ' characters');

mongoose.model('Rating', RatingSchema);
