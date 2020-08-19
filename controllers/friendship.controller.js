const User = require("../models/user");
const Friendship = require("../models/friendships");

module.exports.add = async function (req, res) {
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
  let crossExisting = await Friendship.findOne({
    sender: reciever,
    reciever: sender,
  });

  if (existing || crossExisting) {
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
    reciever.friends.push(friendship);
    reciever.save();
    sender.friends.push(friendship);
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
  let crossExisting = await Friendship.findOne({
    sender: reciever,
    reciever: sender,
  });
  
  if (!existing && !crossExisting) {
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
    await Friendship.findOneAndRemove({
      sender: existing.reciever,
      reciever: existing.sender,
    });

    //remove from sender's and reciever's friendslist
    reciever.friends.pull(existing);
    sender.friends.pull(existing);
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
