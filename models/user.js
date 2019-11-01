var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var userSchema = new Schema({

  username: {
    type: String,
    unique: true
  },

  comments: [
    {
      // Store ObjectIds in the array
      type: Schema.Types.ObjectId,
      // The ObjectIds will refer to the ids in the Note model
      ref: "comment"
    }
  ]
});

// This creates our model from the above schema, using mongoose's model method
var user = mongoose.model("user", userSchema);

// Export the User model
module.exports = user;