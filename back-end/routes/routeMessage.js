const controllerMessage = require('../controller/controllerMessage');

const checkAuth = require('../middleware/check-auth');

module.exports = (app) => {
    app.route('/message/')
        .get(checkAuth, controllerMessage.getLastGlobalMessage)
        .post(checkAuth, controllerMessage.createMessage)
        .delete(checkAuth, controllerMessage.deleteMessage);
    app.route('/message/:roomid')
        .get(checkAuth, controllerMessage.getLastTenMessage)
}