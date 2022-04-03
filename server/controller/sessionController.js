const {
  getGoogleOAuthTokens,
  getGoogleUser,
} = require('../service/userService');
const signJwt = require('../utils/jwt');
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const log = require('../utils/logger');

// const accessTokenCookieOptions = {
//   maxAge: 900000, // 15 mins
//   httpOnly: true,
//   domain: 'localhost',
//   path: '/',
//   sameSite: 'lax',
//   secure: false,
// };

// const refreshTokenCookieOptions = {
//   ...accessTokenCookieOptions,
//   maxAge: 3.154e10, // 1 year
// };

module.exports = async function googleOauthHandler(req, res) {
  // get the code from qs
  const code = req.query.code;

  try {
    // get the id and access token with the code
    const { id_token, access_token } = await getGoogleOAuthTokens({ code });
    console.log({ id_token, access_token });

    // get user with tokens
    const googleUser = await getGoogleUser({
      id_token,
      access_token,
    });
    // jwt.decode(id_token);
    console.log(googleUser);

    console.log({ googleUser });

    if (!googleUser.verified_email) {
      return res.status(403).send('Google account is not verified');
    }

    // upsert the user
    const user = await findAndUpdateUser(
      {
        email: googleUser.email,
      },
      {
        email: googleUser.email, // 유저 이메일이 없을경우 create
        name: googleUser.name,
        picture: googleUser.picture,
      },
      {
        upsert: true,
        new: true, // 업데이트된 유저의 new document를  리턴한다
      }
    );

    // create a session
    // user-agent : 어디서 또는 어떤 브라우저가 로그인 했는지 알 수 잇음
    const session = await createSession(user._id, req.get('user-agent') || '');

    // create an access token
    const accessToken = signJwt(
      { ...user.toJSON(), session: session._id },
      { expiresIn: process.env.accessTokenTtl } // 15 minutes
    );

    // create a refresh token
    const refreshToken = signJwt(
      { ...user.toJSON(), session: session._id },
      { expiresIn: process.env.refreshTokenTtl } // 1 year
    );

    // set cookies
    res.cookie('accessToken', accessToken, {
      maxAge: 900000, // 15 mins
      httpOnly: true,
      domain: process.env.domain,
      path: '/',
      sameSite: 'lax',
      secure: false,
    });

    res.cookie('refreshToken', refreshToken, {
      maxAge: 3.154e10, // 1 year
      httpOnly: true,
      domain: process.env.domain,
      path: '/',
      sameSite: 'lax',
      secure: false,
    });

    // redirect back to client
    res.redirect(process.env.origin);
  } catch (error) {
    log.error(error, 'Failed to authorize Google user');
    return res.redirect(`${process.env.origin}/oauth/error`);
  }
};
