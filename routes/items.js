// routes/items.js
const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// GET 所有項目
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// POST 新增項目
router.post('/', async (req, res) => {
    const newItem = new Item(req.body);
    try {
        const item = await newItem.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;
