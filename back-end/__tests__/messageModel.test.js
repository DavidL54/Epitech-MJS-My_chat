const mongoose = require('mongoose');

const mongoDB = 'mongodb://127.0.0.1:27017/my_test_database_room';

mongoose.connect(mongoDB).then(() => console.log('Successfully connected to the database'));

const Room = require('../models/modelRoom');
const User = require('../models/modelUser');
const Message = require('../models/modelMessage');

const templates = require('../__config_tests__/templates');

async function createUserAndRoom(userTemplate, roomTemplate) {
  const user = new User(userTemplate);
  await user.save();

  roomTemplate.roomAdmin = user._id;
  roomTemplate.allowUser = user._id;

  const room = new Room(roomTemplate);
  await room.save();

  return { user, room };
}

describe('test', () => {
  beforeAll(async () => {
    await Room.remove({});
    await User.remove({});
    await Message.remove({});
  });

  afterEach(async () => {
    await Room.remove({});
    await User.remove({});
    await Message.remove({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('has a module', () => {
    expect(Room).toBeDefined();
    expect(User).toBeDefined();
    expect(Message).toBeDefined();
  });
  describe('Message testing', () => {
    const { userTemplate } = templates;
    const { roomTemplate } = templates;

    it('save a message', async () => {
      const userRoom = await createUserAndRoom(userTemplate, roomTemplate);

      const message = new Message(
        {
          sender: userRoom.user._id,
          roomid: userRoom.room._id,
          idmsg: '1',
          message: 'je suis un message pour dadou',
        },
      );
      const messageSaved = await message.save();

      expect(messageSaved.message).toEqual('je suis un message pour dadou');
      expect(messageSaved.idmsg).toEqual('1');
      expect(messageSaved.roomid).toEqual(userRoom.room._id);
    });
    it('get a message', async () => {
      const userRoom = await createUserAndRoom(userTemplate, roomTemplate);

      const message = new Message(
        {
          sender: userRoom.user._id,
          roomid: userRoom.room._id,
          idmsg: '2',
          message: 'je suis un message pour dadou',
        },
      );
      await message.save();
      const foundMessage = await Message.findOne({ idmsg: '2' });
      const idExcepted = '2';
      expect(idExcepted).toEqual(foundMessage.idmsg);
    });
    it('update a message', async () => {
      const userRoom = await createUserAndRoom(userTemplate, roomTemplate);

      const message = new Message(
        {
          sender: userRoom.user._id,
          roomid: userRoom.room._id,
          idmsg: 2,
          message: 'je suis un message pour dadou',
        },
      );
      await message.save();
      message.message = 'PAPA est cool';

      const updateMessage = await message.save();

      const excepted = 'PAPA est cool';
      const actual = updateMessage.message;
      expect(actual).toEqual(excepted);
    });
  });
});
