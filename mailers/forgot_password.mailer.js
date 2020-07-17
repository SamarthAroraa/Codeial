const nodeMailer = require("../config/nodemailer");

//change when deploying to production
const DOMAIN = "http://localhost:8000";

module.exports.sendLink = function (reset) {
  let link = DOMAIN + "/users/reset-page/" + reset.accessToken;

  let htmlString = nodeMailer.renderTemplate(
    { user: reset.user, link: link, isvalid: reset.isvalid },
    "/reset-password/reset-password.ejs"
  );
  nodeMailer.transporter.sendMail(
    {
      from: "samartharora176@gmail.com",
      to: reset.user.email,
      subject: "RESET PASSWORD",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("error in sending reset mail", err);
      }
      console.log(info);
    }
  );
  console.log(link);
  console.log(reset);
};
