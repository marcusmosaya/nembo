"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_linkedin_oauth2_1 = require("passport-linkedin-oauth2");
passport_1.default.use(new passport_linkedin_oauth2_1.Strategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: process.env.LINKEDIN_CALLBACK_URL,
    scope: ['r_liteprofile', 'r_emailaddress'],
}, async (accessToken, refeshToken, profile, done) => {
    done(null, profile);
}));
