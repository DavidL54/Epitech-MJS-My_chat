# Welcome to D.E.scord !

D.E.scord is an Epitech project written in Javascript with NodeJS + ReactJS + MongoDB + RabbitMQ + SocketIO

The goal of the project is to develop a chat

![](https://github.com/DavidL54/Epitech-MJS-My_chat/blob/main/docimg/presentation.png)

#### Easy configuration file :
You can define your own config

```javascript
const  config  =  {
    "DBHost":  "mongodb://${mongourl}:27017/mychat",
    "RABBITURL":  "amqp://${rabbiturl}:5672?heartbeat=60",
    "GMAIL_USERNAME"  :  "",
    "GMAIL_PASSWORD":  "",
    "JWT_KEY":  "",
    "JWT_KEY_RESET":  "",
    "FRONT_URL":  'http://127.0.0.1:3000',
    "JOIN_ROOM_TOKEN_EXPIRATION":  '7d',
    "LOGIN_TOKEN_EXPIRATION":  '90d',
    "RESET_PASS_TOKEN_EXPIRATION":  '24h',
    "DELAY_BEFORE_NEXT_MAIL":  60,  //delay in minutes (int)
}
```

#### Smart Mail sending scheduled with Agenda :

![](https://github.com/DavidL54/Epitech-MJS-My_chat/blob/main/docimg/email.png)
