'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    

var TagSchema = new Schema({
  k: { //kind
    type: String, 
    required: true, 
    enum: ['t', 'l'] //title, location
  },  
  n: { //name
    type: String, 
    required: true,
    trim: true
  },  
});


mongoose.model('Tag', TagSchema);
