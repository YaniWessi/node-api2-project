const express = require("express");

const Dbs = require("./db.js"); // < fix the path

const router = express.Router(); //  <= this is creating a server

// toute handlers - handle what comes after /api/posts
router.post("/", (req, res) => {
  console.log(req.body);
  if (!req.body.title || !req.body.contents) {
    res
      .status(400)
      .json({ message: "make sure to include title and contents" });
  } else {
    Dbs.insert(req.body)
      .then(id => {
        res.status(201).json({ success: "sucess" });
      })
      .catch(err => {
        res.status(500).json({ error: "this was not inserted" });
      });
  }
});

router.post("/:id/comments", (req, res) => {
  Dbs.findById(req.params.id)
    .then(post => {
      if (post.length === 0) {
        res
          .status(400)
          .json({ message: " the post with the specified Id does not exit" });
      } else {
        if (!req.body.text) {
          res
            .status(400)
            .json({ errorMessage: "Please provide text for the comment." });
        } else {
          Dbs.insertComment({ ...req.body, post_id: req.params.id })
            .then(objectID => {
              res.status(201).json({ data: req.body });
            })
            .catch(error => {
              res.status(500).json({ errorMessage: " failed to add comment" });
            });
        }
      }
    })
    .catch(error => {
      res.status(500).json({ errorMessage: " failed to find id" });
    });
});

router.get("/", (req, res) => {
  Dbs.find().then(posts => {
    console.log(posts);
    res.status(200).json(posts);
  });
});

router.delete("/:id", (req, res) => {
  Dbs.findById(req.params.id)
    .then(post => {
      if (post.length === 0) {
        res
          .status(400)
          .json({ message: " the post with the specified Id does not exit" });
      } else {
        Dbs.remove(req.params.id)
          .then(post => {
            res
              .status(200)
              .json({ message: "The id has been succefully removed" });
          })
          .catch(error => {
            res.status(500).json({ errorMessage: " failed to remove" });
          });
      }
    })

    .catch(error => {
      res.status(500).json({ errorMessage: " post could not be removed" });
    });
});

router.put("/:id", (req, res) => {
  Dbs.findById(req.params.id)
    .then(post => {
      if (post.length === 0) {
        res
          .status(400)
          .json({ message: " the post with the specified Id does not exit" });
      } else {
        if (!req.body.title || !req.body.contents) {
          res
            .status(400)
            .json({ message: "make sure to include title and contents" });
        } else {
          Dbs.update(req.params.id, req.body)
            .then(post => {
              res.status(200).json({ body: req.body });
            })
            .catch(error => {
              res.status(500).json({ errorMessage: " post could not update" });
            });
        }
      }
    })
    .catch(error => {
      res.status(500).json({ errorMessage: " could not find it " });
    });
});

module.exports = router;
