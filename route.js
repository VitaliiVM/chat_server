const express = require('express');
const router = express.Router();

router.get("/",(req, res) => {
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.send("Fuck you from Agent Smith!!!");
});

module.exports = router;