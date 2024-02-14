const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Models = require("./models.js"),
  multer = require("multer"),
  multerS3 = require("multer-s3"),
  aws = require("aws-sdk");

const app = express();

const { check, validationResult } = require("express-validator");

app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const s3 = new aws.S3();

// Set up multer with S3 storage
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "imagebucketresizer",
    acl: "public-read", // Set the ACL for the uploaded file
    key: function (req, file, cb) {
      // Define the key (filename) for the uploaded file
      cb(null, "original-image-" + Date.now() + "-" + file.originalname);
    },
  }),
});

// allows CORs
const cors = require("cors");

// allows all to access (not recommended)
// app.use(cors());

// restrict origin using CORS
let allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:1234",
  "http://localhost:4200",
  "http://localhost:3000",
  "http://testsite.com",
  "https://bestmovielist.netlify.app",
  "https://genanderson.github.io",
  "http://myflixclient-bucket.s3-website-us-east-1.amazonaws.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          "The CORS policy for this application doesn’t allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

let auth = require("./auth.js")(app);
const passport = require("passport");
require("./passport.js");

const Movies = Models.Movie;
const Users = Models.User;

// allows mongoose to connect to local db to perform CRUD operations
// mongoose.connect("mongodb://localhost:27017/test", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

console.log(process.env);

// allows mongoose to connect to atlas db online
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log("MongoDB Connection URI:", process.env.CONNECTION_URI);

// welcome page response to user
app.get("/", (req, res) => {
  res.send("Welcome to my movies app! There's still a lot of work to be done!");
});

// get all movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

// get all users
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

// get specific movie
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((title) => {
        res.json(title);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

// get data about a genre
app.get(
  "/movies/genre/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.Name })
      .then((genre) => {
        res.json(genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

// get data about a director
app.get(
  "/movies/director/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find({ "Director.Name": req.params.Name })
      .then((director) => {
        if (director.length == 0) {
          return res
            .status(404)
            .send(
              "Error: no movies found with director name " + req.params.Name
            );
        }
        res.json(director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

// Post new user
app.post(
  "/users",
  // validation logic
  [
    check("Username", "Username needs more than 5 letters").isLength({
      min: 5,
    }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error:" + error);
      });
  }
);

app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Users.find()
      .then(function (users) {
        res.status(201).json(users);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get one user
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Users.findOne({ Username: req.params.Username })
      .then(function (user) {
        if (res.status(201)) {
          return res.json(user);
        }
        // return res.status(201).json(user);
      })
      .catch(function (err) {
        res.status(500).send("Error: " + err);
      });
  }
);

// Update user
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);
    let hashedPassword = Users.hashPassword(req.body.Password);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).send("Error: User not found");
        } else {
          return res.json(user);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Add movie to user's list of favorites
app.post(
  "/users/:Username/movies/:_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $addToSet: { FavoriteMovies: req.params._id },
      },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("Error: User was not found");
        } else {
          res.json(updatedUser);
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Delete movie from user's list of favorites
app.delete(
  "/users/:Username/movies/:_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params._id },
      },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("Error: User was not found");
        } else {
          res.json(updatedUser);
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Add image to user profile
app.post("/users/:Username/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Optionally, you can access the file URL in your S3 bucket
  const fileUrl = file.location;

  // Assuming the resized image has the same filename but with a different prefix
  const resizedFileKey = file.key.replace(
    "original-image",
    "resized-original-images"
  );

  // Optionally, you can access the file URL of the resized image in your S3 bucket
  const resizedFileUrl = `https://imagebucketresizer.s3.amazonaws.com/${resizedFileKey}`;

  res.json({
    message: "File uploaded and resized successfully",
    fileUrl,
    resizedFileUrl,
  });
});

// Delete a user
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found.");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port" + port);
});
