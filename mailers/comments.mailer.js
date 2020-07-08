const nodeMailer = require("../config/nodemailer");

exports.newComment = (comment) => {
  let htmlString = nodeMailer.renderTemplate(
    { comment: comment },
    "/comments/new_comment.mailer.ejs"
  );
  nodeMailer.transporter.sendMail(
    {
      from: "samartharora176@gmail.com",
      to: comment.user.email,
      subject: "New Comment",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("error in sending comment mail", err);
      }
      console.log(info);
    }
  );
};
