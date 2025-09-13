"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Passport_1 = require("../controllers/Auth/Passport");
const router = (0, express_1.Router)();
//THIRD-PARTY AUTHENTICATION.
//google
router.get("/google", Passport_1.googleAuthToken);
router.get("/google/callback", Passport_1.googleFailureCallBack, Passport_1.googleSuccessCallBack);
//facebook
router.get("/facebook", Passport_1.facebookAuthToken);
router.get("/facebook/callback", Passport_1.facebookFailureCallBack, Passport_1.facebookSuccessCallBack);
//linkedin
router.get("/linkedin", Passport_1.LinkedInAuthToken);
router.get("/linkedin/callback", Passport_1.LinkedInFailureCallBack, Passport_1.LinkedInSuccessCallBack);
//twitter
router.get("/twitter", Passport_1.TwitterAuthToken);
router.get("/twitter/callback", Passport_1.TwitterFailureCallBack, Passport_1.TwitterSucesssCallBack);
//HOMEAUTHENTICATION.
router.post("/register");
router.post("/login");
router.post("/change-password");
router.post("/validate");
router.post("/forgot-password");
//Pages
router.get("/register");
router.get("/login");
router.get("/validate");
router.get("/change-password");
