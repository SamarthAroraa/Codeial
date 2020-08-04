const mongoose = require("mongoose");

//////////////////////////////////////
//          Friendship Schema       //
//////////////////////////////////////
const friendshipSchema = new mongoose.Schema(
  {
    
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
  },
  { timestamps: true }
);

const Friendship = mongoose.model("Friendship", friendshipSchema);
module.exports = Friendship;
