
const config = require('../config');
let Agenda = require("agenda");
const sendMail = require('../middleware/sendMail')

let task = new Agenda({ db: { address: config.DBHost, collection: 'tasks' } });

task.define("sendMail", (job, done) => {
  sendMail(job.attrs.data.to, job.attrs.data.subject, job.attrs.data.content);
  done();
})

task.on('ready', async () => await task.start());

let graceful = () => {
  task.stop(() => process.exit(84));
}

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);

module.exports = task;