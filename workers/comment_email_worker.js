const queue = require("../config/kue");
const commentsMailer = require("../mailers/comments.mailer");

queue.process("Email", (job, done) => {
  commentsMailer.newComment(job.data);
  done();
});

module.export = queue;