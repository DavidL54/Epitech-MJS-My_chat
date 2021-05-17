
const UserHistory = require('../models/modelUserHistory');
const moment = require('moment');
const Token = require('../models/modelToken');
const crypto = require('crypto');
let task = require('./controllerTask');

async function setNewhistory(userid, type) {
  const history = new UserHistory({ userid, historyType: type });
  await history.save();
}

async function createTaskMail(date, to, subject, content) {
  task.schedule(
    date,
    "sendMail",
    { to, subject, content}
  );
}

async function getNextDateTask(userid, type) {
  const currtime = moment(new Date(Date.now())).toDate();
  const oldtime = moment(new Date(Date.now())).subtract(1, 'h').toDate();
  let res = await UserHistory.find({
    $and: [{ userid }, {
      created_at: {
        $gte: oldtime,
        $lt: currtime,
      }
    }, {
      historyType: type
    }]
  }).lean().exec();
  if (res.length === 0)
    return currtime
  else if (res.length === 1)
    return moment(res[res.length - 1].created_at).add(1, 'h').toDate();
  else
    return null;
}

exports.forgotpass = async (user, token) => {
  const date = await getNextDateTask(user._id, 'recover')

  if (date !== null) {
    createTaskMail(
      date,
      user.email,
      'Reset Password Link',
      'Hello ' + user.name + ',\n\n' + 'Please click on given link to reset your password: \nhttp:\/\/' + '127.0.0.1:3000' +
      '\/user\/resetpassword\/' + token + '\n\nThank You!\n');
  }
  setNewhistory(user._id, 'recover');
}


exports.accountverification = async (user) => {
  const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
  token.save()
  const date = await getNextDateTask(user._id, 'confirm')

  if (date !== null) {
    createTaskMail(
      date,
      user.email,
      'Account Verification Link',
      'Hello ' + user.name + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + '127.0.0.1:3000' +
      '\/user\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n');
  }
  setNewhistory(user._id, 'confirm');

}

exports.accountLogin = async (user) => {


  const date = await getNextDateTask(user._id, 'login')

  if (date !== null) {
    createTaskMail(
      date,
      user.email,
      'Account Login',
      'Hello ' + user.name + ',\n\n' + 'You have been correctly identified\n\nThank You!\n');
  }
  setNewhistory(user._id, 'login');
}

exports.joinroom = async (inv, room, token) => {

  const date = await getNextDateTask(inv.value, 'roominvit')

  if (date !== null) {
    createTaskMail(
      date,
      `D.E.scord <${inv.email}>`,
      'Invitation to join room',
      'Hello ' + inv.label + ',\n\n' + 'You\'re invited to join room' + room.name + '\n\n'
      + 'Please click on given link to reset your password: \nhttp:\/\/' + '127.0.0.1:3000' +
      '\/contact\/invitation\/' + token + '\n\nThank You!\n');
  }
  setNewhistory(inv.value, 'roominvit');
}