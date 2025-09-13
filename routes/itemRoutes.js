"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const itemController_1 = require("../controllers/itemController");
const router = (0, express_1.Router)();
router.get('/', itemController_1.getItems);
router.post('/', itemController_1.createItem);
exports.default = router;
