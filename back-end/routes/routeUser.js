const controllerUser = require('../controller/controllerUser');
const checkAuth = require('../middleware/check-auth');

module.exports = (app) => {
  app.route('/user')
    .get(checkAuth, controllerUser.getAll);
  app.route('/user/signup')
    .post(controllerUser.signup);
  app.route('/user/login')
    .post(controllerUser.login);
  app.route('/user/newlink')
    .get(controllerUser.generateLink);
  app.route('/user/:userId')
    .delete(checkAuth, controllerUser.deleteUser);
  app.route('/user/room/:id')
    .get(controllerUser.getUserByRoom);
  app.route('/user/forgotpassword')
    .put(controllerUser.forgotpass);
  app.route('/user/resetpassword/:token')
    .post(controllerUser.resetPass);
  app.route('/user/confirmation/:email/:token')
    .get(controllerUser.confirmEmailToken);
};
