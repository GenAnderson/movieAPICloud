const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path");

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));

let movies = [
  {
    title: "Gladiator",
    year: "2000",
  },

  {
    title: "Labrinth",
    year: "1986",
  },
  { title: "Sprited Away", year: "2002" },
  { title: "Troy", year: "2004" },
  { title: "A Beautiful Mind", year: "2001" },
  { title: "Almost Famous", year: "2000" },
  { title: "The Time Traveler's Wife", year: "2009" },
  { title: "The Departed", year: "2006" },
  { title: "Grandma's Boy", year: "2006" },
  { title: "The Waterboy", year: "1998" },
];

app.use(morgan("common"));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome to my movies app! There's still a lot of work to be done!");
});

app.get("/movies", (req, res) => {
  res.json(movies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
