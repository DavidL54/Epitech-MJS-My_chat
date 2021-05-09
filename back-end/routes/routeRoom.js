const controllerRoom = require('../controller/controllerRoom');

const checkAuth = require('../middleware/check-auth');

module.exports = (app) => {
    app.route('/room')
        .get(checkAuth, controllerRoom.getAll)
        .post(checkAuth, controllerRoom.createRoom);
    app.route('/room/:id')
        .put(checkAuth, controllerRoom.updateRoom)
        .delete(checkAuth, controllerRoom.deleteRoom);

}