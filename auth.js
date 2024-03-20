// auth.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs'); // Add this at the top of your auth.js file

exports.initializePassport = function (app) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    (accessToken, refreshToken, profile, cb) => {
      // Here, you would typically find or create the user in your database
      cb(null, profile);
    }
  ));

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });

  app.use(passport.initialize());
  app.use(passport.session());
};

exports.generateStateParameter = function () {
  return crypto.randomBytes(16).toString('hex');
};

exports.getSmartThingsAuthUrl = function (state) {
  return 'https://api.smartthings.com/oauth/authorize?' + new URLSearchParams({
    response_type: 'code',
    client_id: process.env.ST_CLIENT_ID,
    scope: 'r:devices:* w:devices:*', 
    redirect_uri: process.env.ST_REDIRECT_URI,
    state: state,
  }).toString();
};

exports.exchangeCodeForSmartThingsToken = async function (code) {
    console.log("Exchanging code for SmartThings token..."); // Debug log
  try {
    const response = await axios.post('https://api.smartthings.com/oauth/token', {
      client_id: process.env.ST_CLIENT_ID,
      client_secret: process.env.ST_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.ST_REDIRECT_URI,
    });
    console.log("Access token obtained: ", response.data.access_token); // Debug log

    // Save the response data to st_payload.json
    fs.writeFile('st_payload.json', JSON.stringify(response.data, null, 2), (err) => {
        if (err) {
            console.error("Error writing file:", err);
        } else {
            console.log("Saved payload data to st_payload.json");
        }
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Failed to exchange code for SmartThings token:", error);
    throw error;
  }
};