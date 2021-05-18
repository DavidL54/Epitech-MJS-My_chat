const controllerInvitation = require('../controller/controllerInvitation');

const checkAuth = require('../middleware/check-auth');

module.exports = (app) => {
  app.route('/invitation/')
    .post(checkAuth, controllerInvitation.createInvit)
    .delete(checkAuth, controllerInvitation.deleteInvit);
  app.route('/invitation/:id')
    .put(checkAuth, controllerInvitation.updateInvitState);
  app.route('/invitation/user/:id')
    .get(checkAuth, controllerInvitation.getAllInvitbyuser);
  app.route('/invitation/availablecreateroom')
    .get(checkAuth, controllerInvitation.getAvalaibleUserInvitRoomcreate);
  app.route('/invitation/availableupdateroom/:roomid')
    .get(checkAuth, controllerInvitation.getAvalaibleUserInvitRoomUpdate);
  app.route('/invitation/availableadmin/:id')
    .get(checkAuth, controllerInvitation.getAvalaibleUserInvitAdmin);
};
