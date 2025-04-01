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

// 提供靜態檔案
app.use(express.static('public'));

// 正確的首頁路由（載入 index.html）
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// API 路由
const itemRoutes = require('./routes/items')(db);
app.use('/api/items', itemRoutes);

// 正確的 port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Firestore 測試（可保留）
db.collection('items').get()
    .then(snapshot => console.log("Firestore 連接成功"))
    .catch(err => console.error("Firestore 連接失敗", err));
