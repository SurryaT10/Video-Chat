const express = require("express");
const { getQuestions } = require('../post');

const router = express.Router();

router.get("/:id", async (req, res) => {
    const questions = getQuestions(req.params.id);
    res.json(questions);
});

module.exports =  router;