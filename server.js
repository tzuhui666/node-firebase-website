// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 初始化 Firebase Admin SDK
const serviceAccount = require('./firebaseServiceAccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 提供靜態檔案 (前端)
app.use(express.static('public'));

// 測試路由
app.get('/', (req, res) => {
    res.send('Firebase Firestore is connected!');
});

// API 路由
const itemRoutes = require('./routes/items')(db);
app.use('/api/items', itemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
