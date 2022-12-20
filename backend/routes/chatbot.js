/*
Ruta base: /api/chatbot
*/


const { Router } = require('express');
const { chatbot } = require("../controllers/chatbot");
const router = Router();
router.post('/chatbot', chatbot);
module.exports = router;