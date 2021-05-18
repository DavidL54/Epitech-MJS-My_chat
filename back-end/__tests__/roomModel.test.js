const mongoose = require('mongoose');

const mongoDB = 'mongodb://127.0.0.1:27017/my_test_database_room';

mongoose.connect(mongoDB).then(() => console.log('Successfully connected to the database'));

const Room = require('../models/modelRoom');
const User = require('../models/modelUser');

const templates = require('../__config_tests__/templates');

describe('test', () => {
  beforeAll(async () => {
    await Room.remove({});
    await User.remove({});
  });

  afterEach(async () => {
    await Room.remove({});
    await User.remove({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('has a module', () => {
    expect(Room).toBeDefined();
  });
  describe('Room testing', () => {
    const { userTemplate } = templates;
    const { roomTemplate } = templates;

    it('gets a room', async () => {
      const user = new User(userTemplate);
      await user.save();

      roomTemplate.roomAdmin = user._id;
      roomTemplate.allowUser = user._id;

      const room = new Room(roomTemplate);
      await room.save();

      const foundRoom = await Room.findOne({ name: 'elian' });
      const excepted = 'elian';
      const actual = foundRoom.name;

      expect(actual).toEqual(excepted);
      //
    });
    it('save a room', async () => {
      const room = new Room(roomTemplate);
      const roomSaved = await room.save();

      // console.log(roomSaved)
      const excepted = 'elian';
      const actual = roomSaved.name;

      expect(actual).toEqual(excepted);
    });
    it('update a room', async () => {
      const room = new Room(roomTemplate);
      await room.save();

      room.name = 'david';

      const updateRoom = await room.save();

      const excepted = 'david';
      const actual = updateRoom.name;
      expect(actual).toEqual(excepted);
    });
  });
});
