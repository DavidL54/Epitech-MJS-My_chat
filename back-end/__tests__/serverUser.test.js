const server = require('../server') // Link to your server file

const superTest = require('supertest')
const request = superTest(server.server)

const {setUp} = require('../__config_tests__/setUp')
setUp(server.mongoose)


const jwt = require('jsonwebtoken')
const config = require('../config')

const User = require('../models/modelUser')
const Room = require('../models/modelRoom')

const templates = require('../__config_tests__/templates')

const userTemplate = templates.userTemplate


async function createUser(loginTemplate, userTemplate) {
    const req = await request.post('/user/signup')
        .send(userTemplate)
    const res = await request.post('/user/login').send(loginTemplate)

    return res
}

async function createActiveUser(loginTemplate) {
    const req = await request.post('/user/signup')
        .send(userTemplate)
    const user = await User.find({"$or": [{email: loginTemplate.username}, {username: loginTemplate.username}]})

    user[0].active = true
    await user[0].save()

    return user[0]
}

async function createRoom(loginTemplate) {
    await createActiveUser(loginTemplate)

    const res = await request.post('/user/login')
        .send(loginTemplate)
    const token = res.body.token

    const decoded = jwt.verify(token, config.JWT_KEY);

    const create = await request.post('/room')
        .set('authorization', `Bearer ${token}`)
        .send({roomAdmin: decoded.userId, name: 'test'})

    return { room : create, decoded: decoded, token: token}
}


describe("User routes", () => {
    describe("Sign UP route", () => {

        it('SignUp', async done => {
            const res = await request.post('/user/signup')
                .send(userTemplate)
            expect(res.status).toEqual(201)
            expect(res.body).toEqual({message: 'A confirmation email has been sent.Please click on the link in it to confirm your account'})

            done()
        })
        it('Sign UP with the same mail adress', async done => {
            const res = await request.post('/user/signup')
                .send(userTemplate)
            expect(res.status).toEqual(201)
            expect(res.body).toEqual({message: 'A confirmation email has been sent.Please click on the link in it to confirm your account'})

            const resFake = await request.post('/user/signup')
                .send(userTemplate)

            expect(resFake.status).toEqual(409)
            expect(resFake.body).toEqual("It seems this account already exists. Do you want to recover your password ?")

            done()
        })

        it('Sign UP with the same username', async done => {
            const res = await request.post('/user/signup')
                .send(userTemplate)
            expect(res.status).toEqual(201)
            expect(res.body).toEqual({message: 'A confirmation email has been sent.Please click on the link in it to confirm your account'})
            userTemplate.email = "test@gmail.com"

            const resFake = await request.post('/user/signup')
                .send(userTemplate)

            expect(resFake.status).toEqual(409)
            expect(resFake.body).toEqual("It seems this account already exists. Do you want to recover your password ?")

            done()
        })
    })
    describe("Login In route", () => {

        const loginTemplate = templates.loginTemplate

        it('SignUp', async done => {
            await createActiveUser(loginTemplate)

            const res = await request.post('/user/login')
                .send(loginTemplate)

            expect(res.status).toEqual(200)
            expect(res.body.message).toEqual("OK")

            done()
        })

        it('Sign Up wrong pass', async done => {
            loginTemplate.password = "ll"
            const res = await createUser(loginTemplate, userTemplate)

            expect(res.status).toEqual(401)
            expect(res.body).toEqual("The credential you provided do not match.Do you want to recover your password")
            done()
        })
        it('Sign Up user doesn t exist', async done => {
            const res = await createUser({username: "paperer43545"}, userTemplate)

            expect(res.status).toEqual(404)
            expect(res.body).toEqual("The credential you provided do not match.Do you want to recover your password")
            done()
        })
    });
    describe('Deleted user', () => {

        const loginTemplate = templates.loginTemplate

        it('Remove User', async done => {

            loginTemplate.password = "PAPA"
            await createActiveUser(loginTemplate)

            const res = await request.post('/user/login')
                .send(loginTemplate)
            const token = res.body.token
            const decoded = jwt.verify(token, config.JWT_KEY);
            const remove = await request.delete(`/user/${decoded.userId}`)
                .set('authorization', `Bearer ${token}`)

            expect(remove.status).toEqual(200)
            expect(remove.body.message).toEqual("User deleted")

            done()
        })
    })
});

describe("Room routes", () => {
    describe("Get room", () => {
        it('Create Room', async done => {
            const create = await createRoom(templates.loginTemplate)

            expect(create.room.body.name).toEqual("test")
            expect(create.room.body.roomAdmin).toEqual(create.decoded.userId)
            expect(create.room.body.allowUser).toEqual([])
            done()
        })
        it('Create Room exists', async done => {
            const create = await createRoom(templates.loginTemplate)
            const createTwo = await createRoom(templates.loginTemplate)

            expect(createTwo.room.status).toEqual(409)
            expect(createTwo.room.body).toEqual("Room exists")
            done()
        })

        // it('Sign UP with the same mail adress', async done => {
        //     const res = await request.post('/user/signup')
        //         .send(userTemplate)
        //     expect(res.status).toEqual(201)
        //     expect(res.body).toEqual({message: 'User created'})
        //
        //     const resFake = await request.post('/user/signup')
        //         .send(userTemplate)
        //
        //     expect(resFake.status).toEqual(409)
        //     expect(resFake.body).toEqual("Mail exists")
        //
        //     done()
        // })
    })
    describe('Deleted room', () => {
        it( 'Delete Room', async done => {
            const create = await createRoom((templates.loginTemplate))
            const findRoomBefore = await Room.find({})

            expect(findRoomBefore.length).toEqual(1)

            const deleteRoom = await request.delete(`/room/${create.room.body._id}`)
                .set('authorization', `Bearer ${create.token}`)
            const findRoomAfter = await Room.find({})

            expect(deleteRoom.status).toEqual(200)
            expect(findRoomAfter.length).toEqual(0)
            done()
        })

        it( 'Delete Room doesn t exist', async done => {
            const create = await createRoom((templates.loginTemplate))
            const deleteRoom = await request.delete(`/room/123456`)
                .set('authorization', `Bearer ${create.token}`)

            expect(deleteRoom.status).toEqual(400)

            done()
        })

    })

    describe('Get Room by user', () => {
        it( 'get Room', async done => {
            const create = await createRoom((templates.loginTemplate))
            const getRoom = await request.get(`/room/user/${create.decoded.userId}`)
                .set('authorization', `Bearer ${create.token}`)

            console.log(create.decoded.userId, getRoom.body[0]._id)
            // expect(create.decode.userId).toEqual(getRoom.body[0]._id)
            // answers quentin
            // expect(create.decoded.userId).toEqual(400)

            done()
        })
        it( 'getallow  Room', async done => {
            const create = await createRoom((templates.loginTemplate))
            const getRoom = await request.get(`/room/allow/user/${create.decoded.userId}`)
                .set('authorization', `Bearer ${create.token}`)

            console.log(create.room.body._id, getRoom.body[0]._id)
            const tmp = create.room.body._id
            // expect(tmp).toEqual("test")
            // expect(create.decode.userId).toEqual(getRoom.body[0]._id)
            // answers quentin
            // expect(create.decoded.userId).toEqual(400)

            done()
        })

    })
});

