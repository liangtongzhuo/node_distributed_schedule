"use strict";

var options = {
  prefix: "w",
  skipConfig: false,
  redis: {
    port: 6379,
    host: "127.0.0.1"
  },
  restore: true
};
//dependencies
const moment = require("moment");
const kue = require("kue-scheduler");
const Queue = kue.createQueue(options);

//processing jobs
Queue.process("unique_every", function(job, done) {
  console.log(
    "\nProcessing job with id %s at %s",
    job.id,
    moment().format("YYYY-MM-DD HH:mm:ss")
  );
  done();
});

const job = Queue.createJob("unique_every", {
  })
  .attempts(1)
  .backoff({
    delay: 60000,
    type: "fixed"
  })
  .priority("normal")
  .unique("unique_every");

//schedule a job then
Queue.every("5 seconds", job);

//listen on scheduler errors
Queue.on("schedule error", function(error) {
  console.log(error);
});
