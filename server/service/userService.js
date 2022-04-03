const axios = require('axios');
const qs = require('qs');
const dotenv = require('dotenv');
dotenv.config();
const { FilterQuery } = require('mongoose');

module.exports = async function getGoogleOAuthTokens({ code }) {
  const url = 'https://oauth2.googleapis.com/token';

  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECTURL,
    grant_type: 'authorization_code',
  };
  console.log({ values });

  try {
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return res.data;
  } catch (error) {
    console.error(error.response.data.error);
    log.error(error, 'Failed to fetch Google Oauth Tokens');
    throw new Error(error.message);
  }
};

module.exports = async function getGoogleUser({ id_token, access_token }) {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    // console.log(res.data);
    return res.data;
  } catch (error) {
    log.error(error, 'Error fetching Google user');
    throw new Error(error.message);
  }
};

// export async function findAndUpdateUser(
//   query: FilterQuery,
//   update: UpdateQuery,
//   options: QueryOptions = {}
// ) {
//   return UserModel.findOneAndUpdate(query, update, options);
// }
