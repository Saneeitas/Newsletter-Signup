/** @format */

const express = require("express");
const https = require("https");
const request = require("request");

const app = express();
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us18.api.mailchimp.com/3.0/lists/3ef2e68950";
  const options = {
    method: "POST",
    auth: "Saneeitas:c77a9bf5c8bceab2203ae76681f6d0fe-us18",
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

//c77a9bf5c8bceab2203ae76681f6d0fe-us18
//3ef2e68950

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});
