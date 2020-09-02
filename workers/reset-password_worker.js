const queue = require("../config/kue");
const resetPassMailer = require("../mailers/forgot_password.mailer");

queue.process("ResetEmail", (job, done) => {
  resetPassMailer.sendLink(job.data);
  done();
});

module.export = queue;
