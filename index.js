const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MONGO_IP, MONGO_PASSWORD, MONGO_PORT, MONGO_USER, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');


// Setting up Redis as Session Store
const session = require('express-session');
let RedisStore = require('connect-redis')(session);

const { createClient } = require('redis');
let redisClient = createClient({
  url: `redis://${REDIS_URL}:${REDIS_PORT}`,
  legacyMode: true
});
// The next line is necessary for redis@v4
redisClient.connect().catch(console.error);

const app = express();
app.enable('trust proxy');
app.use(cors({}));
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
const connectWithTries = (numOfTrials = 3) => {
  if (numOfTrials < 1) {
    console.log('Multiple tries to connect to mongoDB has failed.');
    return;
  }
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('Successfully connected to mongoDB.'))
    .catch(err => {
      console.log('Initiating connection to mongoDB has failed.');
      setTimeout(() => {
        connectWithTries(numOfTrials - 1)
       }, 2000);
    });
}

connectWithTries();

// Add Redis session to express
app.use(session({
  store: new RedisStore({client: redisClient}),
  secret: SESSION_SECRET,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 3000000
  },
  resave: false,
  saveUninitialized: false
}));

const port = process.env.PORT || 4000;
app.set('port', port);

app.get('/api/v1', (req, res, next) => {
  res.send('<H1> This is the beginning of my nodejs server 7 </h1>');
  console.log('Node app server has responded.');
});

app.use(express.json());
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);

app.listen(port, () => console.log(`Server listening on port ${port}.`));
