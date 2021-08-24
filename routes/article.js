const express = require("express");
const routes = express.Router();

const Article = require("../models/article");

routes.get("/", (req, res, next) => {
  Article.find({}, function (err, articles) {
    res.json({
      articles: articles,
      articlesCount: articles.length,
    });
  });
});

routes.post("/", (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const image = req.body.image;
  const body = req.body.body;
  const taglist = req.body.taglist;
  const created = Date.now();
  const updated = created;

  const article = new Article({
    title: title,
    description: description,
    image: image,
    body: body,
    taglist: taglist,
    created: created,
    updated: updated,
  });

  article.save().then((result) => {
    res.json(result);
  });
});

module.exports = routes;
