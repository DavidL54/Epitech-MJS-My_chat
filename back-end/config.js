
const istest = false;

const mongourl = istest ? '127.0.0.1' : 'mongo';
const rabbiturl = istest ? '127.0.0.1' : 'rabbitmq';

const config = {
	"DBHost": `mongodb://${mongourl}:27017/mychat`,
	"RABBITURL": `amqp://${rabbiturl}:5672?heartbeat=60`,
	"GMAIL_USERNAME" : "d.e.scord5499@gmail.com",
	"GMAIL_PASSWORD": "d.e.p4$5W0rd549998",
	"JWT_KEY": "secret",
	"JWT_KEY_RESET": "secret1234",
	"FRONT_URL": 'http://127.0.0.1:3000',
	"JOIN_ROOM_TOKEN_EXPIRATION": '7d',
	"LOGIN_TOKEN_EXPIRATION": '90d',
	"RESET_PASS_TOKEN_EXPIRATION": '24h',
	"DELAY_BEFORE_NEXT_MAIL": 60, //delay in minutes (int) 
}

module.exports = config;
