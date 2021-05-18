
const istest = false;

const mongourl = istest ? '127.0.0.1' : 'mongo';
const rabbiturl = istest ? '127.0.0.1' : 'rabbitmq';

const config = {
	"DBHost": `mongodb://${mongourl}:27017/mychat`,
	"GMAIL_USERNAME" : "d.e.scord5499@gmail.com",
	"GMAIL_PASSWORD": "d.e.p4$5W0rd549998",
	"RABBITURL": `amqp://${rabbiturl}:5672?heartbeat=60`,
	"JWT_KEY": "secret",
	"JWT_KEY_RESET": "secret1234",
}

module.exports = config;
