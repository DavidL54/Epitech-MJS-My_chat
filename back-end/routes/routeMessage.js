const controllerMessage = require('../controller/controllerMessage');
const checkAuth = require('../middleware/check-auth');

module.exports = (app) => {
  app.route('/message/')
    .post(checkAuth, controllerMessage.createMessage)
    .delete(checkAuth, controllerMessage.deleteMessage);
  app.route('/message/:roomid')
    .get(checkAuth, controllerMessage.getLastTenMessage);
};
