const express = require("express");
const axios = require("axios");
var cors = require("cors");

const CLIENT_ID = "429fd9dacea61485f9ba";
const CLIENT_SECRET = "340299a003c42c9bcad8fa28a0db58388b0218e5";
const GITHUB_URL = "https://github.com/login/oauth/access_token";
const GITHUB_REVOKE_URL = `https://api.github.com/applications/${CLIENT_ID}/token`;

const app = express();
app.use(cors({ credentials: true, origin: true }));

app.get("/oauth/redirect", (req, res) => {
  console.log("We are in the redirect");
  axios({
    method: "POST",
    url: `${GITHUB_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`,
    headers: {
      Accept: "application/json",
    },
  }).then((response) => {
    res.redirect(
      `http://localhost:3000?access_token=${response.data.access_token}`
    );
  });
});

app.get("/api/returnAccessUrl", (res, req) => {
  req.send(
    "https://github.com/login/oauth/authorize?client_id=429fd9dacea61485f9ba&redirect_uri=http://localhost:8080/oauth/redirect"
  );
});

// prettier-ignore
app.get("/oauth/revoke", (req, res) => {
  const token = new URLSearchParams(window.location.search).get("access_token");
  const revoke = axios({
    method: "DELETE",
    auth: {username: CLIENT_ID,password:CLIENT_SECRET},
    data: `access_token: ${token}`,
    url: GITHUB_REVOKE_URL,
    headers: {
        Accept: "application/vnd.github+json"
    }
  }).then(
    console.log("Success")
  ).catch((e) => {
    console.log(e);
  });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
