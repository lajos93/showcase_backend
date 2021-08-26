const express = require("express");
const routes = express.Router();
const functions = require("../shared/functions");

const Article = require("../models/article");
const token = require("../shared/token");

routes.get("/", (req, res, next) => {
  Article.find({}, function (err, articles) {
    return res.json({
      articles: articles,
      articlesCount: articles.length,
    });
  });
});

routes.post("/", (req, res, next) => {
  const title = req.body.title.trim();
  const slug = functions.createSlug(title);
  const description = req.body.description;
  const image = req.body.image;
  const body = req.body.body;
  const taglist = req.body.taglist;
  const created = Date.now();
  const updated = created;

  const article = new Article({
    title: title,
    slug: slug,
    description: description,
    image: image,
    body: body,
    taglist: taglist,
    created: created,
    updated: updated,
  });

  article.save().then((result) => {
    return res.json(result);
  });
});

routes.put("/:slug", (req, res, next) => {
  const slug = req.params.slug;

  const title = req.body.title;
  const description = req.body.description;
  const image = req.body.image;
  const body = req.body.body;
  const taglist = req.body.taglist;
  const updated = Date.now();

  const filter = { slug: slug };
  const update = {
    title: title,
    description: description,
    slug: slug,
    image: image,
    body: body,
    taglist: taglist,
    updated: updated,
  };

  Article.findOneAndUpdate(
    filter,
    { $set: update },
    {
      new: true,
      upsert: false,
    }
  ).then((result) => {
    if (!result) {
      return res.json({ message: "Article is not found" });
    }

    return res.json(result);
  });
});

routes.delete("/:slug", token.verifyToken, (req, res, next) => {
  const slug = req.params.slug;
  const filter = { slug: slug };

  Article.findOneAndDelete(filter).then((result) => {
    if (!result) {
      return res.json({ message: "Article is not found" });
    }
    return res.json(result);
  });
});

module.exports = routes;
