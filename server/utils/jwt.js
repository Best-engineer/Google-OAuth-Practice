const jwt = require('jsonwebtoken');
require('dotenv').config();

const privateKey = process.env.privateKey;

module.exports = function signJwt(data) {
  return jwt.sign(data, privateKey, {
    expiresIn: '30d',
    algorithm: 'RS256',
  });
};
