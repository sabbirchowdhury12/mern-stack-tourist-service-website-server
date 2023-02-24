const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

// midleware
app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log('code is running');
});