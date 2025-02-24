// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));


// MongoDB 連線
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// 範例 API
app.get('/', (req, res) => {
    res.send('Node.js and MongoDB are connected!');
});

// 啟動伺服器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



const itemRoutes = require('./routes/items');
app.use('/api/items', itemRoutes);
