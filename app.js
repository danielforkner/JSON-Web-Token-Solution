const express = require('express');
const path = require('path');
require('dotenv').config();
const {
  models: { User, Note },
} = require('./db');

const app = express();

// middleware
app.use(express.json());

// routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/api/auth', async (req, res, next) => {
  try {
    res.send({ token: await User.authenticate(req.body) });
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/auth', async (req, res, next) => {
  try {
    res.send(await User.byToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/users/:userId/notes', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const notes = await Note.findAll({
      where: { userId },
      attributes: ['text'],
    });
    res.send(notes);
  } catch (ex) {
    next(ex);
  }
});

// error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message });
});

module.exports = app;
