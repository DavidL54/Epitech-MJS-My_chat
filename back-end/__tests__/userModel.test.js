var mongoose = require("mongoose")
var mongoDB = "mongodb://127.0.0.1:27017/my_test_database"

mongoose.connect(mongoDB).then(r =>
    console.log("Successfully connected to the database")
)

const User = require("../models/modelUser")

describe("test", () => {
    beforeAll(async () => {
        await User.remove({});

    });

    afterEach(async () => {
        await User.remove({});
    });

    afterAll(async () => {
        await mongoose.connection.close()
    });


    it("has a module", () => {
        expect(User).toBeDefined();
    })
    describe("User testing", () => {

        const userTemplate = {
            email : "elian.nicaise54@gmail.com",
            password: 'PAPA',
            username: "elian",
            name: 'elian',
            firstname: 'papa',
            age: 19
        }
        it('gets a user', async () => {
            const user = new User(userTemplate)
            await user.save();

            const foundUser = await User.findOne({name: 'elian'})
            const excepted = 'elian'
            const actual = foundUser.name

            expect(actual).toEqual(excepted)
            //
        })
        it("save a user", async () => {
            const user = new User(userTemplate)
            const userSaved = await user.save()

            const excepted = 'papa'
            const actual = userSaved.firstname

            expect(actual).toEqual(excepted)

        })
        it('update a user', async () => {
            const user = new User(userTemplate)
            await user.save()

            user.name = "david"

            const updateUser = await user.save()

            const excepted = "david"
            const actual = updateUser.name
            expect(actual).toEqual(excepted)
        })
    })
});

