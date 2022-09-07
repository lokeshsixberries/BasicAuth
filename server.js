const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
console.log("server is running");
app.prepare().then(() => {
  const server = express();

  // basic auth username: admin, password: ib@123
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "staging") {
    const basicAuth = require("express-basic-auth");
    server.use(
      basicAuth({
        users: { test: "test" },
        challenge: true,
      })
    );
  }

  server.get("/service-worker.js", (req, res) => {
    app.serveStatic(req, res, "./.next/service-worker.js");
  });

  // scoping the service workers
  const serviceWorkers = [
    {
      filename: "service-worker.js",
      path: "./.next/service-worker.js",
    },
    {
      filename: "firebase-messaging-sw.js",
      path: "./static/firebase-messaging-sw.js",
    },
  ];

  serviceWorkers.forEach(({ filename, path }) => {
    server.get(`/${filename}`, (req, res) => {
      app.serveStatic(req, res, path);
    });
  });

  server.get("*", (req, res) => handle(req, res));

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
