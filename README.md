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

#### Instant Chat :
- Contact section with state of users : online(green) , in app (yellow) or disconnected (grey)
- Messages sections with message ( with sended date, number read ) and who is typing
- Room section where we can choose the room we want join or leave room
- Textarea who support Emoji
- Instant message refresh based on socket

![](https://github.com/DavidL54/Epitech-MJS-My_chat/blob/main/docimg/chat.png)

#### Export conversation :
You can export conversation in PDF and CSV files

![](https://github.com/DavidL54/Epitech-MJS-My_chat/blob/main/docimg/export.png)
