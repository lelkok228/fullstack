require('dotenv').config()
const express = require('express');
const fs = require('fs').promises;
const morgan = require('morgan')
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();

const multerStorage = multer.diskStorage({
  destination: function (_req, _file, callback) {
    callback(null, './public');
  },
  filename: function (_req, file, callback) {
    const extensionWithDot = file.originalname.match(/\..+$/)[0];
    const fileName = uuidv4() + extensionWithDot;
    callback(null, fileName);
  }
});

const upload = multer({ storage: multerStorage });

app.use(morgan('dev'));
app.use((_req, res, next) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.set('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT');
  next();
})
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/jokes', async (_req, res, next) => {
  let fileContent;

  try {
    fileContent = await fs.readFile(path.join('database', 'jokes.json'), 'utf-8');
  } catch (error) {
    next(error);
    return;
  }

  if (!fileContent) {
    res.json({ jokes: [] });
    return;
  }

  let db;

  try {
    db = JSON.parse(fileContent);
  } catch (error) {
    db = { jokes: [] };
  }

  res.json(db);
});

app.post('/jokes', upload.single('file'), async (req, res, next) => {
  const jokeFields = JSON.parse(req.body.jokeFields);
  let fileContent;

  try {
    fileContent = await fs.readFile(path.join('database', 'jokes.json'), 'utf-8');
  } catch (error) {
    next(error);
    return;
  }

  let db;

  if (!fileContent) {
    db = { jokes: [] };
  }

  try {
    db = JSON.parse(fileContent);
  } catch (error) {
    db = { jokes: [] };
  }

  const joke = {
    title: jokeFields.title,
    joke: jokeFields.joke,
    url: req.file.filename ?? '#'
  };

  db.jokes.push(joke);

  try {
    await fs.writeFile(path.join('database', 'jokes.json'), JSON.stringify(db), 'utf-8');
  } catch (error) {
    next(error);
    return;
  }

  res.json(joke);
});

app.put('/jokes/:title', upload.single('file'), async (req, res, next) => {
  let fileContent;

  try {
    fileContent = await fs.readFile(path.join('database', 'jokes.json'), 'utf-8');
  } catch (error) {
    next(error);
    return;
  }

  let db;

  try {
    db = JSON.parse(fileContent);
  } catch (error) {
    db = { jokes: [] };
  }

  const oldJoke = db.jokes.find((joke) => joke.title === req.params.title);

  if (req.file && oldJoke.url) {
    await fs.unlink(path.join('public', oldJoke.url));
  }

  const updatedJoke = {
    ...JSON.parse(req.body.jokeFields),
    url: req.file
      ? req.file.filename
      : oldJoke.url
  };

  db.jokes = db.jokes.map((joke) => {
    if (joke.title !== req.params.title) {
      return joke;
    }

    return updatedJoke;
  });

  try {
    await fs.writeFile(path.join('database', 'jokes.json'), JSON.stringify(db), 'utf-8');
  } catch (error) {
    next(error);
    return;
  }

  res.json(updatedJoke);
});

app.delete('/jokes/:title', async (req, res, next) => {
  let fileContent;

  try {
    fileContent = await fs.readFile(path.join('database', 'jokes.json'), 'utf-8');
  } catch (error) {
    next(error);
    return;
  }

  let db;

  try {
    db = JSON.parse(fileContent);
  } catch (error) {
    db = { jokes: [] };
  }

  const jokeToDelete = db.jokes.find((joke) => joke.title === req.params.title);
  db.jokes = db.jokes.filter((joke) => joke.title !== req.params.title);

  try {
    await fs.writeFile(path.join('database', 'jokes.json'), JSON.stringify(db), 'utf-8');
  } catch (error) {
    next(error);
    return;
  }

  if (jokeToDelete) {
    await fs.unlink(path.join('public', jokeToDelete.url));
  }

  res.status(200).end();
});

app.listen(process.env.SERVER_PORT, async () => {
  console.log(`Server is online at port ${process.env.SERVER_PORT}`);

  let pathExists;

  try {
    pathExists = await fs.stat(path.join('database'));
  } catch (error) { }

  if (!pathExists) {
    await fs.mkdir(path.join('database'));
    await fs.writeFile(path.join('database', 'jokes.json'), '', 'utf-8');
  }

  try {
    pathExists = await fs.stat(path.join('public'));
  } catch (error) { }

  if (!pathExists) {
    await fs.mkdir(path.join('public'));
  }
});