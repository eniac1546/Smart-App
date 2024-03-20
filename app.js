"use strict";
require('dotenv').config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const morgan = require('morgan');
const path = require("path");
const auth = require('./auth'); // Handles Google OAuth
const SmartThingsAPI = require('./smartThings'); // Interacts with SmartThings API

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set("view engine", "ejs");
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

// Improved Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true, // Consider changing based on your session store behavior
    saveUninitialized: false, // Don't create session until something stored
    cookie: { secure: false, httpOnly: true }, // Set secure to true if using HTTPS
  }));

// Initialize Passport and authentication-related routes with debug logging
console.log("Initializing Passport...");
auth.initializePassport(app);

app.get("/auth/google", (req, res, next) => {
    console.log("Authenticating with Google...");
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  });
  
  app.get("/auth/google/callback", 
  passport.authenticate("google", { failureRedirect: "/login" }), 
  (req, res) => {
    console.log("Google authentication successful, checking SmartThings link...");
    if (req.session.smartThingsAccessToken) {
      console.log("SmartThings access token found, redirecting to initiate discovery...");
      res.redirect("/initiate-discovery");
    } else {
      console.log("No SmartThings access token found, redirecting to link SmartThings...");
      res.redirect("/auth/smartthings");
    }
});
app.get('/auth/smartthings', (req, res) => {
    console.log("Initiating SmartThings OAuth flow...");
    const state = auth.generateStateParameter();
    req.session.oauthState = state;
    const smartThingsAuthUrl = auth.getSmartThingsAuthUrl(state);
    res.redirect(smartThingsAuthUrl); // Redirect to SmartThings for authorization
    console.log("Smart things Oauth flow working, calling next callback...");
});
  // SmartThings OAuth callback route with detailed error logging
  app.get('/smartthings/oauth/callback', async (req, res) => {
    console.log("Received SmartThings OAuth callback...");
    const { code } = req.query;
    //new code
    if (req.query.error) {
      console.error("Error during SmartThings OAuth flow:", req.query.error);
      return res.status(400).send("OAuth Error: " + req.query.error);
  }
    console.log("Authorization code received:", code);
    try {
      const accessToken = await auth.exchangeCodeForSmartThingsToken(code);
      console.log("SmartThings access token obtained, storing in session...");
      //access token shown to console
      console.log(`Access Token: ${accessToken}`);
      req.session.smartThingsAccessToken = accessToken;
      res.redirect("/initiate-discovery");
    } catch (error) {
      console.error("Failed to exchange SmartThings code for access token:", error);
      res.redirect("/login");
    }
  });
  
// Route to initiate discovery in SmartThings with additional logging
app.get('/initiate-discovery', async (req, res) => {
    console.log("Initiating discovery in SmartThings...");
    if (!req.isAuthenticated() || !req.session.smartThingsAccessToken) {
      console.error('Unauthorized or SmartThings access token missing');
      return res.status(401).send('Unauthorized or SmartThings access token missing');
    }
  
    const smartThingsApi = new SmartThingsAPI(req.session.smartThingsAccessToken);
    try {
      const devices = await smartThingsApi.getDevices();
      console.log("Discovery successful, rendering devices...");
      res.render('discovery', { devices });
    } catch (error) {
      console.error("Error during SmartThings device discovery:", error);
      res.status(500).send("Error initiating device discovery process.");
    }
  });

// Logout route with session destruction for clean logout
app.get("/logout", (req, res) => {
    console.log("Logging out user...");
    req.logout(() => {
      req.session.destroy(() => {
        console.log("Session destroyed, redirecting to home...");
        res.redirect("/");
      });
    });
  });
  
  // Start the server with startup logging
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));