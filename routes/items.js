// routes/items.js
const express = require('express');

module.exports = (db) => {
    const router = express.Router();
    const collection = db.collection('items');

    // GET 所有項目
    router.get('/', async (req, res) => {
        try {
            const snapshot = await collection.get();
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            res.json(items);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // POST 新增項目
    router.post('/', async (req, res) => {
        try {
            const docRef = await collection.add(req.body);
            res.status(201).json({ id: docRef.id, ...req.body });
        } catch (err) {
            res.status(400).send(err.message);
        }
    });

    // PUT 更新項目
    router.put('/:id', async (req, res) => {
        try {
            await collection.doc(req.params.id).set(req.body, { merge: true });
            res.json({ id: req.params.id, ...req.body });
        } catch (err) {
            res.status(400).send(err.message);
        }
    });

    // DELETE 刪除項目
    router.delete('/:id', async (req, res) => {
        try {
            await collection.doc(req.params.id).delete();
            res.status(204).send();
        } catch (err) {
            res.status(400).send(err.message);
        }
    });

    return router;
};
