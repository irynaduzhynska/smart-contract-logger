const {validationResult} = require('express-validator');
const broadcastLogTransaction = require('../src/blockchain')
require('dotenv').config();

exports.index = (req, res) => {
    res.json({ message: "index" });
};

exports.logInBlockchain = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    broadcastLogTransaction(
        req.body.card,
        req.body.currency,
        req.body.amount,
    ).then(r => {
        return res.json(r);
    }).catch(e => {
        return res.send(e)
    })
};