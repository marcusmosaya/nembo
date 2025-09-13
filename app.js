"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const itemRoutes_1 = __importDefault(require("./routes/itemRoutes"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const passport_1 = __importDefault(require("passport"));
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, 'views'));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(passport_1.default.initialize());
app.use('/items', itemRoutes_1.default);
app.get("/pane", (req, res, nexr) => {
    res.render("pane");
});
exports.default = app;
