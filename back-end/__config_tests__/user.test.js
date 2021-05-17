// const app = require('../server.js') // Link to your server file
//
// const superTest = require('supertest')
// const request = superTest(app)
//
// const User = require('../models/modelUser.js')
//
// const { setupDB } = require('../setUp.js')
//
//
//
// setupDB("testing")
//
// describe("User routes", () => {
//     it('Should save user to database', async done => {
//         const res = await request.post('/signup')
//             .send({
//                 name: 'Zell',
//                 email: 'testing@gmail.com'
//             })
//         // const user = await User.findOne({ email: 'testing@gmail.com' })
//         // expect(user.name).toBeTruthy()
//         // expect(user.email).toBeTruthy()
//         console.log(res.body)
//         // expect(res).toEqual({
//         //     status: "success",
//         //     stateInfo: {
//         //         state: "AL",
//         //         capital: "Montgomery",
//         //         governor: "Kay Ivey",
//         //     },
//         // });
//         done()
//     })
// });
// // it('Should save user to database', async done => {
// //     const res = await request.post('/signup')
// //         .send({
// //             name: 'Zell',
// //             email: 'testing@gmail.com'
// //         })
// //     done()
// // })
