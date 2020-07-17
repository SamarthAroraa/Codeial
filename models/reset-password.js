const mongoose = require("mongoose");

//////////////////////////////////////
//          Comment Schema             //
//////////////////////////////////////
const PasswordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isvalid: {
      type: Boolean,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ResetPassword = mongoose.model("ResetPassword", PasswordSchema);
module.exports = ResetPassword;
