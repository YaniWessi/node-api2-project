const express = require("express");

const DbsRouter = require("./data/dbs-router.js");

server = express();

server.use(express.json()); // needed to parse JSON from the body

server.get("/", (req, res) => {
  res.send(`
    <h2>Lambda Hubs Api </h2>
    <p>Welcome to the Lambda Posts API</p>`);
});

// for URLs begining with /api/posts
server.use("/api/posts", DbsRouter);

const port = 5000;

server.listen(port, () => console.log(`\n** API on port ${port} \n`));
