const queue = require("../config/kue");
const commentsMailer = require("../mailers/comments.mailer");

queue.process("Email", (job, done) => {
  console.log("Comments mailer is processing the job");
  commentsMailer.newComment(job.data);
  done();
});

module.export = queue;