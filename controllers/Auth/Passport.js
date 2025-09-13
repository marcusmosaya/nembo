"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterSucesssCallBack = exports.TwitterFailureCallBack = exports.TwitterAuthToken = exports.LinkedInSuccessCallBack = exports.LinkedInFailureCallBack = exports.LinkedInAuthToken = exports.facebookSuccessCallBack = exports.facebookFailureCallBack = exports.facebookAuthToken = exports.googleSuccessCallBack = exports.googleFailureCallBack = exports.googleAuthToken = void 0;
const passport_1 = __importDefault(require("passport"));
const googleAuthToken = () => {
    passport_1.default.authenticate("google", { scope: ["profile", "email"] });
};
exports.googleAuthToken = googleAuthToken;
const googleFailureCallBack = () => {
    passport_1.default.authenticate("google", { failureRedirect: "/" });
};
exports.googleFailureCallBack = googleFailureCallBack;
const googleSuccessCallBack = (req, res) => {
    res.redirect("/profile");
};
exports.googleSuccessCallBack = googleSuccessCallBack;
const facebookAuthToken = () => {
    passport_1.default.authenticate("facebook", { scope: ["email"] });
};
exports.facebookAuthToken = facebookAuthToken;
const facebookFailureCallBack = () => {
    passport_1.default.authenticate("facebook", { failureRedirect: "/" });
};
exports.facebookFailureCallBack = facebookFailureCallBack;
const facebookSuccessCallBack = (req, res) => {
    res.redirect("/profile");
};
exports.facebookSuccessCallBack = facebookSuccessCallBack;
const LinkedInAuthToken = () => {
    passport_1.default.authenticate("linkedin");
};
exports.LinkedInAuthToken = LinkedInAuthToken;
const LinkedInFailureCallBack = () => {
    passport_1.default.authenticate("linkedin", { failureRedirect: "/" });
};
exports.LinkedInFailureCallBack = LinkedInFailureCallBack;
const LinkedInSuccessCallBack = (req, res) => {
    res.redirect("/profile");
};
exports.LinkedInSuccessCallBack = LinkedInSuccessCallBack;
const TwitterAuthToken = () => {
    passport_1.default.authenticate("twitter");
};
exports.TwitterAuthToken = TwitterAuthToken;
const TwitterFailureCallBack = () => {
    passport_1.default.authenticate("twitter", { failureRedirect: "/" });
};
exports.TwitterFailureCallBack = TwitterFailureCallBack;
const TwitterSucesssCallBack = (req, res) => {
    res.redirect("/profile");
};
exports.TwitterSucesssCallBack = TwitterSucesssCallBack;
