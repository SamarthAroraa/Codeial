const User = require("../models/user");
const Friendship = require("../models/friendships");

module.exports.add = async function (req, res) {
  let reciever = await User.findById(req.params.id);
  let sender = await User.findById(req.user.id);
  console.log("rrrrrr", req.params.id);
  console.log("ssssss", sender);
  if (!reciever) {
    req.flash("error", "User not found!");
    return res.json(404, {
      message: "User not found in database",
    });
  }
  //check if friendship already exists
  let existing = await Friendship.findOne({
    sender: sender,
    reciever: reciever,
  });
  if (existing) {
    req.flash("success", `${reciever.name} is already a friend!`);
    return res.json(200, {
      message: "Already added",
      data: {
        code: 1,
      },
    });
  } else {
    //make the friendship
    let friendship = await Friendship.create({
      sender: sender,
      reciever: reciever,
    });

    //add to sender and reciever's friendslist
    reciever.friends.push(sender);
    reciever.save();
    sender.friends.push(reciever);
    sender.save();
    req.flash("success", `${reciever.name} is now a friend!`);
    return res.json(200, {
      message: "friend added",
      data: {
        code: 1,
      },
    });
  }
};

module.exports.remove = async function (req, res) {
  let reciever = await User.findById(req.params.id);
  let sender = await User.findById(req.user.id);
  if (!reciever) {
    req.flash("error", "User not found!");
    return res.json(404, {
      message: "User not found in database",
    });
  }
  //check if friendship already exists
  let existing = await Friendship.findOne({
    sender: sender,
    reciever: reciever,
  });
  if (!existing) {
    req.flash("success", `${reciever.name} is not in your friendlist`);
    return res.json(200, {
      message: "Already removed",
      data: {
        code: 0,
      },
    });
  } else {
    //remove the friendship
    await Friendship.findOneAndRemove({
      sender: existing.sender,
      reciever: existing.reciever,
    });

    //remove from sender's and reciever's friendslist
    reciever.friends.pull(sender);
    sender.friends.pull(sender);
    reciever.save();
    sender.save();
    req.flash("success", `${reciever.name} removed from your friendlist`);
    return res.json(200, {
      message: "friend removed",
      data: {
        code: 0,
      },
    });
  }
};
