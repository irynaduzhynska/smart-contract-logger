const {Router} = require('express');
const router = Router();
const {check} = require('express-validator');

const Api = require('../controllers/api.controller')

router.get("/", [], Api.index);

router.post("/sendlog", [
    check('card').isLength({max: 30}),
    check('amount').isLength({max: 30}),
    check('currency').isLength({max: 30})
], Api.logInBlockchain)

module.exports = router;