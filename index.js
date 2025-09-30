const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/joke", async (req, res) => {
    const userName = req.body.name || "Someone";

    try {
        const response = await axios.get("https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit");

        let joke = "";
        
        if (response.data.type === "single") {
            joke = response.data.joke;
        } else {
            joke = `${response.data.setup} ... ${response.data.delivery}`;
        }

        res.render("joke", { name: userName, joke });
    } catch (error) {
        res.render("joke", { name: userName, joke: "Oops! Couldn't fetch a joke" });
    }
});

app.listen(PORT, () => console.log(`Server running at https://localhost:${PORT}`));