"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItems = exports.createItem = void 0;
const item_1 = require("../models/item");
const createItem = (req, res, next) => {
    try {
        const { name } = req.body;
        const newItem = { id: Date.now(), name };
        item_1.items.push(newItem);
        res.status(201).json(newItem);
    }
    catch (error) {
        next(error);
    }
};
exports.createItem = createItem;
const getItems = (req, res, next) => {
    try {
        res.json(item_1.items);
    }
    catch (error) {
        next(error);
    }
};
exports.getItems = getItems;
