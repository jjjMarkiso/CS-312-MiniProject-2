// Import needed Libraries
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

// Create application and set up port number for requests
const app = express();
const PORT = 3000;

// Set up public/view folders to use EJS and set up bodyParser if needed
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));

// Handle get requests to main page
app.get("/", (req, res) => {
    res.render("index");
});

// Read the user's name and posts it when delievering a joke, default to someone if no name is entered
app.post("/joke", async (req, res) => {
    const userName = req.body.name || "Someone";

    // call JokeAPI and filter out NSFW jokes, only allow programming jokes
    try {
        const response = await axios.get("https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit");

        let joke = "";
        
        // set up environment to allow both single and two part jokes for generation
        if (response.data.type === "single") {
            joke = response.data.joke;
        } else {
            joke = `${response.data.setup} ... ${response.data.delivery}`;
        }

        const images = [
            "/images/joke_image_one.png",
            "/images/joke_image_two.png",
            "/images/joke_image_three.png",
            "/images/joke_image_four.png",
        ];

        const randomImage = images[Math.floor(Math.random() * images.length)];

        // render the next page to display username and the provided joke
        res.render("joke", { name: userName, joke, image: randomImage });
        // error page if something goes wrong
    } catch (error) {
        res.render("joke", { name: userName, joke: "Oops! Couldn't fetch a joke", image: null });
    }
});
// Start the server on port 3000
app.listen(PORT, () => console.log(`Server running at https://localhost:${PORT}`));