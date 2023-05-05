const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

const app = express();

app.use(morgan("common"));
app.use(bodyParser.json());

let users = [
  { id: 1, name: "Jessica", favoriteMovies: [] },
  { id: 2, name: "Cohen", favoriteMovies: ["Troy"] },
  { id: 3, name: "Lisa", favoriteMovies: [] },
];

let movies = [
  {
    title: "Gladiator",
    year: "2000",
    description:
      "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    genre: {
      name: "drama",
      description:
        "The drama genre features stories with high stakes and many conflicts. They're plot-driven and demand that every character and scene move the story forward.",
    },
    director: {
      name: "Ridley Scott",
      born: "November 30, 1937",
      bio: 'Described by film producer Michael Deeley as "the very best eye in the business", director Ridley Scott was born on November 30, 1937 in South Shields, Tyne and Wear. His father was an officer in the Royal Engineers and the family followed him as his career posted him throughout the United Kingdom and Europe before they eventually returned to Teesside.',
    },
    imageUrl:
      "https://throughthesilverscreenuk.files.wordpress.com/2016/08/gladiator-movie-poster.jpg",
    featured: "no",
  },
  {
    title: "Sprited Away",
    year: "2001",
    description:
      "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches and spirits, a world where humans are changed into beasts.",
    genre: {
      name: "adventure",
      description:
        "An adventure film is a form of adventure fiction, and is a genre of film. Subgenres of adventure films include swashbuckler films, pirate films, and survival films.",
    },
    director: {
      name: "Hayao Miyazaki",
      born: "January 5, 1941",
      bio: "Hayao Miyazaki is 1 of Japan's greatest animation directors. The entertaining plots, compelling characters & breathtaking animation in his films have earned him international renown from critics as well as public recognition within Japan.He was born on January 5, 1941 in Tokyo. He started his career in 1963 as an animator at the studio Toei Douga studio, and was subsequently involved in many early classics of Japanese animation.",
    },
    imageUrl:
      "https://ogden_images.s3.amazonaws.com/www.lockhaven.com/images/2020/09/23170417/Spirited-poster-555x840.jpg",
    featured: "no",
  },
  {
    title: "Troy",
    year: "2004",
    description:
      "An adaptation of Homer's great epic, the film follows the assault on Troy by the united Greek forces and chronicles the fates of the men involved.",
    genre: {
      name: "drama",
      description:
        "The drama genre features stories with high stakes and many conflicts. They're plot-driven and demand that every character and scene move the story forward.",
    },
    director: {
      name: "Wolfgang Petersen",
      born: "March 14, 1941 - August 12, 2022",
      bio: "A controversial film maker, Wolfgang Petersen has at once been lauded for his professionalism and attention to detail and decried for turning out a string of standard commercial Hollywood blockbusters. The son of a naval officer, Petersen held a lifelong fascination with the sea and naval subjects. ",
    },
    imageUrl:
      "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/a07wLy4ONfpsjnBqMwhlWTJTcm.jpg",
    featured: "no",
  },
  {
    title: "Almost Famous",
    year: "2000",
    description:
      "A high-school boy in the early 1970s is given the chance to write a story for Rolling Stone magazine about an up-and-coming rock band as he accompanies them on their concert tour.",
    genre: {
      name: "adventure",
      description:
        "An adventure film is a form of adventure fiction, and is a genre of film. Subgenres of adventure films include swashbuckler films, pirate films, and survival films.",
    },
    director: {
      name: "Cameron Crowe",
      year: "July 13, 1957",
      bio: "Certainly idiosyncratic as a writer, Cameron Crowe has created a series of scripts that, while liked by the critics, were considered offbeat and difficult to market.Cameron Bruce Crowe was born in Palm Springs, California, to Alice Marie Crowe (née George), a teacher and activist, and James A. Crowe, a real estate/telephone business owner. ",
    },
    imageUrl:
      "https://static.wikia.nocookie.net/paramount/images/9/92/AlmostFamous_%282000%29.png/revision/latest?cb=20211015031434",
    featured: "no",
  },

  {
    title: "The Departed",
    year: "2006",
    description:
      "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.",
    genre: {
      name: "crime",
      description:
        "Crime films, in the broadest sense, is a film genre inspired by and analogous to the crime fiction literary genre. Films of this genre generally involve various aspects of crime and its detection.",
    },
    director: {
      name: "Martin Scorsese",
      born: "November 17, 1942",
      bio: "Martin Charles Scorsese was born on November 17, 1942 in Queens, New York City, to Catherine Scorsese (née Cappa) and Charles Scorsese, who both worked in Manhattan's garment district, and whose families both came from Palermo, Sicily. ",
    },
    imageUrl:
      "https://images.sr.roku.com/idType/roku/context/global/id/40b6f11aa31959ed99059014faf5b4ba/images/gracenote/assets/p162564_v_v11_ak.jpg/magic/396x0/filters:quality(70)",
    featured: "no",
  },

  {
    title: "The Waterboy",
    year: "1998",
    description:
      "A waterboy for a college football team discovers he has a unique tackling ability and becomes a member of the team.",
    genre: {
      name: "comedy",
      description:
        "Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter, especially in theatre, film, stand-up comedy, television, radio, books, or any other entertainment medium",
    },
    director: {
      name: "Frank Coraci",
      born: "February 3, 1966",
      bio: "Frank Coraci is an American film Director, Writer and Actor best know for his work with Adam Sandler.Coraci was born in Shirley, New York on Long Island. Coraci graduated from New York University's Tisch School of the Arts in 1988 with a bachelor's degree in Film.",
    },
    imageUrl:
      "https://resizing.flixster.com/P5ciqYem7JZjxgi6fJZ1NH217CI=/206x305/v2/https://flxt.tmsimg.com/assets/p21986_p_v8_aa.jpg",
    featured: "no",
  },
];

app.get("/", (req, res) => {
  res.send("Welcome to my movies app! There's still a lot of work to be done!");
});

// Gets data for all movies
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

// Gets data about a single movie by name
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("Could not find movie");
  }
});

// Gets data about a genre by name/title
app.get("/movies/genre/:name", (req, res) => {
  const { name } = req.params;
  const genre = movies.find((movie) => movie.genre.name === name).genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("Could not find genre");
  }
});

// Gets data about a director by name
app.get("/movies/director/:name", (req, res) => {
  const { name } = req.params;
  const director = movies.find(
    (movie) => movie.director.name === name
  ).director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("Could not find director");
  }
});

// Allows new users to register
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("Name required");
  }
});

// Allows users to update usernames
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("No such user");
  }
});

// Add movie to favorites
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send("No such user");
  }
});

// Delete movie to favorites
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send("No such user");
  }
});

// Allow users to deregister
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);
    res.status(200).send(`User ${id} has been deleted`);
  } else {
    res.status(400).send("No such user");
  }
});

app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
