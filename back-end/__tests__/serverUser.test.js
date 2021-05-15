const server = require('../server') // Link to your server file

const superTest = require('supertest')
const request = superTest(server.server)

const {setUp} = require('../setUp')
setUp(server.mongoose)


const jwt = require('jsonwebtoken')
const config = require('../config')

const User = require('../models/modelUser')

const userTemplate = {
    email: "elian.nicaise54@gmail.com",
    password: 'PAPA',
    username: "elian",
    name: 'elian',
    firstname: 'papa',
    age: 19,
}

describe("User routes", () => {
    describe("Sign UP route", () => {

        it('SignUp', async done => {
            const res = await request.post('/user/signup')
                .send(userTemplate)
            expect(res.status).toEqual(201)
            expect(res.body).toEqual({message: 'User created'})

            done()
        })
        it('Sign UP with the same mail adress', async done => {
            const res = await request.post('/user/signup')
                .send(userTemplate)
            expect(res.status).toEqual(201)
            expect(res.body).toEqual({message: 'User created'})

            const resFake = await request.post('/user/signup')
                .send(userTemplate)

            expect(resFake.status).toEqual(409)
            expect(resFake.body).toEqual("Mail exists")

            done()
        })
        it('Sign UP with the same username', async done => {
            const res = await request.post('/user/signup')
                .send(userTemplate)
            expect(res.status).toEqual(201)
            expect(res.body).toEqual({message: 'User created'})
            userTemplate.email = "test@gmail.com"

            const resFake = await request.post('/user/signup')
                .send(userTemplate)

            expect(resFake.status).toEqual(409)
            expect(resFake.body).toEqual("Username exists")

            done()
        })
    })
    describe("Login In route", () => {

        const loginTemplate = {
            username: "elian",
            password: "PAPA"
        }

        it('SignUp', async done => {
            const req = await request.post('/user/signup')
                .send(userTemplate)
            const user = await User.find({"$or": [{email: loginTemplate.username}, {username: loginTemplate.username}]})

            user[0].active = true
            await user[0].save()

            const res = await request.post('/user/login')
                .send(loginTemplate)

            expect(res.status).toEqual(200)
            expect(res.body.message).toEqual("OK")

            done()
        })

        it('Sign Up wrong pass', async done => {
            loginTemplate.password = "ll"
            const req = await request.post('/user/signup')
                .send(userTemplate)
            const res = await request.post('/user/login')
                .send(loginTemplate)

            expect(res.status).toEqual(401)
            expect(res.body).toEqual("Wrong Password")
            done()
        })
        it('Sign Up user doesn t exist', async done => {
            const req = await request.post('/user/signup')
                .send(userTemplate)
            const res = await request.post('/user/login').send({username: "paperer43545"})

            expect(res.status).toEqual(404)
            expect(res.body).toEqual("User doesn\'t exist")
            done()
        })
    });

    describe('Delete user', () => {

        const loginTemplate = {
            username: "elian",
            password: "PAPA"
        }

        it('Remove User', async done => {
            const req = await request.post('/user/signup')
                .send(userTemplate)
            const user = await User.find({"$or": [{email: loginTemplate.username}, {username: loginTemplate.username}]})

            user[0].active = true
            await user[0].save()

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
        const loginTemplate = {
            username: "elian",
            password: "PAPA"
        }
        it('Create Room', async done => {
            const req = await request.post('/user/signup')
                .send(userTemplate)
            const user = await User.find({"$or": [{email: loginTemplate.username}, {username: loginTemplate.username}]})

            user[0].active = true
            await user[0].save()

            const res = await request.post('/user/login')
                .send(loginTemplate)
            const token = res.body.token

            const decoded = jwt.verify(token, config.JWT_KEY);

            const create = await request.post('/room')
                .set('authorization', `Bearer ${token}`)
                .send({roomAdmin: decoded.userId, name: 'test'})

            console.log(create)

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
});

