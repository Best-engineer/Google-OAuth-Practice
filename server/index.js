const express = require('express');
const app = express();
const cors = require('cors');
const googleOauthHandler = require('./controller/sessionController');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: process.env.origin,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
  })
);
console.log('돌아가니? ');
app.get('/api/sessions/oauth/google', googleOauthHandler);

app.listen(PORT, () => console.log(` Listening on port ${PORT} `));

module.exports = app;
