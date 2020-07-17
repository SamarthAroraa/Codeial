const queue = require("../config/kue");
const resetPassMailer = require("../mailers/forgot_password.mailer");

queue.process("ResetEmail", (job, done) => {
  console.log("Reset Pass mailer is processing the job", job.data);
  resetPassMailer.sendLink(job.data);
  done();
});

module.export = queue;
