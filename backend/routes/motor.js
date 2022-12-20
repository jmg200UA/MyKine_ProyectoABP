const { Router } = require("express");

const router = Router();

const { abrirEntorno } = require('../WebGL/public/main');

router.get("/", [], abrirEntorno);